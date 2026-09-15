(function(){
  var goc='../', slug=document.body.getAttribute('data-chu-de');
  function q(s){return document.querySelector(s)}
  function tao(tag,cls,chu){var e=document.createElement(tag);if(cls)e.className=cls;if(chu!=null)e.textContent=chu;return e}
  function ngayVN(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?m[3]+'/'+m[2]+'/'+m[1]:(s||'')}
  function meta(b){var t=[];if(b.ngay)t.push(ngayVN(b.ngay));if(b.phutDoc)t.push(b.phutDoc+' phút đọc');return t.join(' · ')}
  function lienKet(b,cls){var e;if(b.duongDan){e=tao('a',cls);e.href=goc+b.duongDan}else{e=tao('div',cls)}return e}
  function so(n){return (n<10?'0':'')+n}

  /* Thanh điều hướng thu gọn khi cuộn */
  var nav=q('.nav');
  addEventListener('scroll',function(){nav&&nav.classList.toggle('cuon',scrollY>40)},{passive:true});

  function chay(){
    var ds=(window.BAI_VIET||[]).concat(window.BAI_VIET_MAU||[]).filter(function(b){return b.chuDe===slug&&b.tieuDe});
    ds.sort(function(a,b){return (b.ngay||'').localeCompare(a.ngay||'')});
    var dem=q('[data-dem]'), vung=q('[data-bai-viet]'), trong=q('[data-trong]');
    if(!ds.length){if(dem)dem.textContent='Bài viết đang được chuẩn bị';return}
    dem.textContent=ds.length+' bài viết';
    trong.hidden=true; vung.hidden=false;

    var cacNhom=[]; ds.forEach(function(b){if(b.nhom&&cacNhom.indexOf(b.nhom)<0)cacNhom.push(b.nhom)});
    var loc=q('[data-loc]');
    if(cacNhom.length>=2){
      loc.hidden=false;
      ['Tất cả'].concat(cacNhom).forEach(function(n,i){
        var nut=tao('button',null,n); nut.type='button'; nut.setAttribute('aria-pressed',i===0?'true':'false');
        nut.addEventListener('click',function(){
          [].forEach.call(loc.querySelectorAll('button'),function(x){x.setAttribute('aria-pressed','false')});
          nut.setAttribute('aria-pressed','true'); hienThi(i===0?null:n);
        });
        loc.appendChild(nut);
      });
    }
    hienThi(null);

    function hienThi(nhom){
      var chon=ds.filter(function(b){return !nhom||b.nhom===nhom});
      var nb=chon.filter(function(b){return b.noiBat})[0]||chon.filter(function(b){return b.anh})[0]||chon[0];
      var conLai=chon.filter(function(b){return b!==nb});
      /* Bài nổi bật */
      var oNb=q('[data-noi-bat]'); oNb.innerHTML='';
      var the=lienKet(nb,'noi-bat'+(nb.anh?'':' khong-anh'));
      if(nb.anh){var a=tao('div','anh-bai');a.style.backgroundImage='url("'+encodeURI(goc+nb.anh)+'")';a.setAttribute('role','img');a.setAttribute('aria-label',nb.tieuDe);the.appendChild(a)}
      var c=tao('div','chu');
      c.appendChild(tao('span','nhan-nho',(nb.mau?'Bài mẫu · ':'')+'01 · Bài nổi bật'+(nb.nhom?' · '+nb.nhom:'')));
      c.appendChild(tao('h2',null,nb.tieuDe));
      if(nb.tomTat)c.appendChild(tao('p',null,nb.tomTat));
      c.appendChild(tao('span','meta',meta(nb)));
      if(nb.duongDan)c.appendChild(tao('span','doc-tiep','Đọc bài →'));
      the.appendChild(c); oNb.appendChild(the);
      /* Mục lục các bài còn lại */
      var ml=q('[data-muc-luc]'); ml.innerHTML='';
      ml.hidden=!conLai.length;
      conLai.forEach(function(b,i){
        var li=tao('li'), l=lienKet(b,'dong');
        l.appendChild(tao('span','stt',so(i+2)));
        var g=tao('div'); if(b.nhom||b.mau)g.appendChild(tao('span','nhan-nho',(b.mau?'Bài mẫu':'')+(b.mau&&b.nhom?' · ':'')+(b.nhom||'')));
        g.appendChild(tao('h3',null,b.tieuDe)); if(b.tomTat)g.appendChild(tao('p',null,b.tomTat));
        l.appendChild(g); l.appendChild(tao('span','meta',meta(b)));
        l.appendChild(tao('span','mui-ten',b.duongDan?'→':''));
        li.appendChild(l); ml.appendChild(li);
      });
    }
  }

  /* ?mau=1 chỉ dùng trên máy để xem bố cục bằng bài mẫu; file bài mẫu không có trên web */
  if(/[?&]mau=1\b/.test(location.search)){
    var s=document.createElement('script'); s.src=goc+'bai-viet-mau.js'; s.onload=chay; s.onerror=chay; document.head.appendChild(s);
  } else chay();
})();
