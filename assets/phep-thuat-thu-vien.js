/* Phép thuật dùng chung cho hai trang phòng đọc (Khánh chọn hiệu ứng B + C ngày 01/10/2026):
   1. Bìa bay: bấm một cuốn trên tủ, một bản sao bìa bay từ chỗ cuốn đó sang trang trái của sổ rồi tan; sổ hiện bìa thật.
   2. Đom đóm: 18 con lượn chậm khắp màn hình; một bầy 6 con kéo tới cuốn đang rê chuột, và ở lại quanh cuốn đang chọn.
   3. Mực phát sáng: khối chữ vừa vẽ xong hiện dần từ trái sang phải như đang viết (lớp .viet, mỗi dòng trễ thêm một chút).
   Máy bật giảm chuyển động: không đom đóm, bìa không bay, chữ hiện ngay. Điện thoại (dưới 900px) không có bầy đom đóm.
   4. Xếp hàng: chia các cuốn của một ngăn thành từng hàng không xuống dòng, mỗi hàng chừa sẵn chỗ để một gáy mở ra thành bìa
      (các cuốn phía sau dịt ra mà không rớt xuống hàng dưới). Xếp lại khi đổi bề ngang cửa sổ.
   5. Sổ mở lớn (Khánh chọn 01/10): "Đọc thêm" mở quyển sổ hai trang ra giữa màn hình, nền tối mờ phía sau.
      moLon(trai, phai, nutGoc) đổ hai trang và mở; Esc, nút ×, bấm ra ngoài thì đóng và trả con trỏ về nút đã bấm.
      xemPhai(true|false): trên điện thoại chỉ hiện một trang, chuyển giữa mục lục và nội dung.
   6. Đèn ngăn (Khánh chọn 03/10): datDen(tu) gắn ba thanh đèn đồng sát mép dưới ván kệ trên mỗi ngăn, ở 1/6, 3/6, 5/6 bề ngang,
      mỗi thanh kèm chùm sáng, quầng nóng, vũng sáng và chín hạt bụi; CSS lo bật tắt và chập chờn lúc bật.
   Mọi hình vẽ (bìa) do trang gọi tự tạo; file này chỉ lo di chuyển. Gọi: window.PhongDoc.{baySach, vayQuanh, vayVe, vietMuc, dom, xepHang, moLon, dongLon, xemPhai, datDen} */
(function(){
  var giam=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function R(a,b){return a+Math.random()*(b-a)}
  function tao(tag,cls){var e=document.createElement(tag);if(cls)e.className=cls;return e}

  /* ---------- Đom đóm lượn khắp phòng ---------- */
  var lop=null, bay=null, dangChon=null;
  function dom(){
    if(giam||lop)return;
    lop=tao('div','pd-dom'); lop.setAttribute('aria-hidden','true');
    for(var i=0;i<18;i++){var d=tao('i');d.style.cssText='--x:'+R(2,98).toFixed(1)+'%;--y:'+R(8,96).toFixed(1)+'%;--dx:'+R(-140,140).toFixed(0)+'px;--dy:'+R(-100,100).toFixed(0)+'px;--t:'+R(7,13).toFixed(1)+'s;--d:-'+R(0,13).toFixed(1)+'s';lop.appendChild(d)}
    document.body.appendChild(lop);
    bay=tao('div','pd-bay-dom'); bay.setAttribute('aria-hidden','true');
    for(var k=0;k<6;k++){var c=tao('i');c.style.cssText='--x1:'+R(-44,44).toFixed(0)+'px;--y1:'+R(-90,70).toFixed(0)+'px;--x2:'+R(-44,44).toFixed(0)+'px;--y2:'+R(-90,70).toFixed(0)+'px;--d:-'+(k*.55).toFixed(2)+'s';bay.appendChild(c)}
    document.body.appendChild(bay);
  }
  /* Đưa bầy tới giữa một phần tử (tọa độ trang, vì bầy nằm trong body chứ không trong khung cố định) */
  function vayQuanh(el){
    if(!bay||!el)return;
    var r=el.getBoundingClientRect();
    bay.style.left=(r.left+r.width/2+window.scrollX)+'px'; bay.style.top=(r.top+r.height/2+window.scrollY)+'px';
    bay.classList.add('hien');
  }
  function vayVe(){if(dangChon)vayQuanh(dangChon);else if(bay)bay.classList.remove('hien')}
  function chon(el){dangChon=el||null;vayVe()}

  /* ---------- Bìa bay từ tủ sang sổ ----------
     tu: phần tử bìa đang hiện trên tủ (mặt bìa của gáy hay bìa dựng); dich: chỗ bìa sẽ hiện trong sổ; biaMoi: node bìa để bay.
     Bay theo kiểu FLIP: đặt bản sao cố định đúng chỗ xuất phát, khung hình sau dịch tới đích bằng transform. */
  function baySach(tu,dich,biaMoi,xong){
    if(giam||!tu||!dich||!biaMoi){xong&&xong();return}
    var a=tu.getBoundingClientRect(), b=dich.getBoundingClientRect();
    if(!a.width||!b.width){xong&&xong();return}
    var v=tao('div','pd-bay'); v.setAttribute('aria-hidden','true');
    v.style.left=a.left+'px'; v.style.top=a.top+'px'; v.style.width=a.width+'px'; v.style.height=a.height+'px';
    v.appendChild(biaMoi); document.body.appendChild(v);
    var da=false;
    function het(){if(da)return;da=true;v.remove();xong&&xong()}
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      var sx=b.width/a.width, sy=b.height/a.height;
      v.style.transform='translate('+(b.left-a.left)+'px,'+(b.top-a.top)+'px) scale('+sx.toFixed(3)+','+sy.toFixed(3)+')';
      v.style.opacity='0';
      v.addEventListener('transitionend',function(e){if(e.propertyName==='opacity')het()});
      setTimeout(het,1300);
    })});
  }

  /* ---------- Mực phát sáng: các con trực tiếp của khối hiện dần, mỗi dòng trễ .11s, tối đa 14 dòng rồi hiện luôn ---------- */
  function vietMuc(khoi){
    if(!khoi)return;
    if(giam){khoi.classList.remove('viet');return}
    var ds=khoi.children, n=Math.min(ds.length,14);
    for(var i=0;i<ds.length;i++)ds[i].style.setProperty('--i',i<n?i:n);
    khoi.classList.remove('viet'); void khoi.offsetWidth; khoi.classList.add('viet');
  }

  /* Rê chuột lên cuốn nào thì bầy kéo tới; rời ra thì về cuốn đang chọn */
  function nghe(goc){
    if(!bay||!goc)return;
    goc.addEventListener('pointerover',function(e){var c=e.target.closest&&e.target.closest('.gay,.bia-dung,.pd-the-ghi');if(c)vayQuanh(c)});
    goc.addEventListener('pointerleave',vayVe);
    addEventListener('resize',vayVe);
  }

  /* ---------- Xếp hàng ----------
     ngan: phần tử ngăn (đã nằm trong trang); nuts: các nút theo thứ tự; mỗi nút có data-r là bề ngang lúc đứng gáy.
     Bìa mở rộng 128px nên mỗi hàng chừa 100px (gáy mỏng nhất 30px); khổ rộng chừa 190px để một cuốn đang mở và một cuốn đang rê cùng hàng vẫn vừa. */
  var dsXep=[], MO=128, GAP=4, henXep=null;
  function xep(o){
    var W=o.ngan.clientWidth; if(!W||W===o.w)return; o.w=W;
    var du=W>=500?190:100, han=W-du, hang=[], cur=null, dai=0;
    o.nuts.forEach(function(n){
      var r=+n.getAttribute('data-r')||n.offsetWidth;
      if(!cur||(cur.length&&dai+GAP+r>han)){cur=[];hang.push(cur);dai=0}else if(cur.length)dai+=GAP;
      cur.push(n); dai+=r;
    });
    o.hang.forEach(function(h){h.remove()}); o.hang=[];
    hang.forEach(function(ds){var h=document.createElement('div');h.className='pd-hang';ds.forEach(function(n){h.appendChild(n)});o.ngan.appendChild(h);o.hang.push(h)});
  }
  function xepHang(ngan,nuts){var o={ngan:ngan,nuts:nuts,w:0,hang:[]};dsXep.push(o);xep(o);return o}
  addEventListener('resize',function(){clearTimeout(henXep);henXep=setTimeout(function(){dsXep.forEach(xep);vayVe()},150)});

  /* ---------- Sổ mở lớn ---------- */
  var lon=null, soLon=null, mTrai=null, mPhai=null, nutVe=null;
  function dungLon(){
    if(lon)return;
    lon=tao('div','pd-mo-lon'); lon.setAttribute('aria-hidden','true');
    var nen=tao('div','pd-mo-nen'); nen.addEventListener('click',dongLon); lon.appendChild(nen);
    soLon=tao('div','pd-mo-so'); soLon.setAttribute('role','dialog'); soLon.setAttribute('aria-modal','true'); soLon.setAttribute('aria-label','Sổ đọc mở lớn'); soLon.tabIndex=-1;
    var d=tao('button','pd-mo-dong'); d.type='button'; d.textContent='×'; d.setAttribute('aria-label','Đóng sổ'); d.addEventListener('click',dongLon); soLon.appendChild(d);
    mTrai=tao('div','mo-trai'); mPhai=tao('div','mo-phai'); soLon.appendChild(mTrai); soLon.appendChild(mPhai);
    lon.appendChild(soLon); document.body.appendChild(lon);
    document.addEventListener('keydown',function(e){
      if(!lon.classList.contains('mo'))return;
      if(e.key==='Escape'){e.preventDefault();dongLon();return}
      /* Giữ con trỏ bàn phím trong sổ */
      if(e.key==='Tab'){
        var ds=[].filter.call(soLon.querySelectorAll('button,a[href],input'),function(x){return x.offsetParent!==null&&!x.disabled});
        if(!ds.length)return;
        if(e.shiftKey&&document.activeElement===ds[0]){e.preventDefault();ds[ds.length-1].focus()}
        else if(!e.shiftKey&&document.activeElement===ds[ds.length-1]){e.preventDefault();ds[0].focus()}
      }
    });
  }
  function moLon(trai,phai,nut){
    dungLon();
    mTrai.innerHTML=''; mPhai.innerHTML=''; mTrai.appendChild(trai); mPhai.appendChild(phai);
    mTrai.scrollTop=0; mPhai.scrollTop=0; xemPhai(false);
    nutVe=nut||document.activeElement;
    lon.setAttribute('aria-hidden','false'); lon.classList.add('mo'); document.body.classList.add('pd-khoa');
    setTimeout(function(){var d=soLon.querySelector('.pd-mo-dong');if(d)d.focus({preventScroll:true})},giam?0:60);
    return {trai:mTrai,phai:mPhai};
  }
  function dongLon(){
    if(!lon||!lon.classList.contains('mo'))return;
    lon.classList.remove('mo'); lon.setAttribute('aria-hidden','true'); document.body.classList.remove('pd-khoa');
    if(nutVe&&nutVe.focus)nutVe.focus({preventScroll:true});
  }
  function xemPhai(co){if(soLon){soLon.classList.toggle('xem-phai',!!co);if(co)mPhai.scrollTop=0}}

  /* ---------- Đèn ngăn: ba thanh mỗi ngăn, chia đều bề ngang (vị trí theo %, không cần tính lại khi đổi khổ) ---------- */
  function datDen(tu){
    if(!tu)return;
    [].forEach.call(tu.querySelectorAll('.pd-ngan'),function(n){
      if(n.querySelector('.tl-den-ngan'))return;
      var c=tao('div','tl-den-ngan'); c.setAttribute('aria-hidden','true');
      for(var i=0;i<3;i++){
        var d=tao('span','tl-den'); d.style.left=((2*i+1)/6*100).toFixed(3)+'%';
        ['tl-chum','tl-nong','tl-vung'].forEach(function(k){d.appendChild(tao('b',k))});
        var bui=tao('b','tl-bui');   /* chín hạt bụi, vị trí và nhịp ngẫu nhiên */
        for(var h=0;h<9;h++){var u=tao('u');u.style.cssText='--x:'+R(8,92).toFixed(0)+'%;--y:'+R(4,96).toFixed(0)+'%;--dx:'+R(-14,14).toFixed(0)+'px;--dy:'+R(-22,10).toFixed(0)+'px;--t:'+R(5,9).toFixed(1)+'s;--tre:-'+R(0,9).toFixed(1)+'s';bui.appendChild(u)}
        d.appendChild(bui); c.appendChild(d);
      }
      n.insertBefore(c,n.firstChild);
    });
  }

  window.PhongDoc={datDen:datDen,dom:dom,baySach:baySach,vayQuanh:vayQuanh,vayVe:vayVe,chon:chon,vietMuc:vietMuc,nghe:nghe,xepHang:xepHang,moLon:moLon,dongLon:dongLon,xemPhai:xemPhai,giam:giam};
})();
