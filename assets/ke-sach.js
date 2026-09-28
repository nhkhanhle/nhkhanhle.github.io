/* Trang Góc nhìn (28/09/2026): ba cuốn sách xòe xoay qua sáu góc nhìn, bấm sách thì sách mở ra thành quyển sổ, lá rơi.
   Quyển sổ do assets/so-tay.js dựng (window.SoTay.ve), cùng khối với trang góc nhìn; danh sách bài đọc từ bai-viet.js.
   Không nghe sự kiện cuộn. Máy bật giảm chuyển động thì không có lá rơi, mọi chuyển tiếp tắt trong CSS. */
(function(){
  var ks=document.querySelector('.ks'); if(!ks)return;
  var san=ks.querySelector('[data-ks]'), o=[].slice.call(ks.querySelectorAll('.ks-o')), n=o.length;
  var bang=document.getElementById('ks-bang'), nutDong=bang.querySelector('.ks-dong');
  var giam=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hien=1, mo=false, keo=false, x0=null, henAn=null;

  /* CHI_HIEN_DA_DANG: cùng công tắc với assets/chu-de.js, đổi thì đổi cả hai nơi.
     false: hiện cả 26 bài theo lịch, bài sắp đăng gần nhất lên đầu. true: chỉ bài đã tới ngày đăng, mới nhất lên đầu. */
  var CHI_HIEN_DA_DANG=false;
  function so(k){return (k<10?'0':'')+k}
  function ngayVN(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?m[3]+'/'+m[2]+'/'+m[1]:(s||'')}
  function tao(t,c,chu){var e=document.createElement(t);if(c)e.className=c;if(chu!=null)e.textContent=chu;return e}
  var d=new Date(), homNay=d.getFullYear()+'-'+so(d.getMonth()+1)+'-'+so(d.getDate());
  function baiCua(ma){
    var ds=(window.BAI_VIET||[]).filter(function(b){return b.chuDe===ma&&b.tieuDe&&(!CHI_HIEN_DA_DANG||!b.ngay||b.ngay<=homNay)});
    ds.sort(function(x,y){return CHI_HIEN_DA_DANG?(y.ngay||'').localeCompare(x.ngay||''):(x.ngay||'').localeCompare(y.ngay||'')});
    return ds;
  }

  /* Số bài in ở chân bìa */
  o.forEach(function(li){
    var dem=li.querySelector('[data-dem]'), k=baiCua(li.getAttribute('data-ma')).length;
    if(dem)dem.parentNode.textContent=k?k+' bài viết':'Sắp ra mắt';
  });

  function ve(){
    o.forEach(function(li,i){
      var v=((i-hien)%n+n)%n; if(v>n/2)v-=n;
      li.setAttribute('data-vt',v);
      li.classList.toggle('chon',i===hien);
      /* Sổ đang mở thì cả sáu cuốn đều khuất: không cuốn nào nhận con trỏ bàn phím */
      var a=li.querySelector('.sach'), thay=!mo&&Math.abs(v)<=1;
      a.tabIndex=thay?0:-1;
      li.setAttribute('aria-hidden',thay?'false':'true');
    });
  }
  function den(i){hien=((i%n)+n)%n; ve(); if(mo)dien()}

  /* ---------- Bảng: tên góc nhìn, quyển sổ, thanh nút ---------- */
  var vungSo=bang.querySelector('[data-so-tay]'), bangTrong=bang.querySelector('[data-b-trong]'), viTriSap=-1;
  function dien(){
    var li=o[hien], ma=li.getAttribute('data-ma'), ds=baiCua(ma);
    bang.querySelector('[data-b-so]').textContent='Góc nhìn '+so(hien+1)+' / '+so(n);
    bang.querySelector('[data-b-ten]').textContent=li.querySelector('.bia-ten').textContent;
    bang.querySelector('[data-b-mo]').textContent=li.querySelector('.ks-dien-giai').textContent;
    ks.classList.toggle('rong',!ds.length);
    bangTrong.hidden=!!ds.length;
    if(window.SoTay)window.SoTay.ve(ds,''); else vungSo.hidden=true;
    var ml=bang.querySelector('[data-muc-luc]'); if(!ds.length||!window.SoTay)ml.hidden=true;
    /* Nút đầu: có bài đã viết xong và đã tới ngày đăng thì là liên kết "Bài mới nhất" tới trang bài đó;
       chưa có thì là nút "Bài sắp đăng", bấm là sổ lật tới bài sắp đăng gần nhất (không dẫn qua trang chờ) */
    var nutMoi=bang.querySelector('[data-b-bai-moi]'), nutSap=bang.querySelector('[data-b-sap]');
    var daViet=(window.SoTay&&window.SoTay.daViet)||function(){return false};
    var moi=ds.filter(function(b){return daViet(b)&&b.ngay&&b.ngay<=homNay}).sort(function(x,y){return y.ngay.localeCompare(x.ngay)})[0];
    var sap=ds.filter(function(b){return !b.ngay||b.ngay>homNay}).sort(function(x,y){return (x.ngay||'').localeCompare(y.ngay||'')})[0];
    nutMoi.hidden=!moi; if(moi)nutMoi.href=moi.duongDan;
    nutSap.hidden=!!moi||!sap; viTriSap=sap?ds.indexOf(sap):-1;
  }
  /* Đo chỗ trang phải của quyển sổ rồi đặt đích cho cuốn sách: sách dời tới đó, phóng cho bằng trang sổ, mở bìa, rồi sổ hiện ra */
  function doCho(){
    var st=bang.querySelector('[data-st-so]'), li=o[hien];
    if(!mo||vungSo.hidden||!st.offsetWidth)return;
    var r=st.getBoundingClientRect(), k=ks.getBoundingClientRect();
    li.style.setProperty('--mx',((r.left-k.left+r.width*.75)-(li.offsetLeft+li.offsetWidth/2)).toFixed(1)+'px');
    li.style.setProperty('--my',((r.top-k.top+r.height/2)-(li.offsetTop+li.offsetHeight/2)).toFixed(1)+'px');
    li.style.setProperty('--ms',(r.height/li.offsetHeight).toFixed(4));
  }
  function moSach(i){
    clearTimeout(henAn);
    bang.hidden=false; bang.classList.remove('nhanh');
    mo=true; hien=i; ks.classList.add('mo'); ve(); dien(); doCho();
    o.forEach(function(li){li.querySelector('.sach').setAttribute('aria-expanded',li===o[hien]?'true':'false')});
    void bang.offsetWidth; bang.classList.add('hien');
    /* Bảng giờ dài hơn một màn (có mục lục bên dưới): đưa đầu khu sách về sát dưới menu nếu đang lệch */
    if(Math.abs(ks.getBoundingClientRect().top-64)>48)ks.scrollIntoView({behavior:giam?'auto':'smooth',block:'start'});
    nutDong.focus({preventScroll:true});
  }
  function dongSach(){
    if(!mo)return;
    mo=false; ks.classList.remove('mo','rong'); bang.classList.remove('hien'); ve();
    o.forEach(function(li){li.querySelector('.sach').setAttribute('aria-expanded','false')});
    henAn=setTimeout(function(){bang.hidden=true},giam?0:520);
    /* Đang cuộn ở mục lục mà đóng sổ thì đưa kệ sách về lại màn hình */
    if(ks.getBoundingClientRect().top<-40)ks.scrollIntoView({behavior:giam?'auto':'smooth',block:'start'});
    o[hien].querySelector('.sach').focus({preventScroll:true});
  }
  /* Đổi sang góc nhìn kế khi sổ đang mở: sổ mờ đi, dựng lại, rồi hiện ra */
  function doiSo(i){
    bang.classList.add('doi','nhanh');
    den(i); doCho();
    void bang.offsetWidth; bang.classList.remove('doi');
  }
  addEventListener('resize',function(){if(mo)doCho()});

  o.forEach(function(li,i){
    var a=li.querySelector('.sach');
    a.setAttribute('role','button'); a.setAttribute('aria-expanded','false'); a.setAttribute('aria-controls','ks-bang');
    a.addEventListener('click',function(ev){
      if(ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;   /* mở thẻ mới thì cứ để trình duyệt lo */
      ev.preventDefault();
      if(keo)return;
      if(mo&&i===hien)dongSach(); else moSach(i);
    });
    a.addEventListener('keydown',function(ev){if(ev.key===' '){ev.preventDefault();a.click()}});
    a.addEventListener('dragstart',function(ev){ev.preventDefault()});
  });
  nutDong.addEventListener('click',dongSach);
  bang.querySelector('[data-b-ke]').addEventListener('click',function(){doiSo(hien+1);if(ks.getBoundingClientRect().top<-40)ks.scrollIntoView({behavior:giam?'auto':'smooth',block:'start'})});
  bang.querySelector('[data-b-sap]').addEventListener('click',function(){if(viTriSap>=0&&window.SoTay&&window.SoTay.den)window.SoTay.den(viTriSap)});
  document.addEventListener('keydown',function(ev){
    if(ev.key!=='Escape'||!mo)return;
    var tim=document.querySelector('.lop-tim'); if(tim&&!tim.hidden)return;
    dongSach();
  });

  /* ---------- Xoay: hai nút, phím trái phải, vuốt ---------- */
  ks.querySelector('.ks-lui').addEventListener('click',function(){den(hien-1)});
  ks.querySelector('.ks-toi').addEventListener('click',function(){den(hien+1)});
  san.addEventListener('keydown',function(ev){
    if(mo)return;
    if(ev.key==='ArrowLeft'){ev.preventDefault();den(hien-1);o[hien].querySelector('.sach').focus({preventScroll:true})}
    if(ev.key==='ArrowRight'){ev.preventDefault();den(hien+1);o[hien].querySelector('.sach').focus({preventScroll:true})}
  });
  san.addEventListener('pointerdown',function(ev){x0=ev.clientX;keo=false});
  san.addEventListener('pointermove',function(ev){if(x0!==null&&Math.abs(ev.clientX-x0)>8)keo=true});
  san.addEventListener('pointerup',function(ev){
    if(x0===null)return;
    var dx=ev.clientX-x0; x0=null;
    if(!mo&&Math.abs(dx)>50)den(hien+(dx<0?1:-1));
    setTimeout(function(){keo=false},60);
  });
  san.addEventListener('pointercancel',function(){x0=null;keo=false});

  /* ---------- Lá rơi: cùng họ nét với cành lá ở góc trang ---------- */
  var la=ks.querySelector('.ks-la');
  if(la&&!giam){
    var soLa=matchMedia('(max-width:640px)').matches?6:11, s='';
    for(var k=0;k<soLa;k++){
      var t=(17+Math.random()*15).toFixed(1), c=Math.round(18+Math.random()*16);
      s+='<i style="--x:'+(4+Math.random()*92).toFixed(1)+'%;--c:'+c+'px;--t:'+t+'s;--d:-'+(Math.random()*t).toFixed(1)+'s">'
        +'<svg viewBox="0 0 40 20" aria-hidden="true"><path d="M2 10Q20-5 38 10Q20 25 2 10Z"/><path d="M2 10H31"/></svg></i>';
    }
    la.innerHTML=s;
  }

  ve();
})();
