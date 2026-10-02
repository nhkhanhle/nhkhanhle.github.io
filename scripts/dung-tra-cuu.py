# -*- coding: utf-8 -*-
"""Dựng dữ liệu cho trang Thư viện luật (thu-vien-luat.html, trước là tra-cuu-luat.html) từ thư mục contexts của dự án Labor Relations.
Chạy lại mỗi khi Khánh thêm hoặc thay văn bản trong contexts:  python3 scripts/dung-tra-cuu.py

Đọc: các nhóm nhân sự cốt lõi trong NHOM (tên thư mục trong contexts). Mỗi file .md là một văn bản, tách theo "Điều N."
Ghi: tra-cuu/du-lieu/muc-luc.json (danh sách nhóm, văn bản, chương, số điều, ngày cập nhật)
     tra-cuu/du-lieu/<mã nhóm>.json (toàn văn từng điều của nhóm đó, trang chỉ tải khi cần)
Tên ngắn văn bản lấy từ bảng tra trong contexts/phap-luat-lao-dong.md; không có thì lấy loại + số hiệu.
Từ 02/10/2026 thân mỗi điều qua bước chuyển sang dạng cho người đọc (dong_logic, noi_dong, tach_dieu): xem chú thích ở đó.
Chỉ đọc file .md, không ghi gì vào thư mục contexts."""
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

# ---------- Bước chuyển sang dạng cho người đọc (Khánh yêu cầu 02/10/2026) ----------
# File .md bên Labor Relations giữ nguyên, chỉ đọc. Bước này biến markdown và HTML lẫn trong .md thành các dòng sạch:
#   - bảng (HTML hay markdown) thành dòng bảng có dấu riêng, trang dựng lại thành bảng kẻ ô;
#   - khối Nơi nhận và chữ ký cuối văn bản tách riêng, trang trình bày gọn (Nơi nhận chữ nhỏ, chữ ký canh phải);
#   - phụ lục, biểu mẫu, chú thích cuối văn bản hợp nhất (mọi thứ sau chữ ký) bỏ ra, trừ quy định, điều lệ, quy chế ban hành kèm theo;
#   - in đậm, in nghiêng bỏ thành chữ trơn; ký tự thoát, đường kẻ, dấu chú thích bỏ;
#   - dòng bị ngắt giữa câu (văn bản chép từ PDF) nối lại thành đoạn, số trang lẻ bỏ.
# Dấu trong chữ "than" của mỗi điều (trang assets/thu-vien-luat.js đọc):
#   DONG_BANG đầu dòng là một hàng bảng, ô cách nhau bằng O_BANG; DAU_BANG ngay sau là hàng tiêu đề;
#   NOI_NHAN đầu dòng là một mục Nơi nhận; CHUC_VU là dòng chức vụ người ký; TEN_KY là tên người ký.
import html as _html
from html.parser import HTMLParser

DONG_BANG, O_BANG, DAU_BANG = '␞', '␟', '␝'
NOI_NHAN, CHUC_VU, TEN_KY = '␛', '␜', '␚'
DAU_RIENG = (DONG_BANG, NOI_NHAN, CHUC_VU, TEN_KY)

RE_KY = re.compile(r'^(Nơi nhận\s*:|(?:TM|KT|Q|TL|PP|T/M)\s*\.\s*[A-ZĐÂĂÊÔƠƯÁÀẢÃẠ]|CHỦ TỊCH QUỐC HỘI|XÁC THỰC VĂN BẢN HỢP NHẤT)')
RE_MUC = re.compile(r'^(\d+(\.\d+)*[a-zđ]?[\.\)]\s|[a-zđ]{1,2}\d?\)|[-+•–]\s|Điều \d|Chương |Mục \d|Phần |[IVXLC]+[\.\)]\s|[“"])')

def sach_dong(s):
    """Làm sạch chữ trong một dòng: chú thích, số mũ, thẻ HTML còn sót, ký tự thoát, đậm nghiêng (thành chữ trơn)."""
    s = re.sub(r'\[(?:\s*<[^>]+>)*\s*\\?\[\d+\\?\]\s*(?:<[^>]+>\s*)*\]\(#\\?_ftn(?:ref)?\d+\)', '', s)
    s = re.sub(r'<sup>\s*\d+\s*</sup>', '', s)
    s = re.sub(r'<[a-zA-Z/][^>]*>', ' ', s)
    s = _html.unescape(s)
    s = re.sub(r'\[[\s*]*\\?\[\s*\d+\s*\\?\][\s*]*\]\(#\\?_ftn(?:ref)?\d+\)', '', s)
    s = re.sub(r'\[[\s*]*\d+[\s*]*\]\(#\\?_ftn(?:ref)?\d+\)', '', s)
    s = re.sub(r'\[\[[^\]]*\]\]', '', s)
    s = re.sub(r'\\([\\`*_{}\[\]()#+\-.!|<>=~"\'&$%@^/])', r'\1', s)
    s = re.sub(r'\*\*(.*?)\*\*', r'\1', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)([^*\n]+?)(?<!\s)\*(?![\w*])', r'\1', s)
    s = re.sub(r'(?<![\w_])__(.+?)__(?![\w_])', r'\1', s)
    s = re.sub(r'(?<![\w_])_(?!\s)([^_\n]+?)(?<!\s)_(?![\w_])', r'\1', s)
    s = s.replace('**', '')
    s = re.sub(r'^\*\s+', '- ', s)          # dấu * đầu dòng làm gạch đầu dòng
    s = s.replace('*', '')                   # dấu * nghiêng lẻ còn sót (Điều 84*,*, 7*.*)
    s = re.sub(r'\[\[\d+\]\]\([^)]*\)|\[\^\d+\]', '', s)    # chú thích kiểu [[2]](#...) và [^1]
    s = re.sub(r'(?<=[\w.,;:)”])\[\d+\]', '', s)               # số chú thích dính vào chữ: xin[1], 1.[2]
    s = re.sub(r'^\s*#+\s+', '', s)
    s = s.replace(' ', ' ').replace('​', '')
    s = re.sub(r'[ \t]+', ' ', s).strip()
    if re.fullmatch(r'[-_=~*]{3,}|[*_\s]*', s):
        return ''   # dòng chỉ có dấu kẻ, dấu sao lẻ (giữ "=", "+" đứng một mình: ô công thức trong bảng)
    return s

class _BangHTML(HTMLParser):
    """Đọc một bảng HTML thành danh sách hàng, mỗi hàng là danh sách (chữ ô, là ô tiêu đề)."""
    def __init__(self):
        super().__init__(convert_charrefs=True); self.hang = []; self.o = None; self.th = False
    def handle_starttag(self, tag, a):
        if tag == 'tr': self.hang.append([])
        elif tag in ('td', 'th'):
            if not self.hang: self.hang.append([])
            self.o = []; self.th = tag == 'th'
        elif tag in ('br', 'p', 'li', 'div') and self.o is not None: self.o.append('\n')
    def handle_endtag(self, tag):
        if tag in ('td', 'th') and self.o is not None:
            self.hang[-1].append((''.join(self.o), self.th)); self.o = None
        elif tag in ('p', 'li', 'div') and self.o is not None: self.o.append('\n')
    def handle_startendtag(self, tag, a):
        if tag == 'br' and self.o is not None: self.o.append('\n')
    def handle_data(self, d):
        if self.o is not None: self.o.append(d)

def _o_sach(c):
    """Chữ một ô: giữ xuống dòng (br, ký tự dọc), mỗi dòng làm sạch."""
    c = c.replace('\x0b', '\n').replace('<br>', '\n')
    c = re.sub(r'<br\s*/?>', '\n', c)
    return [x for x in (sach_dong(d) for d in c.split('\n')) if x]

def phat_bang(hang, dau_hang):
    """Hàng bảng (danh sách ô thô) -> các dòng logic. Bảng chữ ký hay bảng một cột thì trải ra thành dòng thường."""
    o = [[_o_sach(c) for c in h] for h in hang]
    giu = [(h, dau_hang[k]) for k, h in enumerate(o) if any(h)]
    if not giu: return []
    so_cot = max(len(h) for h, _ in giu)
    cot_co = [j for j in range(so_cot) if any(j < len(h) and h[j] for h, _ in giu)]
    chu = '\n'.join(d for h, _ in giu for c in h for d in c)
    mot_cot = all(sum(1 for c in h if c) <= 1 for h, _ in giu)
    if mot_cot or re.search(r'(^|\n)\s*(Nơi nhận\s*:|(?:TM|KT|Q|TL|PP|T/M)\s*\.\s*[A-ZĐ]|CHỦ TỊCH QUỐC HỘI|XÁC THỰC VĂN BẢN HỢP NHẤT)', chu):
        return [d for h, _ in giu for c in h for d in c]
    ra = []
    for h, la_dau in giu:
        cac = [' '.join(h[j]) if j < len(h) else '' for j in cot_co]
        ra.append(DONG_BANG + (DAU_BANG if la_dau else '') + O_BANG.join(cac))
    return ra

def _tach_o_ong(d):
    d = d.strip()
    if d.startswith('|'): d = d[1:]
    if d.endswith('|') and not d.endswith('\\|'): d = d[:-1]
    return [x.replace('\\|', '|') for x in re.split(r'(?<!\\)\|', d)]

def dong_logic(md):
    """Văn bản .md -> danh sách dòng logic đã sạch (bảng thành dòng bảng, khối chữ ký trải thành dòng thường)."""
    md = md.replace('\r\n', '\n').replace('\r', '\n')
    # 1. Bảng HTML: thay bằng các dòng đã dựng sẵn, đặt trong chỗ giữ để bước sau không làm sạch lại
    giu = []
    def thay_bang(m):
        p = _BangHTML(); p.feed(m.group(0)); p.close()
        hang = [[c for c, _ in h] for h in p.hang]
        dau = [bool(h) and all(t for _, t in h) for h in p.hang]
        if len(hang) >= 3 and not any(dau) and len(hang[0]) >= 2:
            dau[0] = all(c.strip() and len(c.strip()) < 60 for c in hang[0])
        giu.append(phat_bang(hang, dau))
        return '\n\x00%d\x00\n' % (len(giu) - 1)
    md = re.sub(r'<table\b.*?</table>', thay_bang, md, flags=re.S | re.I)
    # 2. Thẻ HTML ngoài bảng: xuống dòng ở br, p, div, li; bỏ thẻ khác
    md = re.sub(r'<br\s*/?>|</?(p|div|li|ul|ol|h\d)\b[^>]*>', '\n', md, flags=re.I)
    # 3. Đi từng dòng: gom bảng markdown, làm sạch dòng thường
    ra, L, i = [], md.split('\n'), 0
    while i < len(L):
        d = L[i]
        m = re.fullmatch(r'\s*\x00(\d+)\x00\s*', d)
        if m:
            ra.extend(giu[int(m.group(1))]); i += 1; continue
        if d.lstrip().startswith('|') and d.rstrip().endswith('|') and d.count('|') >= 2:
            khoi = []
            while i < len(L) and L[i].lstrip().startswith('|'):
                khoi.append(L[i]); i += 1
            hang, dau = [], []
            for k, x in enumerate(khoi):
                o = _tach_o_ong(x)
                if all(re.fullmatch(r'\s*:?-{2,}:?\s*', c) or not c.strip() for c in o) and any('-' in c for c in o):
                    if hang: dau[-1] = True   # hàng trước dấu --- là tiêu đề
                    continue
                hang.append(o); dau.append(False)
            if dau and dau[0] and not any(c.strip() for c in hang[0]): dau[0] = False
            ra.extend(phat_bang(hang, dau)); continue
        for x in d.replace('\x0b', '\n').split('\n'):
            x = sach_dong(x)
            if x: ra.append(x)
        i += 1
    return ra

def _la_dau(x): return bool(x) and x[0] in DAU_RIENG
def _ket_cau(x): return bool(re.search(r'[.;:!?]["”’)]*$', x))

def noi_dong(L):
    """Nối dòng bị ngắt giữa câu, bỏ số trang lẻ. Văn bản chép từ PDF (nhiều dòng ngắt) nối thêm dòng dài không có dấu kết câu."""
    L = [x for x in L if not re.fullmatch(r'\d{1,3}', x)]
    thuong = [k for k in range(len(L) - 1) if not _la_dau(L[k]) and not _la_dau(L[k + 1])]
    ngat = sum(1 for k in thuong if not _ket_cau(L[k]) and L[k + 1][:1].islower() and not RE_MUC.match(L[k + 1]))
    pdf = len(thuong) > 20 and ngat / len(thuong) > 0.08
    ra = []
    for x in L:
        if ra and not _la_dau(x) and not _la_dau(ra[-1]) and not _ket_cau(ra[-1]) and not RE_MUC.match(x) and not RE_KY.match(x) and not RE_KY.match(ra[-1]):
            truoc = ra[-1]
            noi = x[:1].islower() or (pdf and len(truoc) >= 50 and truoc.upper() != truoc and x.upper() != x)
            if noi:
                ra[-1] = truoc + ' ' + x; continue
        ra.append(x)
    return ra

def _tach_ten(s):
    """'CHỦ TỊCH QUỐC HỘI Trần Thanh Mẫn' hay 'CHỦ TỊCH QUỐC HỘINguyễn Thị Kim Ngân' -> (chức vụ, tên)."""
    for k in range(len(s) - 1):
        if s[k].isupper() and s[k + 1].islower():
            vai, ten = s[:k].strip(), s[k:].strip()
            if _la_ten(ten) and (not vai or vai.upper() == vai): return vai, ten
            return None
    return None

def _la_ten(s):
    w = s.split()
    return 2 <= len(w) <= 6 and all(x[0].isupper() and (len(x) == 1 or x[1:].islower()) and x.isalpha() for x in w)

RE_DIEU = re.compile(r'^\s*\**\s*Điều (\d+[a-z]?)\s*\\?\.\s*\**\s*(.*?)\s*\**\s*$')
RE_CHUONG = re.compile(r'^\s*\**\s*(Chương [IVXLC\d]+|Mục \d+|Phần [IVXLC\d]+)\s*\**\s*[:.\-]?\s*(.*?)\**\s*$')
RE_KEM = re.compile(r'^(QUY ĐỊNH|ĐIỀU LỆ|QUY CHẾ)$')
RE_PHU_LUC = re.compile(r'^(PHỤ LỤC|Phụ lục|MẪU SỐ|Mẫu số|BIỂU MẪU|Biểu mẫu)\b')
RE_BAT_DAU_TV = re.compile(r'^(Căn cứ|Kính gửi|Thực hiện|Để |Nhằm )')

def tach_dieu(md, toan_van=False):
    """Tách văn bản thành các điều trên các dòng logic đã sạch (dong_logic, noi_dong). Trả về (danh sách điều, danh sách chương).
    Chế độ: 'dau' trước điều đầu tiên; 'than' trong thân; 'ky' đang đọc khối Nơi nhận và chữ ký; 'sau' sau chữ ký (phụ lục, biểu mẫu, chú thích: bỏ);
    'kem' quy định, điều lệ, quy chế ban hành kèm theo sau chữ ký (giữ, đánh số điều lại từ 1).
    toan_van: văn bản không chia điều, cả thân là một mục 'Toàn văn' bắt đầu từ dòng Căn cứ, Kính gửi... (hay sau dòng ngày ký)."""
    L = noi_dong(dong_logic(md))
    if not toan_van:
        # Điều đầu tiên nằm sau Nơi nhận, chữ ký: đó là điều trong biểu mẫu phụ lục (văn bản chính không chia điều), đọc như toàn văn
        d1 = next((k for k, x in enumerate(L) if not _la_dau(x) and RE_DIEU.match(x)), None)
        k1 = next((k for k, x in enumerate(L) if k > 15 and not _la_dau(x) and RE_KY.match(x)), None)
        if d1 is not None and k1 is not None and k1 < d1:
            return tach_dieu(md, toan_van=True)
    dieu, chuong = [], []
    chuong_ht, cho_ten_chuong, hien = '', None, None
    che_do, ky, cho_nhan = 'dau', None, 0
    if toan_van:
        bd = next((k for k, x in enumerate(L[:80]) if RE_BAT_DAU_TV.match(x)), None)
        if bd is None:
            bd = next((k + 1 for k, x in enumerate(L[:60]) if re.search(r'ngày \S+ tháng \S+ năm \d{4}', x)), 0)
        L = L[bd:]
        hien = {'so': '', 'tieuDe': 'Toàn văn', 'chuong': '', 'than': ''}
        dieu.append(hien); che_do = 'than'

    def them(x):
        hien['than'] = (hien['than'] + '\n' + x) if hien['than'] else x

    def xong_ky():
        nonlocal ky
        if hien is not None and ky and (ky['nhan'] or ky['vai'] or ky['ten']):
            for x in ky['nhan']: them(NOI_NHAN + x)
            for x in ky['vai']: them(CHUC_VU + x)
            if ky['ten']: them(TEN_KY + ky['ten'])
        ky = None

    def doc_ky(x):
        """Một dòng trong khối chữ ký. Trả về True khi đã gặp tên người ký (hết khối)."""
        if x.startswith('Nơi nhận'):
            sau_ = x.split(':', 1)[1].strip(' -') if ':' in x else ''
            if sau_: ky['nhan'].append(sau_)
            return False
        if re.match(r'^[-+•]\s*', x) and not ky['vai']:
            ky['nhan'].append(re.sub(r'^[-+•]\s*', '', x)); return False
        if re.fullmatch(r'\(?\s*[Đđ]ã ký\s*\)?|\(?\s*[Kk]ý tên, đóng dấu\s*\)?|\./\.|\(?[Kk]ý,? ghi rõ họ tên\)?', x):
            return False
        t = _tach_ten(x)
        if t:
            if t[0]: ky['vai'].append(t[0])
            ky['ten'] = t[1]; return True
        if x.upper() == x and re.search(r'[A-ZĐ]', x) and len(x) < 90:
            ky['vai'].append(x); return False
        if _la_ten(x):
            ky['ten'] = x; return True
        if ky['nhan'] and not ky['vai'] and x[:1].islower():
            ky['nhan'][-1] += ' ' + x
        return False

    for line in L:
        if not line.strip():
            continue
        t = line.strip()
        dau = _la_dau(t)
        if che_do == 'ky':
            if not dau and RE_DIEU.match(t) and not ky['vai']:
                # báo nhầm: chưa thấy chức vụ mà đã gặp điều mới, trả các dòng đã gom về thân
                for x in ky['nhan']: them(x)
                ky = None; che_do = 'than'
            else:
                ky['dem'] += 1
                if not dau and doc_ky(t):
                    xong_ky(); che_do = 'sau'; cho_nhan = 4
                elif ky['dem'] > 80:
                    xong_ky(); che_do = 'sau'; cho_nhan = 0
                continue
        if che_do == 'sau':
            if not dau and t.startswith('Nơi nhận') and cho_nhan > 0 and dieu:
                # khối Nơi nhận nằm sau tên người ký (ô bên phải đứng trước trong bảng): gom nốt vào điều cuối
                ky = {'nhan': [], 'vai': [], 'ten': '', 'dem': 0}; doc_ky(t); che_do = 'nhan'
                continue
            cho_nhan -= 1
            if not dau and RE_KEM.match(t):
                che_do = 'kem'; hien = None; chuong_ht = ''
            continue
        if che_do == 'nhan':
            if not dau and re.match(r'^[-+•]\s*', t):
                ky['nhan'].append(re.sub(r'^[-+•]\s*', '', t)); continue
            if not dau and ky['nhan'] and t[:1].islower():
                ky['nhan'][-1] += ' ' + t; continue
            for x in ky['nhan']: them(NOI_NHAN + x)
            ky = None; che_do = 'sau'
            if not dau and RE_KEM.match(t):
                che_do = 'kem'; hien = None; chuong_ht = ''
            continue
        # che_do: dau, than, kem
        if che_do != 'dau' and not dau and RE_KY.match(t) and hien is not None:
            ky = {'nhan': [], 'vai': [], 'ten': '', 'dem': 0}
            che_do = 'ky'
            if doc_ky(t):
                xong_ky(); che_do = 'sau'; cho_nhan = 4
            continue
        if che_do == 'kem' and not dau and RE_PHU_LUC.match(t) and len(t) < 160:
            che_do = 'sau'; cho_nhan = 0; continue
        if not dau:
            mc = RE_CHUONG.match(t)
            if mc and len(t) < 160 and (hien is None or mc.group(1).startswith('Chương')) and not toan_van:
                nhan, ten = mc.group(1), mc.group(2).strip()
                if not ten:
                    cho_ten_chuong = nhan; chuong_ht = nhan
                else:
                    chuong_ht = nhan + ' · ' + (ten[:1] + ten[1:].lower() if ten.upper() == ten else ten)
                    cho_ten_chuong = None
                if nhan.startswith('Chương'):
                    chuong.append(chuong_ht)
                if nhan.startswith('Chương'):
                    hien = None
                continue
            if cho_ten_chuong is not None:
                if (len(t) < 160 or (t.upper() == t and len(t) < 320)) and not RE_DIEU.match(t):
                    chuong_ht = cho_ten_chuong + ' · ' + (t[:1] + t[1:].lower() if t.upper() == t else t)
                    if cho_ten_chuong.startswith('Chương') and chuong and chuong[-1] == cho_ten_chuong:
                        chuong[-1] = chuong_ht
                    cho_ten_chuong = None
                    continue
                cho_ten_chuong = None
            md_ = RE_DIEU.match(t)
            if md_ and not toan_van:
                so, tieu = md_.group(1), md_.group(2).strip()
                than_dau = ''
                if len(tieu) > 320 or (tieu and tieu[-1] in '.;:' and len(tieu) > 60):
                    than_dau, tieu = tieu, ''
                hien = {'so': so, 'tieuDe': tieu, 'chuong': chuong_ht, 'than': than_dau}
                dieu.append(hien)
                if che_do == 'dau': che_do = 'than'
                continue
        if hien is not None and che_do != 'dau':
            them(t)
    if che_do == 'ky': xong_ky()
    if che_do == 'nhan' and ky:
        for x in ky['nhan']: them(NOI_NHAN + x)
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
            dieu, chuong = tach_dieu(md, toan_van=True)
            bao.append('không chia điều, giữ toàn văn: ' + os.path.basename(p))
        tn = ten_ngan.get(fid) or ((loai + ' ' + so_hieu).strip())
        hl = hieu_luc(dieu)
        if loai == 'Văn bản hợp nhất':
            # Văn bản hợp nhất: giữ cách tính trước 02/10, 3 khúc cuối khi cắt .md gốc theo dòng Điều (gồm cả chú thích sau chữ ký, nay đã bỏ khỏi thân điều)
            khuc = re.split(r'(?m)^\s*\**\s*Điều \d+[a-z]?\s*\\?\.', md)
            hl = hieu_luc([{'than': sach(k)} for k in khuc[1:]]) or hl
        vb = {'id': fid, 'soHieu': so_hieu, 'loai': loai, 'ten': ten, 'tenNgan': tn, 'ngayKy': ngay_ky,
              'hieuLuc': hl, 'soDieu': len(dieu), 'chuong': chuong,
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
# Phiên bản dữ liệu: trang gắn vào địa chỉ file nhóm (?v=) để trình duyệt tải bản mới mỗi lần dựng lại (trước dùng bộ nhớ đệm mãi, Khánh thấy bản cũ 02/10)
import hashlib
_h = hashlib.md5()
for n in muc_luc['nhom']:
    _h.update(io.open('tra-cuu/du-lieu/' + n['ma'] + '.json', 'rb').read())
muc_luc['phienBan'] = _h.hexdigest()[:10]
io.open('tra-cuu/du-lieu/muc-luc.json', 'w', encoding='utf-8').write(json.dumps(muc_luc, ensure_ascii=False, separators=(',', ':')))

for b in bao: print(b)
for n in muc_luc['nhom']:
    print('%-40s %2d văn bản %4d điều  %5.0f KB' % (n['ten'], n['soVanBan'], n['soDieu'], os.path.getsize('tra-cuu/du-lieu/' + n['ma'] + '.json') / 1024))
    for v in n['vanBan']:
        print('   %-22s %-14s %-40s ký %-10s hl %-10s %3d điều %2d chương | %s' % (v['soHieu'], v['loai'], v['tenNgan'][:40], v['ngayKy'] or '?', v['hieuLuc'] or '?', v['soDieu'], len(v['chuong']), v['ten'][:70]))
print('Tổng: %d văn bản, %d điều. Mục lục %.0f KB' % (tong_vb, tong_dieu, os.path.getsize('tra-cuu/du-lieu/muc-luc.json') / 1024))
