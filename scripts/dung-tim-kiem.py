# -*- coding: utf-8 -*-
"""Dựng bộ dữ liệu cho ô tìm kiếm: góc nhìn, bài viết, các phần của trang chủ.
Chạy lại mỗi khi đổi chữ trên trang."""
import io, re, os, json, glob

GOC = '/Users/copmocrang/Documents/Claude/Projects/Corporate Brand/data/processed/landing-page'
os.chdir(GOC)

def bochu(html):
    """Bỏ thẻ, lấy chữ thuần."""
    html = re.sub(r'<(script|style|svg)[^>]*>.*?</\1>', ' ', html, flags=re.S|re.I)
    html = re.sub(r'<[^>]+>', ' ', html)
    html = (html.replace('&nbsp;',' ').replace('&amp;','&').replace('&quot;','"')
                .replace('&lt;','<').replace('&gt;','>').replace('&#39;',"'"))
    return re.sub(r'\s+', ' ', html).strip()

muc = []

# ---------- Góc nhìn ----------
for p in sorted(glob.glob('chu-de/*.html')):
    s = io.open(p, encoding='utf-8').read()
    ten = re.search(r'<h1>(.*?)</h1>', s, re.S).group(1).strip()
    # Đầu trang kiểu sổ vẽ (25/09) không còn số và đoạn diễn giải hiện trên trang: lấy số từ data-so-thu-tu, diễn giải từ meta description
    stt = re.search(r'data-so-thu-tu="(\d+)"', s).group(1)
    mo = bochu(re.search(r'<meta name="description" content="([^"]*)"', s).group(1))
    muc.append({'loai':'Góc nhìn','nhan':'Góc nhìn '+stt,'tieuDe':ten,'mo':mo,
                'duongDan':p,'chu':ten+' '+mo})

# ---------- Bài viết ----------
for p in sorted(glob.glob('bai-viet/*.html')):
    if p.endswith(('mau-bai-viet.html','dang-thuc-hien.html')): continue
    s = io.open(p, encoding='utf-8').read()
    ten = bochu(re.search(r'<title>(.*?)</title>', s, re.S).group(1)).split(' · ')[0]
    mo = re.search(r'<meta name="description" content="([^"]*)"', s).group(1)
    nhan = bochu(re.search(r'<div class="nhan">(.*?)</div>', s, re.S).group(1))
    than = re.search(r'<article class="tc than-tc">(.*?)</article>', s, re.S).group(1)
    than = re.sub(r'<div class="cho-viet">.*?</div>', ' ', than, flags=re.S)  # bỏ ghi chú nháp
    muc.append({'loai':'Bài viết','nhan':nhan,'tieuDe':ten,'mo':mo,
                'duongDan':p,'chu':ten+' '+mo+' '+bochu(than)})

# ---------- Các phần của trang chủ ----------
s = io.open('index.html', encoding='utf-8').read()
# Phần có id nằm trên section, hoặc trên khối bọc ngay ngoài section (như .xuong bọc lời chào và dải số, 25/09)
for m in re.finditer(r'(?:<section[^>]*\sid="([^"]+)"[^>]*>|<div[^>]*\sid="([^"]+)"[^>]*>\s*<section[^>]*>)(.*?)</section>', s, re.S):
    ma, than = m.group(1) or m.group(2), m.group(3)
    h = re.search(r'<h2[^>]*>(.*?)</h2>', than, re.S)
    if not h: continue
    ten = bochu(h.group(1))
    chu = bochu(than)
    muc.append({'loai':'Trang chủ','nhan':'Trang chủ','tieuDe':ten,
                'mo':chu[:170]+('…' if len(chu)>170 else ''),
                'duongDan':'#'+ma,'chu':ten+' '+chu})

ra = ('/* Dữ liệu cho ô tìm kiếm. File này do scripts dựng lại, đừng sửa tay.\n'
      '   Dựng lại sau mỗi lần đổi chữ trên trang. */\n'
      'window.TIM_KIEM = ' + json.dumps(muc, ensure_ascii=False, indent=0).replace('\n', '') + ';\n')
io.open('assets/tim-kiem-du-lieu.js', 'w', encoding='utf-8').write(ra)
print('Đã dựng %d mục: %d góc nhìn, %d bài viết, %d phần trang chủ. Kích thước %.1f KB'
      % (len(muc), sum(1 for x in muc if x['loai']=='Góc nhìn'),
         sum(1 for x in muc if x['loai']=='Bài viết'),
         sum(1 for x in muc if x['loai']=='Trang chủ'),
         os.path.getsize('assets/tim-kiem-du-lieu.js')/1024))
