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

    /* Khối khảm: tâm là bài nổi bật hoặc bài mới nhất, càng ra rìa càng cũ.
       Vị trí ô xếp sẵn trong trang-con.css, xem tham-khao/bo-cuc-tap-chi.md */
    function veKham(danh){
      /* 8 chỗ đặt bài, xếp từ trong ra ngoài. Bài thứ 9 trở đi chỉ nằm ở mục lục bên dưới. */
      var VI_TRI=['tam','k1','k2','k3','k4','k5','k6','k7'];
      var TRANG_TRI=['d1','d2','d3','d4','d5','d6'];
      var MUI_TEN='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg>';
      var kh=q('[data-kham]'), luoi=q('[data-kham-luoi]');
      if(!kh||!luoi)return;
      if(!danh.length){kh.hidden=true;return}
      kh.hidden=false; luoi.innerHTML='';

      function oTrong(vt){var e=tao('div','o-kham trong-o '+vt);e.setAttribute('aria-hidden','true');return e}

      VI_TRI.forEach(function(vt,i){
        var b=danh[i];
        if(!b){luoi.appendChild(oTrong(vt));return}
        var o=lienKet(b,'o-kham co-bai '+vt);
        var lat=tao('div','lat');

        var truoc=tao('div','mat truoc');
        var anh=tao('div','anh-o');
        if(b.anh)anh.style.backgroundImage='url("'+encodeURI(goc+b.anh)+'")';
        truoc.appendChild(anh);
        var ct=tao('div','chu-truoc');
        ct.appendChild(tao('span','nhan-o',vt==='tam'?'Bài nổi bật':(b.nhom||'Bài viết')));
        ct.appendChild(tao('span','ngay-o',meta(b)));
        truoc.appendChild(ct);

        var sau=tao('div','mat sau');
        sau.appendChild(tao('span','ten-o',b.tieuDe));
        if(b.duongDan){
          var d=tao('span','doc-o');
          d.appendChild(tao('span',null,'Đọc thêm'));
          d.insertAdjacentHTML('beforeend',MUI_TEN);
          sau.appendChild(d);
        }

        lat.appendChild(truoc); lat.appendChild(sau); o.appendChild(lat);
        if(vt==='tam'){var v=tao('span','vong');v.setAttribute('aria-hidden','true');o.appendChild(v)}
        luoi.appendChild(o);
      });

      TRANG_TRI.forEach(function(vt){luoi.appendChild(oTrong(vt))});
    }

    function hienThi(nhom){
      var chon=ds.filter(function(b){return !nhom||b.nhom===nhom});
      var nb=chon.filter(function(b){return b.noiBat})[0]||chon.filter(function(b){return b.anh})[0]||chon[0];
      var thuTu=nb?[nb].concat(chon.filter(function(b){return b!==nb})):chon;
      veKham(thuTu);
      /* Mục lục liệt kê đủ cả bài ở tâm, đánh số từ 01 */
      var ml=q('[data-muc-luc]'); ml.innerHTML='';
      ml.hidden=!thuTu.length;
      thuTu.forEach(function(b,i){
        var li=tao('li'), l=lienKet(b,'dong');
        l.appendChild(tao('span','stt',so(i+1)));
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
