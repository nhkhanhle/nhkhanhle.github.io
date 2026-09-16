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
      /* Năm ô so le trượt qua lại, ô giữa là ô đang chọn.
         Cách chuyển động theo thẻ trượt 5 chủ đề ngoài trang chủ, bỏ vòng tròn vàng.
         Khổ hẹp thì CSS tự chuyển về lưới thường, phần mã này vẫn chạy nhưng không ảnh hưởng. */
      var MUI_TEN='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg>';
      var kh=q('[data-kham]'), luoi=q('[data-kham-luoi]'), dk=q('[data-kham-dk]'),
          cham=q('[data-kham-cham]'), lui=q('[data-kham-lui]'), toi=q('[data-kham-toi]');
      if(!kh||!luoi)return;
      if(!danh.length){kh.hidden=true;return}
      kh.hidden=false; luoi.innerHTML=''; cham.innerHTML='';

      var o=danh.map(function(b,i){
        var e=lienKet(b,'o-kham co-bai'+(i===0?' noi-bat-o':''));
        var lat=tao('div','lat');

        var truoc=tao('div','mat truoc');
        var anh=tao('div','anh-o');
        if(b.anh)anh.style.backgroundImage='url("'+encodeURI(goc+b.anh)+'")';
        truoc.appendChild(anh);
        var ct=tao('div','chu-truoc');
        ct.appendChild(tao('span','nhan-o',i===0?'Bài nổi bật':(b.nhom||'Bài viết')));
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
        lat.appendChild(truoc); lat.appendChild(sau); e.appendChild(lat);
        luoi.appendChild(e);
        return e;
      });

      var n=o.length, hien=0, keo=false, x0=null;
      dk.hidden = n<2;

      for(var i=0;i<n;i++){
        (function(i){
          var nut=tao('button'); nut.type='button';
          nut.setAttribute('aria-label','Bài '+(i+1)+' trên '+n);
          nut.addEventListener('click',function(){den(i)});
          cham.appendChild(nut);
        })(i);
      }
      var chamNut=[].slice.call(cham.querySelectorAll('button'));

      function ve(){
        o.forEach(function(e,i){
          var d=((i-hien)%n+n)%n; if(d>n/2)d-=n;
          e.setAttribute('data-vt',d);
          e.tabIndex = d===0?0:-1;
          e.setAttribute('aria-hidden', Math.abs(d)>2 ? 'true':'false');
        });
        chamNut.forEach(function(c,i){c.setAttribute('aria-current',i===hien?'true':'false')});
      }
      function den(i){hien=(i%n+n)%n;ve()}

      lui.onclick=function(){den(hien-1)};
      toi.onclick=function(){den(hien+1)};
      /* Bấm vào ô bên cạnh là đưa nó vào giữa, chưa mở bài */
      o.forEach(function(e,i){
        e.addEventListener('click',function(ev){
          if(keo){ev.preventDefault();return}
          if(e.getAttribute('data-vt')!=='0'){ev.preventDefault();den(i)}
        });
      });
      /* Vuốt ngang */
      luoi.addEventListener('pointerdown',function(ev){x0=ev.clientX;keo=false});
      luoi.addEventListener('pointermove',function(ev){if(x0!==null&&Math.abs(ev.clientX-x0)>8)keo=true});
      function tha(ev){
        if(x0===null)return;
        var dx=ev.clientX-x0; x0=null;
        if(Math.abs(dx)>50)den(hien+(dx<0?1:-1));
        setTimeout(function(){keo=false},60);
      }
      luoi.addEventListener('pointerup',tha);
      luoi.addEventListener('pointercancel',function(){x0=null});
      luoi.addEventListener('dragstart',function(ev){ev.preventDefault()});
      luoi.addEventListener('keydown',function(ev){
        if(ev.key==='ArrowLeft'){ev.preventDefault();den(hien-1)}
        if(ev.key==='ArrowRight'){ev.preventDefault();den(hien+1)}
      });
      ve();
    }

    function veBang(danh){
      /* Danh sách dọc. Mở đầu hiện 4 bài, bấm Xem thêm thì hiện thêm 4 bài nữa.
         Mỗi dòng có ảnh icon bên trái. Mẫu dòng theo ảnh Khánh gửi. */
      var DAU=4, THEM=4;
      var b=q('[data-bang]'), ds=q('[data-ds]'), dk=q('.bang-dieu-khien'),
          nut=q('[data-them]'), chu=q('[data-them-chu]');
      if(!b||!ds)return;
      if(!danh.length){b.hidden=true;return}
      b.hidden=false; ds.innerHTML='';

      var dong=danh.map(function(x){
        var d=lienKet(x,'dong-bai');
        var h=tao('span','hinh-bai');
        if(x.anh)h.style.backgroundImage='url("'+encodeURI(goc+x.anh)+'")';
        h.setAttribute('aria-hidden','true');
        d.appendChild(h);
        var g=tao('div');
        g.appendChild(tao('span','nhan-nho',x.nhom||'Bài viết'));
        g.appendChild(tao('h3',null,x.tieuDe));
        if(x.tomTat)g.appendChild(tao('p',null,x.tomTat));
        g.appendChild(tao('span','meta',meta(x)));
        d.appendChild(g);
        d.appendChild(tao('span','mui-ten',x.duongDan?'→':''));
        ds.appendChild(d);
        return d;
      });

      var hien=Math.min(DAU,dong.length);
      function veLai(){
        dong.forEach(function(d,i){d.hidden = i>=hien});
        var con=dong.length-hien;
        dk.hidden = con<=0;
        if(con>0)chu.textContent='Xem thêm '+Math.min(THEM,con)+' bài';
      }
      nut.onclick=function(){
        var truoc=hien;
        hien=Math.min(hien+THEM,dong.length);
        veLai();
        if(dong[truoc])dong[truoc].focus({preventScroll:true});
      };
      veLai();
    }

    function hienThi(nhom){
      var chon=ds.filter(function(b){return !nhom||b.nhom===nhom});
      var nb=chon.filter(function(b){return b.noiBat})[0]||chon.filter(function(b){return b.anh})[0]||chon[0];
      var thuTu=nb?[nb].concat(chon.filter(function(b){return b!==nb})):chon;
      veKham(thuTu);
      veBang(thuTu);
    }
  }

  /* ?mau=1 chỉ dùng trên máy để xem bố cục bằng bài mẫu; file bài mẫu không có trên web */
  if(/[?&]mau=1\b/.test(location.search)){
    var s=document.createElement('script'); s.src=goc+'bai-viet-mau.js'; s.onload=chay; s.onerror=chay; document.head.appendChild(s);
  } else chay();
})();
