/* Quyển sổ tay ở trang góc nhìn (bố cục học từ mẫu Sketchbook của ThreeUI, dịch sang hệ của Khánh).
   Mỗi bài một cặp trang: trang trái là hình bài vẽ nét, trang phải là chữ bài.
   Sổ gồm hai trang nền cố định và các tờ giấy (lá) xếp chồng bên phải. Tờ thứ k: mặt trước là chữ bài k,
   mặt sau là hình bài k+1. Lật tờ k sang trái thì cặp trang k+1 hiện ra.
   Tờ giấy cắt thành N dải dọc lồng nhau; khi lật, mỗi dải gập thêm một góc nhỏ nên tờ giấy cong như giấy thật.
   Nội dung mỗi mặt được chép vào từng dải rồi dịch trái cho đúng phần của dải đó.
   Chép nhiều lần nên bản trong sổ ẩn khỏi trình đọc màn hình; nội dung đọc được nằm ở mục lục và dòng thông báo.
   Gọi: window.SoTay.ve(danhSachBai, gocDuongDan). */
(function(){
  var N=8, GAP_MAX=9;                /* số dải mỗi tờ, góc gập tối đa mỗi dải (độ) */
  var MUC_ZOOM=[.8,1,1.25,1.5];
  var soiMoi=null, daGanResize=false;
  var giam=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tao(tag,cls,chu){var e=document.createElement(tag);if(cls)e.className=cls;if(chu!=null)e.textContent=chu;return e}
  function so(n){return (n<10?'0':'')+n}
  function ngayVN(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?m[3]+' · '+m[2]+' · '+m[1]:''}
  function q(s,g){return (g||document).querySelector(s)}

  /* ---------- Mặt trang ---------- */
  function trangHinh(b,goc){
    var p=tao('div','tr tr-hinh');
    if(!b){p.classList.add('tr-trong');return p}
    var ma=(b.ma||'').replace(/\./g,'-');
    if(ma){var nen=tao('span','tr-nen');nen.style.backgroundImage='url("'+goc+'anh-bai/nen-'+ma+'.svg")';p.appendChild(nen)}
    if(b.anh){
      var net=tao('span','tr-net'), u='url("'+encodeURI(goc+b.anh)+'")';
      net.style.webkitMaskImage=u; net.style.maskImage=u; p.appendChild(net);
    }
    if(b.ngay)p.appendChild(tao('span','tr-dau',ngayVN(b.ngay)));
    return p;
  }
  function trangChu(b,i,tong,goc,sap){
    var p=tao('div','tr tr-chu');
    if(!b){p.classList.add('tr-trong');return p}
    p.appendChild(tao('span','tr-so',so(i+1)+' / '+so(tong)));
    p.appendChild(tao('span','tr-nhom',b.nhom||'Bài viết'));
    p.appendChild(tao('h3','tr-ten',b.tieuDe));
    if(b.tomTat)p.appendChild(tao('p','tr-tom',b.tomTat));
    var m=[]; if(b.ngay)m.push((sap?'Sắp đăng · ':'')+ngayVN(b.ngay).replace(/ · /g,'/')); if(b.phutDoc)m.push(b.phutDoc+' phút đọc');
    p.appendChild(tao('span','tr-meta',m.join(' · ')));
    if(b.duongDan){var a=tao('a','tr-doc','Đọc bài →');a.href=goc+b.duongDan;a.tabIndex=-1;p.appendChild(a)}
    return p;
  }

  /* Một tờ giấy: N dải lồng nhau, mỗi dải có mặt trước và mặt sau */
  function toGiay(truoc,sau){
    var la=tao('div','la'), cha=la;
    for(var j=0;j<N;j++){
      var d=tao('div','dai'+(j===0?' dai-dau':''));
      var mt=tao('div','mt'), ms=tao('div','ms');
      var n1=tao('div','noi'); n1.style.left=(-j*100)+'%'; n1.appendChild(truoc.cloneNode(true)); mt.appendChild(n1);
      var n2=tao('div','noi'); n2.style.left=(-(N-1-j)*100)+'%'; n2.appendChild(sau.cloneNode(true)); ms.appendChild(n2);
      d.appendChild(mt); d.appendChild(ms); cha.appendChild(d); cha=d;
    }
    return la;
  }

  function ve(danh,goc){
    var vung=q('[data-so-tay]'); if(!vung)return;
    var so_=q('[data-st-so]',vung), san=q('[data-st-san]',vung), kinh=q('[data-st-kinh]',vung),
        kinhNoi=q('[data-st-kinh-noi]',vung), bao=q('[data-st-bao]',vung), dem=q('[data-st-dem]',vung),
        muiTruoc=q('[data-st-truoc]',vung), muiSau=q('[data-st-sau]',vung),
        docNgoai=q('[data-st-doc]',vung), zTru=q('[data-st-zoom="-"]',vung), zCong=q('[data-st-zoom="+"]',vung), zChu=q('[data-st-zoom-chu]',vung);
    var n=danh.length;
    vung.hidden=!n; if(!n)return;
    var d=new Date(), homNay=d.getFullYear()+'-'+so(d.getMonth()+1)+'-'+so(d.getDate());
    function sap(b){return b&&b.ngay&&b.ngay>homNay}

    /* Dựng sổ */
    so_.innerHTML='';
    var nenTrai=tao('div','nen nen-trai'), nenPhai=tao('div','nen nen-phai');
    nenTrai.appendChild(trangHinh(danh[0],goc)); nenPhai.appendChild(trangChu(null));
    so_.appendChild(nenTrai); so_.appendChild(nenPhai);
    var la=danh.map(function(b,k){
      var t=toGiay(trangChu(b,k,n,goc,sap(b)), trangHinh(danh[k+1],goc));
      so_.appendChild(t); return t;
    });
    so_.appendChild(tao('span','gay'));

    var hien=0, chay=null;
    function datGoc(t,p){
      /* p: 0 là tờ nằm bên phải, 1 là đã lật sang trái */
      var cong=Math.sin(p*Math.PI);
      t.style.setProperty('--a',(-180*p)+'deg');
      t.style.setProperty('--b',(-GAP_MAX*cong)+'deg');
      t.style.setProperty('--bong',cong.toFixed(3));
    }
    function xep(){
      la.forEach(function(t,k){
        var lat=k<hien;
        datGoc(t,lat?1:0);
        t.style.zIndex=lat?(10+k):(10+n*2-k);
        t.classList.toggle('da-lat',lat);
      });
      var b=danh[hien];
      if(dem)dem.textContent='Bài '+so(hien+1)+' / '+so(n);
      if(muiTruoc)muiTruoc.disabled=hien<=0; if(muiSau)muiSau.disabled=hien>=n-1;
      if(bao)bao.textContent='Bài '+(hien+1)+' trên '+n+': '+b.tieuDe;
      if(docNgoai){docNgoai.hidden=!b.duongDan;if(b.duongDan)docNgoai.href=goc+b.duongDan}
      [].forEach.call(document.querySelectorAll('[data-ml] .ml-dong'),function(x,i){x.setAttribute('aria-current',i===hien?'true':'false')});
      veKinh();
    }

    /* Hoạt ảnh lật một tờ, p0 tới p1 */
    function lat(t,p0,p1,xong){
      if(chay)cancelAnimationFrame(chay.id);
      t.style.zIndex=1000;
      if(giam){datGoc(t,p1);xong();return}
      var T=Math.max(180,700*Math.abs(p1-p0)), t0=null;
      chay={id:requestAnimationFrame(function buoc(ts){
        if(!t0)t0=ts;
        var k=Math.min((ts-t0)/T,1), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
        datGoc(t,p0+(p1-p0)*e);
        if(k<1)chay.id=requestAnimationFrame(buoc); else {chay=null;xong()}
      })};
    }
    function toi(){if(hien<n-1){var k=hien;lat(la[k],0,1,function(){hien=k+1;xep()})}}
    function lui(){if(hien>0){var k=hien-1;lat(la[k],1,0,function(){hien=k;xep()})}}
    function den(i){
      i=Math.max(0,Math.min(n-1,i)); if(i===hien)return;
      if(Math.abs(i-hien)===1){i>hien?toi():lui();return}
      hien=i; xep();
    }

    /* Kéo mép trang để lật; bấm (không kéo) nửa phải thì lật tới, nửa trái thì lật lui */
    var keo=null;
    so_.onpointerdown=function(ev){
      if(ev.button!==0||chay||ev.target.closest('.tr-doc'))return;
      var r=so_.getBoundingClientRect(), phai=ev.clientX>r.left+r.width/2;
      if(phai&&hien>=n-1)return; if(!phai&&hien<=0)return;
      keo={x0:ev.clientX,phai:phai,t:la[phai?hien:hien-1],w:r.width/2,p:phai?0:1,di:0};
      keo.t.style.zIndex=1000;
      so_.setPointerCapture(ev.pointerId);
    };
    so_.onpointermove=function(ev){
      if(!keo)return;
      var dx=ev.clientX-keo.x0; keo.di=Math.max(keo.di,Math.abs(dx));
      keo.p=keo.phai?Math.min(1,Math.max(0,-dx/(keo.w*1.7))):Math.min(1,Math.max(0,1-dx/(keo.w*1.7)));
      datGoc(keo.t,keo.p);
    };
    function tha(){
      if(!keo)return; var k=keo; keo=null;
      var idx=la.indexOf(k.t);
      if(k.di<6){ /* bấm */
        if(k.phai)lat(k.t,k.p,1,function(){hien=idx+1;xep()}); else lat(k.t,k.p,0,function(){hien=idx;xep()});
        return;
      }
      if(k.phai){ if(k.p>.3)lat(k.t,k.p,1,function(){hien=idx+1;xep()}); else lat(k.t,k.p,0,xep) }
      else      { if(k.p<.7)lat(k.t,k.p,0,function(){hien=idx;xep()}); else lat(k.t,k.p,1,xep) }
    }
    so_.onpointerup=tha; so_.onpointercancel=tha;
    so_.ondragstart=function(ev){ev.preventDefault()};
    san.onkeydown=function(ev){
      if(ev.target!==san)return;
      if(ev.key==='ArrowRight'){ev.preventDefault();toi()}
      if(ev.key==='ArrowLeft'){ev.preventDefault();lui()}
    };

    /* Mũi tên hai bên sổ */
    if(muiTruoc)muiTruoc.onclick=function(){if(!chay)lui()};
    if(muiSau)muiSau.onclick=function(){if(!chay)toi()};

    /* Phóng to thu nhỏ */
    var z=1;
    function datZoom(v){
      z=v; vung.style.setProperty('--zoom',z);
      vung.classList.toggle('dang-phong',z>1);
      if(zChu)zChu.textContent=Math.round(z*100)+'%';
      var i=MUC_ZOOM.indexOf(z);
      if(zTru)zTru.disabled=i<=0; if(zCong)zCong.disabled=i>=MUC_ZOOM.length-1;
      veKinh();
    }
    if(zTru)zTru.onclick=function(){var i=MUC_ZOOM.indexOf(z);if(i>0)datZoom(MUC_ZOOM[i-1])};
    if(zCong)zCong.onclick=function(){var i=MUC_ZOOM.indexOf(z);if(i<MUC_ZOOM.length-1)datZoom(MUC_ZOOM[i+1])};

    /* Kính lúp: kéo trong khung sổ; trong kính là bản chép cặp trang đang mở, phóng 2 lần */
    var PHONG=2;
    function veKinh(){
      if(!kinh||!kinhNoi)return;
      kinhNoi.innerHTML='';
      var ban=tao('div','kinh-so');
      var trai=tao('div','nen nen-trai'), phai=tao('div','nen nen-phai');
      trai.appendChild(trangHinh(danh[hien],goc)); phai.appendChild(trangChu(danh[hien],hien,n,goc,sap(danh[hien])));
      ban.appendChild(trai); ban.appendChild(phai); ban.appendChild(tao('span','gay'));
      kinhNoi.appendChild(ban);
      soiKinh();
    }
    function soiKinh(){
      if(!kinh||!kinhNoi.firstChild)return;
      var ban=kinhNoi.firstChild, r=so_.getBoundingClientRect(), k=kinh.getBoundingClientRect();
      var W=so_.offsetWidth, H=so_.offsetHeight, R=k.width/2;
      ban.style.width=W+'px'; ban.style.height=H+'px';
      var u=(k.left+R-r.left)/r.width*W, v=(k.top+R-r.top)/r.height*H, M=PHONG*z;
      ban.style.transform='translate('+(R-u*M)+'px,'+(R-v*M)+'px) scale('+M+')';
    }
    if(kinh){
      var kk=null;
      function datViTri(x,y){
        var s=san.getBoundingClientRect(), k=kinh.offsetWidth;
        x=Math.max(-k*.3,Math.min(s.width-k*.7,x)); y=Math.max(-k*.3,Math.min(s.height-k*.7,y));
        kinh.style.left=x+'px'; kinh.style.top=y+'px'; kinh.style.right='auto'; kinh.style.bottom='auto';
        soiKinh();
      }
      kinh.onpointerdown=function(ev){
        if(ev.button!==0)return; ev.stopPropagation(); ev.preventDefault();
        var s=san.getBoundingClientRect(), b=kinh.getBoundingClientRect();
        kk={dx:ev.clientX-b.left,dy:ev.clientY-b.top,sx:s.left,sy:s.top};
        kinh.setPointerCapture(ev.pointerId); kinh.classList.add('dang-keo');
      };
      kinh.onpointermove=function(ev){if(kk)datViTri(ev.clientX-kk.sx-kk.dx,ev.clientY-kk.sy-kk.dy)};
      kinh.onpointerup=kinh.onpointercancel=function(){kk=null;kinh.classList.remove('dang-keo')};
      kinh.onkeydown=function(ev){
        var m={ArrowLeft:[-24,0],ArrowRight:[24,0],ArrowUp:[0,-24],ArrowDown:[0,24]}[ev.key]; if(!m)return;
        ev.preventDefault();
        datViTri(kinh.offsetLeft+m[0],kinh.offsetTop+m[1]);
      };
      /* Gắn một lần: lọc nhóm gọi ve() lại nhiều lần, chỉ cần soi theo lần vẽ mới nhất */
      soiMoi=soiKinh;
      if(!daGanResize){daGanResize=true;addEventListener('resize',function(){soiMoi&&soiMoi()})}
    }

    /* Mục lục: bấm dòng là sổ lật tới bài đó */
    var ml=q('[data-ml]');
    if(ml){
      ml.innerHTML='';
      danh.forEach(function(b,i){
        var li=tao('li'), nut=tao('button','ml-dong'); nut.type='button';
        nut.appendChild(tao('span','ml-so',so(i+1)));
        var g=tao('span','ml-giua'); g.appendChild(tao('span','ml-ten',b.tieuDe));
        if(b.tomTat)g.appendChild(tao('span','ml-tom',b.tomTat));
        nut.appendChild(g);
        nut.appendChild(tao('span','ml-nhom',(b.nhom||'Bài viết')+(b.ngay?' · '+ngayVN(b.ngay).replace(/ · /g,'/').slice(0,5):'')));
        nut.onclick=function(){
          den(i);
          san.scrollIntoView({behavior:giam?'auto':'smooth',block:'center'});
          setTimeout(function(){san.focus({preventScroll:true})},giam?0:450);
        };
        li.appendChild(nut); ml.appendChild(li);
      });
      q('[data-muc-luc]').hidden=false;
    }

    datZoom(1);
    xep();
  }
  window.SoTay={ve:ve};
})();
