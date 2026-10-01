# -*- coding: utf-8 -*-
"""Dựng dữ liệu cho trang Thư viện luật (thu-vien-luat.html, trước là tra-cuu-luat.html) từ thư mục contexts của dự án Labor Relations.
Chạy lại mỗi khi Khánh thêm hoặc thay văn bản trong contexts:  python3 scripts/dung-tra-cuu.py

Đọc: các nhóm nhân sự cốt lõi trong NHOM (tên thư mục trong contexts). Mỗi file .md là một văn bản, tách theo "Điều N."
Ghi: tra-cuu/du-lieu/muc-luc.json (danh sách nhóm, văn bản, chương, số điều, ngày cập nhật)
     tra-cuu/du-lieu/<mã nhóm>.json (toàn văn từng điều của nhóm đó, trang chỉ tải khi cần)
Tên ngắn văn bản lấy từ bảng tra trong contexts/phap-luat-lao-dong.md; không có thì lấy loại + số hiệu."""
import io, re, os, json, glob, unicodedata, datetime

GOC = '/Users/copmocrang/Documents/Claude/Projects/Corporate Brand/data/processed/landing-page'
NGUON = '/Users/copmocrang/Documents/Claude/Projects/Labor Relations/data/contexts'
os.chdir(GOC)

# Thư mục trong contexts -> mã nhóm và tên hiện trên trang. Tên thư mục so khớp sau khi bỏ dấu, để không lệch vì chữ đ.
NHOM = [
    ('Bo luat Lao dong 2019', 'lao-dong', 'Bộ luật Lao động'),
    ('Luat Bao hiem xa hoi 2024', 'bhxh', 'Bảo hiểm xã hội'),
    ('Luat Bao hiem y te', 'bhyt', 'Bảo hiểm y tế'),
    ('Luat Viec lam 2025', 'viec-lam', 'Việc làm và bảo hiểm thất nghiệp'),
    ('Luat Cong doan 2024', 'cong-doan', 'Công đoàn'),
    ('Luat An toan, ve sinh lao dong', 'atvsld', 'An toàn, vệ sinh lao động'),
    ('Luat Thue thu nhap ca nhan 2025', 'thue-tncn', 'Thuế thu nhập cá nhân'),
    ('Luat Bao ve du lieu ca nhan', 'du-lieu-ca-nhan', 'Bảo vệ dữ liệu cá nhân'),
    ('Luat Nguoi lao dong Viet Nam di lam viec o nuoc ngoai theo hop dong', 'di-nuoc-ngoai', 'Người lao động đi làm việc ở nước ngoài'),
]

def bo_dau(s):
    s = unicodedata.normalize('NFD', s).replace('đ', 'd').replace('Đ', 'D')
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn')

def sach(md):
    """Bỏ ký hiệu markdown, giữ chữ thuần.
    01/10/2026 (Khánh báo Điều 7a VBHN 22/VBHN-VPQH): văn bản hợp nhất chuyển từ Word mang dấu chú thích cuối trang
    dạng [<span class="underline">\\[16\\]</span>](#_ftn16), số mũ <sup>5</sup>, thẻ bảng <table><tr><td>, dấu ** lẻ và ký tự thoát \\[.
    Bỏ dấu chú thích và số mũ, bỏ mọi thẻ HTML (chữ trong ô bảng giữ lại, mỗi ô một dòng), gỡ ký tự thoát, bỏ ** lẻ."""
    md = re.sub(r'\[(?:\s*<[^>]+>)*\s*\\?\[\d+\\?\]\s*(?:<[^>]+>\s*)*\]\(#\\?_ftn(?:ref)?\d+\)', '', md)
    md = re.sub(r'<sup>\s*\d+\s*</sup>', '', md)
    md = re.sub(r'<[a-zA-Z/][^>]*>', ' ', md)
    md = md.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    md = md.replace('\\[', '[').replace('\\]', ']')
    md = re.sub(r'\[[\s*]*\[\s*\d+\s*\][\s*]*\]\(#\\?_ftn(?:ref)?\d+\)', '', md)   # lượt hai: chú thích có khoảng trắng, sau khi đã bỏ thẻ; có thể bọc dấu * nghiêng; dấu gạch dưới có thể còn ký tự thoát (#\_ftn)
    md = re.sub(r'\[[\s*]*\d+[\s*]*\]\(#\\?_ftn(?:ref)?\d+\)', '', md)   # dấu trỏ ngược trong phần chú thích cuối văn bản: [ 1 ](#_ftnref1)
    md = re.sub(r'\[\[[^\]]*\]\]', '', md)
    md = md.replace('\\.', '.').replace('\\-', '-').replace('\\_', '_').replace('\\*', '*')
    md = re.sub(r'\*\*(.*?)\*\*', r'\1', md)
    md = re.sub(r'(?<!\*)\*(?!\*)([^*\n]+)\*(?!\*)', r'\1', md)
    md = md.replace('**', '')
    md = re.sub(r'^\s*#+\s*', '', md, flags=re.M)
    md = re.sub(r'[ \t]+', ' ', md)
    return md.strip()

LOAI = [('BỘ LUẬT', 'Bộ luật'), ('LUẬT', 'Luật'), ('NGHỊ ĐỊNH', 'Nghị định'), ('THÔNG TƯ', 'Thông tư'), ('NGHỊ QUYẾT', 'Nghị quyết'),
        ('QUYẾT ĐỊNH', 'Quyết định'), ('HƯỚNG DẪN', 'Hướng dẫn'), ('VĂN BẢN HỢP NHẤT', 'Văn bản hợp nhất'), ('CÔNG VĂN', 'Công văn')]

def doc_dau(md, so_hieu):
    """Loại văn bản, tên đầy đủ, ngày ký lấy từ phần đầu (trước 'Căn cứ')."""
    dau = md[:6000]
    i = re.search(r'\*?Căn cứ', dau)
    dau_s = sach(dau[:i.start()] if i else dau)
    loai, ten = '', ''
    dong = [d.strip() for d in dau_s.split('\n') if d.strip()]
    for k, d in enumerate(dong):
        for KEY, nhan in LOAI:
            if d.upper().strip('* ') == KEY or d.upper().startswith(KEY + ' '):
                loai = nhan
                phan = [d[len(KEY):].strip()] if d.upper().startswith(KEY + ' ') and len(d) > len(KEY) + 1 else []
                for d2 in dong[k+1:]:
                    if re.match(r'^(Căn cứ|Số:|Hà Nội|\|)', d2) or d2.upper() == d2 and d2.startswith('ĐOÀN'):
                        break
                    if d2.upper() == d2 and len(d2) > 3 and not re.match(r'^\d', d2):
                        phan.append(d2)
                    elif phan:
                        break
                ten = ' '.join(p for p in phan if p).strip()
                break
        if loai: break
    if loai == 'Văn bản hợp nhất' or 'VBHN' in so_hieu:
        loai = 'Văn bản hợp nhất'
    ten = re.sub(r'<[^>]+>|\[\d+\]|\(#_ftn\d+\)|[\[\]]', '', ten)
    ten = re.sub(r'^Số:\s*\S+\s*', '', ten, flags=re.I)
    ten = re.sub(r'_{3,}', '', ten)
    ten = re.sub(r'\s+', ' ', ten).strip(' .')
    ten = ten[:1] + ten[1:].lower() if ten else ''
    ten = re.sub(r'\bbộ luật lao động\b', 'Bộ luật Lao động', ten, flags=re.I)
    truoc = dau[:i.start()] if i else dau
    m = re.search(r'ngày (\d{1,2}) tháng (\d{1,2}) năm (\d{4})', truoc) or re.search(r'ngày (\d{1,2})/(\d{1,2})/(\d{4})', truoc)
    ngay_ky = '%s-%02d-%02d' % (m.group(3), int(m.group(2)), int(m.group(1))) if m else ''
    return loai, ten, ngay_ky

def hieu_luc(dieu):
    """Ngày có hiệu lực: tìm trong 3 điều cuối (điều khoản thi hành)."""
    for d in dieu[-3:]:
        t = d['than']
        m = re.search(r'có hiệu lực(?: thi hành)?(?: kể)? từ ngày (\d{1,2}) tháng (\d{1,2}) năm (\d{4})', t)
        if not m:
            m = re.search(r'có hiệu lực(?: thi hành)?(?: kể)? từ ngày (\d{1,2})/(\d{1,2})/(\d{4})', t)
        if m:
            return '%s-%02d-%02d' % (m.group(3), int(m.group(2)), int(m.group(1)))
    return ''

RE_DIEU = re.compile(r'^\s*\**\s*Điều (\d+[a-z]?)\s*\\?\.\s*\**\s*(.*?)\s*\**\s*$')
RE_CHUONG = re.compile(r'^\s*\**\s*(Chương [IVXLC\d]+|Mục \d+|Phần [IVXLC\d]+)\s*\**\s*[:.\-]?\s*(.*?)\**\s*$')

def tach_dieu(md):
    """Tách văn bản thành các điều. Trả về (danh sách điều, danh sách chương)."""
    lines = md.split('\n')
    dieu, chuong = [], []
    chuong_ht, cho_ten_chuong, hien = '', None, None
    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            if cho_ten_chuong is not None and cho_ten_chuong != '':
                cho_ten_chuong = None
            continue
        mc = RE_CHUONG.match(line)
        if mc and len(line) < 140 and not hien or (mc and len(line) < 140 and mc.group(1).startswith('Chương')):
            nhan, ten = mc.group(1), sach(mc.group(2))
            if not ten:
                cho_ten_chuong = nhan  # tên chương ở dòng kế
                chuong_ht = nhan
            else:
                chuong_ht = nhan + ' · ' + ten
                cho_ten_chuong = None
            if nhan.startswith('Chương'):
                chuong.append(chuong_ht)
            hien = None if nhan.startswith('Chương') else hien
            continue
        if cho_ten_chuong is not None:
            ten = sach(line)
            if ten and len(ten) < 160 and not RE_DIEU.match(line):
                chuong_ht = cho_ten_chuong + ' · ' + (ten[:1] + ten[1:].lower() if ten.upper() == ten else ten)
                if cho_ten_chuong.startswith('Chương') and chuong and chuong[-1] == cho_ten_chuong:
                    chuong[-1] = chuong_ht
                cho_ten_chuong = None
                continue
            cho_ten_chuong = None
        md_ = RE_DIEU.match(line)
        if md_:
            so, tieu = md_.group(1), sach(md_.group(2))
            # Trường hợp "**Điều 2.** Quyết định này..." : phần sau dấu chấm là thân, không phải tiêu đề
            than_dau = ''
            if len(tieu) > 140 or (tieu and tieu[-1] in '.;:' and len(tieu) > 60):
                than_dau, tieu = tieu, ''
            hien = {'so': so, 'tieuDe': tieu, 'chuong': chuong_ht, 'than': than_dau}
            dieu.append(hien)
            continue
        if hien is not None:
            t = sach(line)
            if t:
                hien['than'] = (hien['than'] + '\n' + t) if hien['than'] else t
    # Bỏ điều trùng số (văn bản hợp nhất lặp) chỉ khi thân rỗng
    return [d for d in dieu if d['than'] or d['tieuDe']], chuong

# Tên ngắn từ bảng tra
ten_ngan = {}
bang = io.open(os.path.join(NGUON, 'phap-luat-lao-dong.md'), encoding='utf-8').read()
for m in re.finditer(r'^\|\s*\*\*(.+?)\*\*(.*?)\|.*?\[\[([^\]|]+)\]\]', bang, re.M):
    ten = m.group(1).strip()
    ten = re.split(r'\s+[—–-]\s+', ten)[0]
    ten = re.sub(r'\s*\(.*?\)\s*$', '', ten).strip()
    fid = m.group(3).strip()
    if fid not in ten_ngan:
        ten_ngan[fid] = ten

thu_muc = {bo_dau(d): d for d in os.listdir(NGUON) if os.path.isdir(os.path.join(NGUON, d))}
os.makedirs('tra-cuu/du-lieu', exist_ok=True)
muc_luc = {'capNhat': datetime.date.today().isoformat(), 'nhom': []}
tong_vb = tong_dieu = 0
bao = []
for tm, ma, ten_nhom in NHOM:
    d = thu_muc.get(bo_dau(tm))
    if not d:
        print('!! không thấy thư mục', tm); continue
    van_ban, du_lieu = [], {}
    for p in sorted(glob.glob(os.path.join(NGUON, d, '**', '*.md'), recursive=True)):
        fid = os.path.splitext(os.path.basename(p))[0]
        md = io.open(p, encoding='utf-8').read()
        so_hieu = re.sub(r'_m_\d+$', '', fid).replace('_', '/', 1).replace('_', '/')
        loai, ten, ngay_ky = doc_dau(md, so_hieu)
        dieu, chuong = tach_dieu(md)
        if not dieu:
            # Văn bản không chia điều (hướng dẫn, nghị quyết): giữ làm một mục 'Toàn văn' để vẫn tìm được
            than = sach(re.sub(r'\[\[[^\]]*\]\]', '', md))
            dieu = [{'so': '', 'tieuDe': 'Toàn văn', 'chuong': '', 'than': than}]
            bao.append('không chia điều, giữ toàn văn: ' + os.path.basename(p))
        tn = ten_ngan.get(fid) or ((loai + ' ' + so_hieu).strip())
        vb = {'id': fid, 'soHieu': so_hieu, 'loai': loai, 'ten': ten, 'tenNgan': tn, 'ngayKy': ngay_ky,
              'hieuLuc': hieu_luc(dieu), 'soDieu': len(dieu), 'chuong': chuong,
              'thuMuc': os.path.relpath(os.path.dirname(p), os.path.join(NGUON, d)).replace('.', '')}
        van_ban.append(vb); du_lieu[fid] = dieu
        tong_vb += 1; tong_dieu += len(dieu)
    # Luật gốc lên đầu (file nằm ngay trong thư mục nhóm), rồi nghị định, thông tư...
    thu_tu = {'Bộ luật': 0, 'Luật': 0, 'Văn bản hợp nhất': 1, 'Nghị định': 2, 'Nghị quyết': 3, 'Thông tư': 4, 'Quyết định': 5, 'Hướng dẫn': 6, 'Công văn': 7, '': 8}
    van_ban.sort(key=lambda v: (0 if v['thuMuc'] == '' else 1, thu_tu.get(v['loai'], 8), v['ngayKy'] or '9'))
    muc_luc['nhom'].append({'ma': ma, 'ten': ten_nhom, 'tep': 'tra-cuu/du-lieu/' + ma + '.json',
                            'soVanBan': len(van_ban), 'soDieu': sum(v['soDieu'] for v in van_ban), 'vanBan': van_ban})
    io.open('tra-cuu/du-lieu/' + ma + '.json', 'w', encoding='utf-8').write(json.dumps(du_lieu, ensure_ascii=False, separators=(',', ':')))
muc_luc['tongVanBan'] = tong_vb; muc_luc['tongDieu'] = tong_dieu
io.open('tra-cuu/du-lieu/muc-luc.json', 'w', encoding='utf-8').write(json.dumps(muc_luc, ensure_ascii=False, separators=(',', ':')))

for b in bao: print(b)
for n in muc_luc['nhom']:
    print('%-40s %2d văn bản %4d điều  %5.0f KB' % (n['ten'], n['soVanBan'], n['soDieu'], os.path.getsize('tra-cuu/du-lieu/' + n['ma'] + '.json') / 1024))
    for v in n['vanBan']:
        print('   %-22s %-14s %-40s ký %-10s hl %-10s %3d điều %2d chương | %s' % (v['soHieu'], v['loai'], v['tenNgan'][:40], v['ngayKy'] or '?', v['hieuLuc'] or '?', v['soDieu'], len(v['chuong']), v['ten'][:70]))
print('Tổng: %d văn bản, %d điều. Mục lục %.0f KB' % (tong_vb, tong_dieu, os.path.getsize('tra-cuu/du-lieu/muc-luc.json') / 1024))
