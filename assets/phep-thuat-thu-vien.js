/* Phép thuật dùng chung cho hai trang phòng đọc (Khánh chọn hiệu ứng B + C ngày 01/10/2026):
   1. Bìa bay: bấm một cuốn trên tủ, một bản sao bìa bay từ chỗ cuốn đó sang trang trái của sổ rồi tan; sổ hiện bìa thật.
   2. Đom đóm: 18 con lượn chậm khắp màn hình; một bầy 6 con kéo tới cuốn đang rê chuột, và ở lại quanh cuốn đang chọn.
   3. Mực phát sáng: khối chữ vừa vẽ xong hiện dần từ trái sang phải như đang viết (lớp .viet, mỗi dòng trễ thêm một chút).
   Máy bật giảm chuyển động: không đom đóm, bìa không bay, chữ hiện ngay. Điện thoại (dưới 900px) không có bầy đom đóm.
   Mọi hình vẽ (bìa) do trang gọi tự tạo; file này chỉ lo di chuyển. Gọi: window.PhongDoc.{baySach, vayQuanh, vayVe, vietMuc, dom} */
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

  window.PhongDoc={dom:dom,baySach:baySach,vayQuanh:vayQuanh,vayVe:vayVe,chon:chon,vietMuc:vietMuc,nghe:nghe,giam:giam};
})();
