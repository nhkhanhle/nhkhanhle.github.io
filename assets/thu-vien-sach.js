/* Thư viện sách (thu-vien-sach.html), phòng đọc phương án A Khánh chọn 01/10/2026. Dữ liệu ở thu-vien.js.
   Tủ ba ngăn: Sách, Khóa học, Hộp phiếu ghi chú. Mỗi cuốn một gáy, màu theo góc nhìn; cuốn có dangDoc:true dựng mặt bìa ra ngoài.
   Bấm gáy, bìa hay phiếu ghi chú thì phiếu đọc bên phải hiện chi tiết. Ô tìm làm mờ những mục không khớp.
   Không có JavaScript thì trang chỉ còn đầu trang và tủ trống. */
(function(){
  var D=window.THU_VIEN||{}, sach=D.sach||[], ghi=(D.ghiChu||[]).slice().sort(function(a,b){return (b.ngay||'').localeCompare(a.ngay||'')});
  var tu=document.querySelector('[data-tu]'), phieu=document.querySelector('[data-phieu]');
  if(!tu||!phieu)return;
  function q(s,g){return (g||document).querySelector(s)}
  function tao(tag,cls,chu){var e=document.createElement(tag);if(cls)e.className=cls;if(chu!=null)e.textContent=chu;return e}
  function ngayVN(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?m[3]+'/'+m[2]+'/'+m[1]:(s||'')}
  function boDau(s){return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase()}
  function bam(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%997;return h}
  function nhanMau(cha,m){if(m.mau)cha.appendChild(tao('span','tv-mau','Mẫu'))}

  /* Màu gáy theo góc nhìn (cùng sáu góc nhìn ở trang chủ); nhóm khác dùng màu cát đậm */
  var MAU={'Nghề nhân sự':'#2F3B4A','Hệ thống quản trị':'#4A5868','Tâm lý học':'#5E6B5A','Trí tuệ nhân tạo':'#8A5A44','Pháp luật lao động':'#6B3F43','Chuyện công sở':'#7A6A4F'};
  function mauCua(m){return MAU[m.nhom]||'#5F5240'}

  /* Đếm lên đầu trang; dòng báo khi còn chữ giữ chỗ */
  var soSach=sach.filter(function(m){return m.loai!=='Khóa học'}).length, soKhoa=sach.length-soSach;
  var dem=q('[data-dem]'); if(dem)dem.textContent=soSach+' cuốn sách · '+soKhoa+' khóa học · '+ghi.length+' ghi chú';
  if(sach.concat(ghi).some(function(m){return m.mau})){var bao=q('[data-tv-bao]');if(bao)bao.classList.add('hien')}

  /* ---------- Phiếu đọc ---------- */
  var dangChon=null, cacNut=[];
  function chon(nut){dangChon=nut;cacNut.forEach(function(b){b.setAttribute('aria-pressed',b===nut?'true':'false')})}
  function dauPhieu(nhan,ten,mau,dauMoc){
    var d=tao('div','pd-phieu-dau'), t=tao('div'); t.appendChild(tao('p','nhan',nhan));
    var h=tao('h2',null,ten); if(mau)nhanMau(h,mau); t.appendChild(h); d.appendChild(t);
    if(dauMoc){var ph=tao('div','pd-phieu-phai'),mc=tao('span','dau-moc');mc.setAttribute('aria-hidden','true');mc.innerHTML='ĐANG<br>XEM';ph.appendChild(mc);d.appendChild(ph)}
    return d;
  }
  /* Máy tính: phiếu đứng yên, về đầu phiếu. Điện thoại: phiếu nằm trên tủ, cuộn tới phiếu */
  function veDau(cuon){
    if(getComputedStyle(phieu).position==='sticky'){phieu.scrollTop=0;return}
    if(!cuon)return;
    var y=phieu.getBoundingClientRect().top; if(y<0||y>innerHeight*.6)window.scrollTo({top:y+window.scrollY-84,behavior:'smooth'});
  }
  function bang(cha,dong){
    var dl=tao('dl','pd-the');
    dong.forEach(function(r){if(!r[1])return;dl.appendChild(tao('dt',null,r[0]));dl.appendChild(tao('dd',null,r[1]))});
    if(dl.children.length)cha.appendChild(dl);
  }
  function doan(cha,chu){
    var v=tao('div','pd-van'); (chu||'').split(/\n\s*\n/).forEach(function(p){if(p.trim())v.appendChild(tao('p',null,p.trim()))}); cha.appendChild(v);
  }
  function phieuSach(m,cuon){
    phieu.innerHTML='';
    var khoa=m.loai==='Khóa học';
    phieu.appendChild(dauPhieu('Phiếu đọc · '+(khoa?'Khóa học':'Sách'),m.ten||'',m,true));
    var bia=tao('div','pd-bia'); bia.setAttribute('aria-hidden','true'); bia.style.setProperty('--m',mauCua(m));
    bia.appendChild(tao('span','nhan',m.loai||'Sách')); bia.appendChild(tao('b',null,m.ten||'')); if(m.tacGia)bia.appendChild(tao('small',null,m.tacGia));
    phieu.appendChild(bia);
    bang(phieu,[[khoa?'Nơi dạy':'Tác giả',m.tacGia],[khoa?'Nơi học':'Xuất bản',m.noi],['Năm',m.nam],['Góc nhìn',m.nhom]]);
    if(m.viSao){phieu.appendChild(tao('p','pd-muc','Vì sao đáng '+(khoa?'học':'đọc')));doan(phieu,m.viSao)}
    if(m.lienKet){var a=tao('a','pd-lien',khoa?'Xem khóa học ↗':'Xem sách ↗');a.href=m.lienKet;a.target='_blank';a.rel='noopener';phieu.appendChild(a)}
    veDau(cuon);
  }
  function phieuGhi(m,cuon){
    phieu.innerHTML='';
    phieu.appendChild(dauPhieu('Phiếu ghi chú · '+ngayVN(m.ngay),m.tieuDe||'',m,true));
    if(m.the&&m.the.length){var t=tao('div','pd-nhan-ghi');m.the.forEach(function(x){t.appendChild(tao('span',null,x))});phieu.appendChild(t)}
    if(m.tomTat)phieu.appendChild(tao('p','pd-goi',m.tomTat));
    doan(phieu,m.noiDung);
    var ve=tao('button','pd-tat-ca','Xem cả '+ghi.length+' ghi chú'); ve.type='button'; ve.style.margin='22px 0 0';
    ve.addEventListener('click',function(){phieuDsGhi(true)}); phieu.appendChild(ve);
    veDau(cuon);
  }
  function phieuDsGhi(cuon){
    chon(null); phieu.innerHTML='';
    phieu.appendChild(dauPhieu('Hộp phiếu ghi chú','Tất cả ghi chú',null,false));
    if(!ghi.length){phieu.appendChild(tao('p','pd-goi','Hộp phiếu đang được xếp.'));return}
    var ul=tao('ul','pd-ds');
    ghi.forEach(function(m,i){
      var li=tao('li'), b=tao('button'); b.type='button';
      b.appendChild(tao('small',null,ngayVN(m.ngay)+(m.the&&m.the.length?' · '+m.the.join(', '):'')));
      var t=tao('b',null,m.tieuDe||''); nhanMau(t,m); b.appendChild(t);
      if(m.tomTat)b.appendChild(tao('span',null,m.tomTat));
      b.addEventListener('click',function(){chon(theGhi[i]||null);phieuGhi(m,true)});
      li.appendChild(b); ul.appendChild(li);
    });
    phieu.appendChild(ul); veDau(cuon);
  }

  /* ---------- Tủ ---------- */
  function ngan(ten,ghiChu){
    var n=tao('section','pd-ngan'); n.setAttribute('aria-label','Ngăn '+ten);
    var d=tao('div','pd-ngan-ten'); d.appendChild(tao('h2',null,ten)); d.appendChild(tao('span',null,ghiChu)); n.appendChild(d);
    var h=tao('div','pd-hang'); n.appendChild(h); tu.appendChild(n); return h;
  }
  var muc=[];   /* {nut, chu} cho ô tìm */
  function gay(m){
    var k=bam(m.ten||''), khoa=m.loai==='Khóa học';
    var g=tao('button','gay'); g.type='button'; g.setAttribute('aria-pressed','false');
    g.setAttribute('aria-label',(m.loai||'Sách')+': '+(m.ten||'')+(m.tacGia?', '+m.tacGia:''));
    var dai=(m.ten||'').length>17;   /* tên dài xuống hai cột chữ trên gáy */
    g.style.setProperty('--r',(dai?46:(khoa?38:40))+k%12+'px'); g.style.setProperty('--h',(khoa?146:154)+k%26+'px'); g.style.setProperty('--m',mauCua(m));
    var t=tao('span','gay-than'); t.appendChild(tao('b',dai?'hai':null,m.ten||'')); t.appendChild(tao('small',null,m.nam||(khoa?'KHÓA':'SÁCH'))); g.appendChild(t);
    g.addEventListener('click',function(){chon(g);phieuSach(m,true)});
    cacNut.push(g); muc.push({nut:g,chu:boDau([m.ten,m.tacGia,m.noi,m.nhom,m.viSao,m.loai].join(' '))});
    return g;
  }
  var dsSach=sach.filter(function(m){return m.loai!=='Khóa học'}), dsKhoa=sach.filter(function(m){return m.loai==='Khóa học'});
  var dangDoc=dsSach.filter(function(m){return m.dangDoc})[0]||null;

  var h1=ngan('Sách',dsSach.length+' cuốn');
  if(dangDoc){
    var mat=tao('button','pd-mat'); mat.type='button'; mat.setAttribute('aria-pressed','false');
    mat.setAttribute('aria-label','Đang đọc: '+dangDoc.ten+(dangDoc.tacGia?', '+dangDoc.tacGia:''));
    mat.appendChild(tao('span','nhan','Đang đọc')); mat.appendChild(tao('b',null,dangDoc.ten||'')); if(dangDoc.tacGia)mat.appendChild(tao('small',null,dangDoc.tacGia));
    mat.addEventListener('click',function(){chon(mat);phieuSach(dangDoc,true)});
    h1.appendChild(mat); cacNut.push(mat); muc.push({nut:mat,chu:boDau([dangDoc.ten,dangDoc.tacGia,dangDoc.noi,dangDoc.nhom,dangDoc.viSao].join(' '))});
  }
  dsSach.forEach(function(m){if(m!==dangDoc)h1.appendChild(gay(m))});
  if(!dsSach.length)h1.appendChild(tao('p','pd-trong','Ngăn này đang được xếp.'));
  h1.appendChild(tao('span','pd-chan-sach'));

  var h2=ngan('Khóa học',dsKhoa.length+' khóa');
  dsKhoa.forEach(function(m){h2.appendChild(gay(m))});
  if(!dsKhoa.length)h2.appendChild(tao('p','pd-trong','Ngăn này đang được xếp.'));
  h2.appendChild(tao('span','pd-chan-sach'));

  /* Hộp phiếu: bốn ghi chú mới nhất cắm trong hộp, ghi chú mới nhất ở trước */
  var h3=ngan('Hộp phiếu ghi chú',ghi.length+' phiếu'); h3.parentNode.id='ghi-chu'; h3.classList.add('pd-hang-hop');
  var hop=tao('div','pd-hop'), theGhi=[];
  var bon=ghi.slice(0,4), n=bon.length;
  bon.forEach(function(m,i){
    var k=n-1-i;   /* phiếu mới nhất nằm trước cùng (k lớn nhất) */
    var b=tao('button','pd-the-ghi'); b.type='button'; b.setAttribute('aria-pressed','false'); b.style.setProperty('--k',k);
    b.appendChild(tao('i',null,(m.the&&m.the[0])||ngayVN(m.ngay).slice(3)));
    b.appendChild(tao('small',null,ngayVN(m.ngay))); b.appendChild(tao('b',null,m.tieuDe||''));
    b.setAttribute('aria-label','Ghi chú '+ngayVN(m.ngay)+': '+(m.tieuDe||''));
    b.addEventListener('click',function(){chon(b);phieuGhi(m,true)});
    hop.appendChild(b); theGhi[i]=b; cacNut.push(b); muc.push({nut:b,chu:boDau([m.tieuDe,m.tomTat,(m.the||[]).join(' '),m.noiDung].join(' '))});
  });
  var than=tao('div','pd-than-hop'); than.appendChild(tao('span',null,'GHI CHÚ')); hop.appendChild(than);
  h3.appendChild(hop);
  /* Nút xem cả hộp nằm ở đầu ngăn, thay cho số phiếu, để không rớt xuống ván kệ trên điện thoại */
  if(ghi.length){var tc=tao('button','pd-tat-ca','Xem cả '+ghi.length+' ghi chú');tc.type='button';tc.addEventListener('click',function(){phieuDsGhi(true)});var dauNgan=h3.previousElementSibling;dauNgan.replaceChild(tc,dauNgan.lastChild)}

  /* Chú giải màu: chỉ các góc nhìn đang có trên kệ */
  var cg=q('[data-chu-giai]'), daCo={};
  if(cg)sach.forEach(function(m){var t=MAU[m.nhom]?m.nhom:'Chủ đề khác';if(daCo[t])return;daCo[t]=1;var sp=tao('span'),i=tao('i');i.style.setProperty('--m',mauCua(m));sp.appendChild(i);sp.appendChild(document.createTextNode(t));cg.appendChild(sp)});

  /* ---------- Ô tìm: làm mờ mục không khớp ---------- */
  var oLoc=q('[data-loc]'), locDem=q('[data-loc-dem]');
  if(oLoc)oLoc.addEventListener('input',function(){
    var tu_=boDau(oLoc.value).split(/\s+/).filter(Boolean), thay=0;
    muc.forEach(function(x){var khop=!tu_.length||tu_.every(function(w){return x.chu.indexOf(w)>=0});x.nut.classList.toggle('mo-nhat',!khop);if(khop)thay++});
    if(locDem)locDem.textContent=tu_.length?(thay?'Thấy '+thay+' mục khớp, các mục khác mờ đi.':'Chưa có mục nào khớp.'):'';
  });

  /* ---------- Phiếu mặc định: cuốn đang đọc, hoặc cuốn đầu tiên; vào thẳng #ghi-chu thì mở hộp phiếu ---------- */
  if(location.hash==='#ghi-chu'&&ghi.length)phieuDsGhi(false);
  else if(dangDoc){chon(mat);phieuSach(dangDoc,false)}
  else if(sach.length){chon(cacNut[0]);phieuSach(dsSach[0]||dsKhoa[0],false)}
  else if(ghi.length)phieuDsGhi(false);
  else phieu.appendChild(tao('p','pd-goi','Kệ đang được xếp. Sách và ghi chú sẽ lên dần.'));
})();
