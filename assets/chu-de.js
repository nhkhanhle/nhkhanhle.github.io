(function(){
  var goc='../', slug=document.body.getAttribute('data-chu-de');
  function q(s){return document.querySelector(s)}
  function tao(tag,cls,chu){var e=document.createElement(tag);if(cls)e.className=cls;if(chu!=null)e.textContent=chu;return e}
  function ngayVN(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?m[3]+'/'+m[2]+'/'+m[1]:(s||'')}
  function meta(b){var t=[];if(b.ngay)t.push(ngayVN(b.ngay));if(b.phutDoc)t.push(b.phutDoc+' phút đọc');return t.join(' · ')}
  function lienKet(b,cls){var e;if(b.duongDan){e=tao('a',cls);e.href=goc+b.duongDan}else{e=tao('div',cls)}return e}
  function so(n){return (n<10?'0':'')+n}

  function chay(){
    /* Chỉ hiện bài đã tới ngày đăng. Bài của những tuần sau nằm sẵn trong bai-viet.js nhưng tự ẩn. */
    var d=new Date(), homNay=d.getFullYear()+'-'+so(d.getMonth()+1)+'-'+so(d.getDate());
    var ds=(window.BAI_VIET||[]).concat(window.BAI_VIET_MAU||[]).filter(function(b){
      return b.chuDe===slug && b.tieuDe && (!b.ngay || b.ngay<=homNay);
    });
    ds.sort(function(a,b){return (b.ngay||'').localeCompare(a.ngay||'')});
    var vung=q('[data-bai-viet]'), trong=q('[data-trong]'), loc=q('[data-loc]');

    if(!ds.length){
      if(loc)loc.appendChild(tao('span','loc-cho','Ghi chép đang được chuẩn bị'));
      return;
    }
    trong.hidden=true; vung.hidden=false;

    /* Nút lọc nằm ngay đầu trang, mỗi nút kèm số bài của nhóm đó */
    var cacNhom=[], soBai={};
    ds.forEach(function(b){
      var n=b.nhom||'Chưa xếp nhóm';
      if(cacNhom.indexOf(n)<0){cacNhom.push(n);soBai[n]=0}
      soBai[n]++;
    });
    if(loc){
      if(cacNhom.length>=2){
        [['Tất cả',ds.length]].concat(cacNhom.map(function(n){return [n,soBai[n]]}))
        .forEach(function(x,i){
          var nut=tao('button'); nut.type='button';
          nut.setAttribute('aria-pressed',i===0?'true':'false');
          nut.appendChild(document.createTextNode(x[0]));
          nut.appendChild(tao('b',null,String(x[1])));
          nut.addEventListener('click',function(){
            [].forEach.call(loc.querySelectorAll('button'),function(y){y.setAttribute('aria-pressed','false')});
            nut.setAttribute('aria-pressed','true'); hienThi(i===0?null:x[0]);
          });
          loc.appendChild(nut);
        });
      } else {
        loc.appendChild(tao('span','loc-cho',ds.length+' ghi chép'));
      }
    }
    hienThi(null);

    /* Khối khảm: tâm là bài nổi bật hoặc bài mới nhất, càng ra rìa càng cũ.
       Vị trí ô xếp sẵn trong trang-con.css, xem tham-khao/bo-cuc-tap-chi.md */
    function veKham(danh){
      /* Năm ô so le trượt qua lại, ô giữa là ô đang chọn.
         Cách chuyển động theo thẻ trượt 5 góc nhìn ngoài trang chủ, bỏ vòng tròn vàng.
         Khổ hẹp thì CSS tự chuyển về lưới thường, phần mã này vẫn chạy nhưng không ảnh hưởng. */
      var kh=q('[data-kham]'), luoi=q('[data-kham-luoi]'), dk=q('[data-kham-dk]'),
          cham=q('[data-kham-cham]');
      if(!kh||!luoi)return;
      if(!danh.length){kh.hidden=true;return}
      kh.hidden=false; luoi.innerHTML=''; cham.innerHTML='';

      var o=danh.map(function(b,i){
        var e=lienKet(b,'o-kham co-bai'+(i===0?' noi-bat-o':''));
        var anh=tao('div','anh-o');
        if(b.anh)anh.style.backgroundImage='url("'+encodeURI(goc+b.anh)+'")';
        e.appendChild(anh);
        var ct=tao('div','chu-truoc');
        /* Một dòng gộp: nhãn nhóm và thời gian đọc. Không hiện ngày tháng. */
        var nhan=[i===0?'Bài nổi bật':(b.nhom||'Bài viết')];
        if(b.phutDoc)nhan.push(b.phutDoc+' phút');
        ct.appendChild(tao('span','nhan-o',nhan.join(' · ')));
        ct.appendChild(tao('span','ten-o',b.tieuDe));
        e.appendChild(ct);
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

      /* Rê chuột ở đâu trong khối cũng chạy, không cần ra sát mép.
         Càng xa tâm càng nhanh, quanh tâm có một vùng đứng yên để đọc ô đang chọn.
         Nhịp tính bằng bộ đếm cộng dồn nên đổi tốc độ giữa chừng không làm mất nhịp. */
      var VUNG_CHET=0.16, CHAM=2000, NHANH=1000, TICK=80;
      var huong=0, nhip=CHAM, tich=0, dem=null;
      var coChuot=matchMedia('(hover:hover)').matches;
      var giamChuyenDong=matchMedia('(prefers-reduced-motion:reduce)').matches;

      function dungChay(){
        huong=0; tich=0;
        if(dem){clearInterval(dem);dem=null}
        luoi.classList.remove('chay-trai','chay-phai');
      }
      function datHuong(h,nh){
        if(h===0){dungChay();return}
        nhip=nh;
        if(h!==huong){
          huong=h; tich=0;
          luoi.classList.remove('chay-trai','chay-phai');
          luoi.classList.add(h<0?'chay-trai':'chay-phai');
          den(hien+h);   /* nhảy ngay một nấc, không thì người dùng tưởng nó đứng im */
        }
        if(!dem)dem=setInterval(function(){
          if(!huong)return;
          tich+=TICK/nhip;
          if(tich>=1){tich=0;den(hien+huong)}
        },TICK);
      }
      if(coChuot && !giamChuyenDong){
        luoi.addEventListener('pointermove',function(ev){
          if(ev.pointerType!=='mouse'){dungChay();return}
          var b=luoi.getBoundingClientRect();
          var t=(ev.clientX-b.left)/b.width*2-1;          /* -1 ở mép trái, 0 ở tâm, 1 ở mép phải */
          var d=Math.abs(t);
          if(d<VUNG_CHET){dungChay();return}
          var manh=(d-VUNG_CHET)/(1-VUNG_CHET);            /* 0 tới 1 */
          datHuong(t<0?-1:1, CHAM-(CHAM-NHANH)*manh);
        });
        luoi.addEventListener('pointerleave',dungChay);
        luoi.addEventListener('pointerdown',dungChay);
        document.addEventListener('visibilitychange',function(){if(document.hidden)dungChay()});
      }

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


  /* Canh số thứ tự cỡ lớn: đỉnh số ngang đỉnh chữ của tên góc nhìn,
     chân số ngang đường chân chữ của dòng diễn giải cuối cùng.
     Canh theo nét chữ thật chứ không theo khung chữ, vì khung chữ chừa khoảng trống trên dưới.
     Các hệ số dưới đây đo bằng pixel trên chính phông web của trang (cỡ 200px, line-height 1).
     Số dùng chữ số thẳng hàng (lining-nums); để kiểu mặc định thì Playfair ra số kiểu cổ,
     số 5 thò xuống dưới dòng, không canh được.
       Playfair Display 500: đỉnh nét lên của chữ (như chữ h, l) 0.13em, đường chân chữ 0.915em
       Đỉnh của từng số (nét cao nhất): 01 tới 04 là 0.19em, 05 là 0.155em vì số 5 có cái cờ nhô lên
       Be Vietnam Pro 300: đường chân chữ 0.86em
     Đổi phông hoặc thêm số mới thì phải đo lại, cách đo ghi trong tham-khao/bo-cuc-tap-chi.md mục 10. */
  var PF_DINH=0.13, PF_CHAN=0.915, BVP_CHAN=0.86;
  var SO_DINH={'01':.19,'02':.19,'03':.19,'04':.19,'05':.155,'06':.19};
  function canhSo(){
    var o=document.querySelector('[data-so]');
    var h1=document.querySelector('.dau-trang h1'), mo=document.querySelector('.dau-trang .mo-ta');
    if(!o||!h1||!mo)return;
    /* Màn hẹp thì số nằm trên khối chữ, bỏ canh */
    if(innerWidth<=900){o.style.fontSize='';o.style.lineHeight='';o.style.marginTop='';return}
    var soDinh=SO_DINH[(o.textContent||'').trim()]||.19;

    var g1=getComputedStyle(h1), g2=getComputedStyle(mo);
    var F1=parseFloat(g1.fontSize), L1=parseFloat(g1.lineHeight)||F1*1.2;
    var F2=parseFloat(g2.fontSize), L2=parseFloat(g2.lineHeight)||F2*1.2;
    var b1=h1.getBoundingClientRect(), b2=mo.getBoundingClientRect();
    var soDong=Math.max(1,Math.round(b2.height/L2));

    var dinh=b1.top+(L1-F1)/2+PF_DINH*F1;                          /* đỉnh chữ của tên */
    var chan=b2.top+(soDong-1)*L2+(L2-F2)/2+BVP_CHAN*F2;           /* chân chữ dòng diễn giải cuối */
    var cao=chan-dinh;
    if(!(cao>40))return;

    var F=cao/(PF_CHAN-soDinh);                                    /* cỡ số để nét số cao đúng bằng khoảng đó */
    o.style.fontSize=F+'px';
    o.style.lineHeight='1';
    o.style.marginTop='0px';
    var hop=o.getBoundingClientRect().top;
    o.style.marginTop=(dinh-soDinh*F-hop)+'px';
  }
  function canhSoLai(){clearTimeout(canhSo._h);canhSo._h=setTimeout(canhSo,60)}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(canhSoLai);
  addEventListener('load',canhSoLai);
  addEventListener('resize',canhSoLai);
  setTimeout(canhSoLai,600);

  /* ?mau=1 chỉ dùng trên máy để xem bố cục bằng bài mẫu; file bài mẫu không có trên web */
  if(/[?&]mau=1\b/.test(location.search)){
    var s=document.createElement('script'); s.src=goc+'bai-viet-mau.js'; s.onload=chay; s.onerror=chay; document.head.appendChild(s);
  } else chay();
})();
