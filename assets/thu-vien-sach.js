/* Thư viện sách (thu-vien-sach.html): phòng đọc phương án A, kệ "tủ cổ ba chiều", hiệu ứng B + C (Khánh chọn 01/10/2026). Dữ liệu ở thu-vien.js.
   Tủ hai ngăn: Sách, Khóa học (Hộp phiếu ghi chú và dữ liệu ghi chú đã bỏ, Khánh 05/10). Cuốn dangDoc:true dựng mặt bìa; cuốn khác là gáy cao bằng nhau, dày theo số trang (trang trong thu-vien.js,
   Khánh đổi 02/10), rê chuột hay đang mở thì gáy xoay
   chính diện thành bìa và các cuốn phía sau dịt ra (PhongDoc.xepHang chia hàng).
   Bấm một cuốn: bìa bay sang quyển sổ một mặt (assets/phep-thuat-thu-vien.js): bìa lớn và thông tin; "Đọc thêm" mở sổ lớn giữa màn hình
   (trái: bìa và thông tin, phải: vì sao đáng đọc).
   Khánh chỉnh 01/10, đồng bộ với Thư viện luật. Ô tìm nằm dưới sổ (Khánh 05/10; điện thoại ở trên sổ), làm mờ những mục không khớp. */
(function(){
  var D=window.THU_VIEN||{}, sach=D.sach||[], PD=window.PhongDoc||null;
  var tu=document.querySelector('[data-tu]'), so=document.querySelector('[data-phieu]'), soTrai=document.querySelector('[data-so-trai]');
  if(!tu||!so||!soTrai)return;
  function q(s,g){return (g||document).querySelector(s)}
  function tao(tag,cls,chu){var e=document.createElement(tag);if(cls)e.className=cls;if(chu!=null)e.textContent=chu;return e}
  function boDau(s){return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase()}
  function nhanMau(cha,m){if(m.mau)cha.appendChild(tao('span','tv-mau','Mẫu'))}

  /* Màu theo góc nhìn (cùng sáu góc nhìn ở trang chủ); nhóm khác dùng màu cát đậm. Hình trên bìa theo góc nhìn, cùng nét với bìa trang chủ */
  var MAU={'Nghề nhân sự':['#2F3B4A','#3B4859','#26303C'],'Hệ thống quản trị':['#4A5868','#56657A','#3A4552'],'Tâm lý học':['#5E6B5A','#6A7866','#46523F'],'Trí tuệ nhân tạo':['#8A5A44','#9A6650','#6B4232'],'Pháp luật lao động':['#6B3F43','#7A4A4F','#4F2C30'],'Chuyện công sở':['#7A6A4F','#8A7A5E','#5F5240']};
  var HINH={'Nghề nhân sự':'<path d="M30 14h40v72H30z"/><path d="M40 30h20M40 42h20M40 54h12"/><path d="M60 66l6 6 10-12"/>','Hệ thống quản trị':'<rect x="14" y="14" width="30" height="30" rx="4"/><rect x="56" y="14" width="30" height="30" rx="4"/><rect x="14" y="56" width="30" height="30" rx="4"/><rect x="56" y="56" width="30" height="30" rx="4"/><path d="M44 29h12M29 44v12M71 44v12M44 71h12"/>','Tâm lý học':'<path d="M50 86c-20 0-32-14-32-30 0-20 14-34 32-34s32 14 32 34c0 16-12 30-32 30z"/><path d="M38 46c4-6 20-6 24 0M50 52v14"/>','Trí tuệ nhân tạo':'<rect x="26" y="26" width="48" height="48" rx="8"/><path d="M26 40H14M26 60H14M86 40H74M86 60H74M40 26V14M60 26V14M40 86V74M60 86V74"/><circle cx="50" cy="50" r="8"/>','Pháp luật lao động':'<path d="M50 16v68M32 84h36M18 28h64"/><circle cx="50" cy="13" r="3"/><path d="M18 28 8 54M18 28l10 26M82 28 72 54M82 28l10 26"/><path d="M5 54h26a13 9 0 0 1-26 0zM69 54h26a13 9 0 0 1-26 0z"/>','Chuyện công sở':'<path d="M18 30h50a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H40l-14 12V68h-8a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8z"/><path d="M60 50h24a8 8 0 0 1 0 16"/>'};
  function mau(m){return MAU[m.nhom]||['#5F5240','#6E6150','#4A3F30']}
  function hinh(m){var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 100 100');s.setAttribute('aria-hidden','true');s.innerHTML=HINH[m.nhom]||'<path d="M30 14h40v72H30z"/><path d="M40 30h20M40 42h20M40 54h12"/>';return s}
  function veBia(m,lon){
    var c=mau(m), b=tao('span','bia'+(lon?' so-bia':'')); b.style.setProperty('--m2',c[1]); b.style.setProperty('--m3',c[2]);
    b.appendChild(tao('span','nhan',m.loai||'Sách')); if(m.nam)b.appendChild(tao('span','nam',m.nam));
    b.appendChild(hinh(m)); b.appendChild(tao('b',null,m.ten||'')); if(m.tacGia)b.appendChild(tao('small',null,m.tacGia));
    return b;
  }

  /* Dòng báo khi còn chữ giữ chỗ */
  var dsSach=sach.filter(function(m){return m.loai!=='Khóa học'}), dsKhoa=sach.filter(function(m){return m.loai==='Khóa học'});
  if(sach.some(function(m){return m.mau})){var bao=q('[data-tv-bao]');if(bao)bao.classList.add('hien')}

  /* ---------- Sổ ---------- */
  var dangChon=null, cacNut=[];
  function chon(nut){dangChon=nut;cacNut.forEach(function(b){b.setAttribute('aria-pressed',b===nut?'true':'false')});if(PD)PD.chon(nut)}
  /* Đầu trang sổ: nhãn, tên (dấu sáp đỏ "nk" bên phải đã bỏ, Khánh 02/10) */
  function dauTrang(nhan,ten,m){
    var d=tao('div','so-dau'), t=tao('div'); t.appendChild(tao('p','nhan',nhan));
    var h=tao('h2',null,ten); if(m)nhanMau(h,m); t.appendChild(h); d.appendChild(t);
    return d;
  }
  function veDauSo(cuon){
    soTrai.scrollTop=0;
    if(getComputedStyle(so.parentNode).position==='sticky')return;
    if(!cuon)return;
    var y=so.getBoundingClientRect().top; if(y<0||y>innerHeight*.6)window.scrollTo({top:y+window.scrollY-84,behavior:PD&&PD.giam?'auto':'smooth'});
  }
  function bang(cha,dong){
    var dl=tao('dl','pd-the');
    dong.forEach(function(r){if(!r[1])return;dl.appendChild(tao('dt',null,r[0]));var dd=tao('dd');if(r[2])dd.appendChild(tao('span','so-vang',r[1]));else dd.textContent=r[1];dl.appendChild(dd)});
    if(dl.children.length)cha.appendChild(dl); return dl;
  }
  function doan(cha,chu){
    var v=tao('div','pd-van'); (chu||'').split(/\n\s*\n/).forEach(function(p){if(p.trim())v.appendChild(tao('p',null,p.trim()))}); cha.appendChild(v); return v;
  }
  /* Nút "Đọc thêm" cuối trang sổ */
  function nutDocThem(nhan,moLon){
    var b=tao('button','pd-doc-them'); b.type='button'; b.appendChild(tao('span',null,'Đọc thêm'));
    b.setAttribute('aria-label','Đọc thêm: '+nhan); b.addEventListener('click',function(){moLon(b)}); return b;
  }
  function phieuSach(m,nut,cuon){
    var khoa=m.loai==='Khóa học', moi=dangChon!==nut; chon(nut);
    soTrai.innerHTML='';
    soTrai.appendChild(dauTrang(khoa?'Khóa học':'Sách',m.ten||'',m));
    var biaLon=veBia(m,true); biaLon.classList.add('sang'); soTrai.appendChild(biaLon);
    var dl=bang(soTrai,[[khoa?'Nơi dạy':'Tác giả',m.tacGia],[khoa?'Nơi học':'Xuất bản',m.noi],['Năm',m.nam,true],['Góc nhìn',m.nhom]]);
    soTrai.appendChild(nutDocThem('vì sao đáng '+(khoa?'học ':'đọc ')+(m.ten||''),function(b){docSach(m,b)}));
    veDauSo(cuon);
    var tuBia=nut&&nut.querySelector('.bia');
    function xong(){soTrai.classList.remove('cho-bay');if(PD)PD.vietMuc(dl)}
    if(PD&&moi&&tuBia&&cuon){soTrai.classList.add('cho-bay');PD.baySach(tuBia,biaLon,veBia(m,false),xong)}else xong();
  }
  /* Sổ lớn của một cuốn: trái là bìa và thông tin, phải là vì sao đáng đọc */
  function docSach(m,nutGoc){
    if(!PD)return;
    var khoa=m.loai==='Khóa học', trai=tao('div'), phai=tao('div','mo-dieu');
    trai.appendChild(dauTrang(khoa?'Khóa học':'Sách',m.ten||'',m));
    trai.appendChild(veBia(m,true));
    bang(trai,[[khoa?'Nơi dạy':'Tác giả',m.tacGia],[khoa?'Nơi học':'Xuất bản',m.noi],['Năm',m.nam,true],['Góc nhìn',m.nhom]]);
    var doc=tao('button','pd-doc-them'); doc.type='button'; doc.appendChild(tao('span',null,'Vì sao đáng '+(khoa?'học':'đọc')));
    doc.classList.add('mo-ve-phai'); doc.addEventListener('click',function(){PD.xemPhai(true)}); trai.appendChild(doc);
    var ve=tao('button','mo-ve','Bìa'); ve.type='button'; ve.addEventListener('click',function(){PD.xemPhai(false)}); phai.appendChild(ve);
    phai.appendChild(dauTrang('Vì sao đáng '+(khoa?'học':'đọc'),m.ten||'',null));
    var van=m.viSao?doan(phai,m.viSao):phai.appendChild(tao('p','pd-goi','Khánh chưa viết vì sao đáng '+(khoa?'học':'đọc')+' cuốn này.'));
    if(m.lienKet){var a=tao('a','pd-lien',khoa?'Xem khóa học ↗':'Xem sách ↗');a.href=m.lienKet;a.target='_blank';a.rel='noopener';phai.appendChild(a)}
    PD.moLon(trai,phai,nutGoc); PD.vietMuc(van);
  }

  /* ---------- Tủ ---------- */
  /* Đầu ngăn chỉ còn tên (dòng đếm cuốn, khóa đã bỏ, Khánh 02/10) */
  function ngan(ten){
    var n=tao('section','pd-ngan'); n.setAttribute('aria-label','Ngăn '+ten);
    var d=tao('div','pd-ngan-ten'); d.appendChild(tao('h2',null,ten)); n.appendChild(d);
    tu.appendChild(n);
    return n;
  }
  /* Xếp các nút của một ngăn thành hàng; ngăn trống thì một hàng có dòng báo */
  function xep(n,nuts,trong){
    if(!nuts.length){var h=tao('div','pd-hang');h.appendChild(tao('p','pd-trong',trong));n.appendChild(h);return}
    if(PD)PD.xepHang(n,nuts); else{var h2=tao('div','pd-hang');h2.style.flexWrap='wrap';nuts.forEach(function(x){h2.appendChild(x)});n.appendChild(h2)}
  }
  var muc=[];
  function nutBia(m){
    var nut=tao('button','bia-dung'); nut.setAttribute('data-r',146); nut.appendChild(veBia(m,false)); return nut;
  }
  /* Gáy cao 176px như gáy luật; dày theo căn bậc hai số trang (trang: 200 trang ≈ 38px, 500 ≈ 47px, 900 ≈ 55px), không ghi số trang thì 40px, khóa học 36px */
  function nutGay(m){
    var khoa=m.loai==='Khóa học', dai=(m.ten||'').length>16, tr=+m.trang||0;
    var r=tr?Math.round(Math.min(56,Math.max(dai?40:30,22+Math.sqrt(tr)*1.1))):(dai?44:(khoa?36:40));
    var nut=tao('button','gay'); nut.style.setProperty('--r',r+'px'); nut.setAttribute('data-r',r); nut.style.setProperty('--h','176px'); nut.style.setProperty('--m',mau(m)[0]);
    var khoi=tao('span','gay-khoi'), than=tao('span','gay-than');
    than.appendChild(tao('b',dai?'hai':null,m.ten||'')); than.appendChild(tao('small',null,m.nam||(khoa?'KHÓA':'SÁCH'))); khoi.appendChild(than);
    var mat=veBia(m,false); mat.classList.add('gay-bia'); khoi.appendChild(mat); nut.appendChild(khoi);
    return nut;
  }
  function gan(nut,m){
    nut.type='button'; nut.setAttribute('aria-pressed','false');
    nut.setAttribute('aria-label',(m.loai||'Sách')+': '+(m.ten||'')+(m.tacGia?', '+m.tacGia:''));
    nut.addEventListener('click',function(){phieuSach(m,nut,true)});
    cacNut.push(nut); muc.push({nut:nut,chu:boDau([m.ten,m.tacGia,m.noi,m.nhom,m.viSao,m.loai].join(' '))});
    return nut;
  }
  var dangDoc=dsSach.filter(function(m){return m.dangDoc})[0]||null;
  var n1=ngan('Sách');
  xep(n1,dsSach.map(function(m){return gan(m===dangDoc?nutBia(m):nutGay(m),m)}),'Ngăn này đang được xếp.');
  var n2=ngan('Khóa học');
  xep(n2,dsKhoa.map(function(m){return gan(nutGay(m),m)}),'Ngăn này đang được xếp.');
  /* Chú giải màu dưới tủ đã bỏ (Khánh 05/10) */
  if(PD){PD.dom();PD.nghe(tu);PD.datDen(tu)}   /* ba thanh đèn mỗi ngăn như tủ luật (Khánh 03/10) */

  /* ---------- Ô tìm: làm mờ mục không khớp ---------- */
  var oLoc=q('[data-loc]'), locDem=q('[data-loc-dem]');
  if(oLoc)oLoc.addEventListener('input',function(){
    var tu_=boDau(oLoc.value).split(/\s+/).filter(Boolean), thay=0;
    muc.forEach(function(x){var khop=!tu_.length||tu_.every(function(w){return x.chu.indexOf(w)>=0});x.nut.classList.toggle('mo-nhat',!khop);if(khop)thay++});
    if(locDem)locDem.textContent=tu_.length?(thay?'Thấy '+thay+' mục khớp, các mục khác mờ đi.':'Chưa có mục nào khớp.'):'';
  });

  /* ---------- Sổ mặc định: cuốn đang đọc, hoặc cuốn đầu ---------- */
  if(dangDoc)phieuSach(dangDoc,cacNut[dsSach.indexOf(dangDoc)],false);
  else if(sach.length)phieuSach(dsSach[0]||dsKhoa[0],cacNut[0],false);
  else{soTrai.appendChild(tao('p','pd-goi','Kệ đang được xếp. Sách và khóa học sẽ lên dần.'))}
})();
