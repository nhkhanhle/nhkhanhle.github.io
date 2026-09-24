(function(){
  var goc='../', slug=document.body.getAttribute('data-chu-de');
  function q(s){return document.querySelector(s)}
  function tao(tag,cls,chu){var e=document.createElement(tag);if(cls)e.className=cls;if(chu!=null)e.textContent=chu;return e}
  function ngayVN(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?m[3]+'/'+m[2]+'/'+m[1]:(s||'')}
  function so(n){return (n<10?'0':'')+n}

  function chay(){
    /* CHI_HIEN_DA_DANG=true thì chỉ hiện bài đã tới ngày đăng, bài của những tuần sau tự ẩn.
       Đang để false để xem trước bố cục cả 26 bài; bài chưa viết trỏ về trang "đang được thực hiện". */
    var CHI_HIEN_DA_DANG=false;
    var d=new Date(), homNay=d.getFullYear()+'-'+so(d.getMonth()+1)+'-'+so(d.getDate());
    var ds=(window.BAI_VIET||[]).concat(window.BAI_VIET_MAU||[]).filter(function(b){
      return b.chuDe===slug && b.tieuDe && (!CHI_HIEN_DA_DANG || !b.ngay || b.ngay<=homNay);
    });
    /* Chạy thật: bài mới nhất lên đầu. Xem trước cả kế hoạch: bài sắp đăng gần nhất lên đầu. */
    ds.sort(function(x,y){return CHI_HIEN_DA_DANG ? (y.ngay||'').localeCompare(x.ngay||'')
                                                  : (x.ngay||'').localeCompare(y.ngay||'')});
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

    /* Sổ tay: mỗi bài một cặp trang, lật theo thứ tự ngày đăng (assets/so-tay.js); mục lục bên dưới */
    function hienThi(nhom){
      var chon=ds.filter(function(b){return !nhom||b.nhom===nhom});
      if(window.SoTay)window.SoTay.ve(chon,goc);
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
