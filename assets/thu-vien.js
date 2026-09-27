/* Dựng trang Thư viện từ dữ liệu thu-vien.js: ba kệ luật, sách, ghi chú; nút lọc theo chủ đề; đếm số mục trên đầu trang.
   Không có JavaScript thì trang chỉ hiện đầu trang và ba kệ trống với dòng "đang xếp". */
(function(){
  var D=window.THU_VIEN||{}, sach=D.sach||[], ghi=D.ghiChu||[];
  function q(s,g){return (g||document).querySelector(s)}
  function tao(tag,cls,chu){var e=document.createElement(tag);if(cls)e.className=cls;if(chu!=null)e.textContent=chu;return e}
  function ngayVN(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?m[3]+'/'+m[2]+'/'+m[1]:(s||'')}
  function nhanMau(cha,muc){if(muc.mau)cha.appendChild(tao('span','tv-mau','Mẫu'))}
  function lienKet(url,chu){var a=tao('a','lien',chu);a.href=url;a.target='_blank';a.rel='noopener';return a}

  /* Đếm số mục lên ba nút đầu trang */
  [['sach',sach.length],['ghi-chu',ghi.length]].forEach(function(x){var e=q('[data-dem="'+x[0]+'"]');if(e)e.textContent=String(x[1]).replace(/^(\d)$/,'0$1')});

  /* Dòng báo còn chữ giữ chỗ */
  var coMau=sach.concat(ghi,(window.TINH_HUONG||[]).slice(0,3)).some(function(m){return m.mau});
  var bao=q('[data-tv-bao]'); if(bao&&coMau)bao.classList.add('hien');

  /* Nút lọc dùng chung cho kệ luật và kệ sách: bấm một chủ đề thì ẩn các mục khác, "Tất cả" hiện lại hết */
  function dungLoc(vung,danh,layNhom,dong){
    var nhom=[]; danh.forEach(function(m){var n=layNhom(m);if(n&&nhom.indexOf(n)<0)nhom.push(n)});
    if(nhom.length<2){vung.hidden=true;return}
    var nut=[];
    function chon(k){
      nut.forEach(function(b){b.setAttribute('aria-pressed',b===k?'true':'false')});
      var n=k.getAttribute('data-nhom');
      dong.forEach(function(d,i){d.hidden=!!n&&layNhom(danh[i])!==n});
    }
    ['']. concat(nhom).forEach(function(n){
      var b=tao('button',null,n||'Tất cả'); b.type='button'; b.setAttribute('data-nhom',n); b.setAttribute('aria-pressed',n?'false':'true');
      b.addEventListener('click',function(){chon(b)}); vung.appendChild(b); nut.push(b);
    });
  }

  /* ---------- Kệ 1: cửa vào tra cứu. Đọc mục lục để đếm và liệt kê nhóm; tình huống thường gặp lấy 3 mục đầu ---------- */
  var kTu=q('[data-tv-tu]'), kTh=q('[data-tv-th]');
  if(kTu){
    fetch('tra-cuu/du-lieu/muc-luc.json').then(function(r){return r.json()}).then(function(m){
      var dem=q('[data-dem="luat"]'); if(dem)dem.textContent=m.tongVanBan;
      m.nhom.forEach(function(n){
        var a=tao('a','tv-nhom'); a.href='tra-cuu-luat.html?vb='+encodeURIComponent(n.vanBan[0].id);
        a.appendChild(tao('b',null,n.ten)); a.appendChild(tao('span',null,n.soVanBan+' văn bản · '+n.soDieu+' điều')); kTu.appendChild(a);
      });
      var th=(window.TINH_HUONG||[]).slice(0,3);
      var VB={}; m.nhom.forEach(function(n){n.vanBan.forEach(function(v){VB[v.id]=v})});
      th.forEach(function(t){
        var c=tao('article'); var h=tao('h3',null,t.cauHoi); if(t.mau)h.appendChild(tao('span','tv-mau','Mẫu')); c.appendChild(h);
        if(t.dan&&t.dan.length){var d=tao('div','dan');t.dan.forEach(function(x){var v=VB[x.vb];if(!v)return;var a=tao('a',null,'Điều '+x.dieu+' · '+v.tenNgan);a.href='tra-cuu-luat.html?vb='+encodeURIComponent(x.vb)+'&q='+encodeURIComponent('điều '+x.dieu);d.appendChild(a)});c.appendChild(d)}
        kTh.appendChild(c);
      });
    },function(){kTu.appendChild(tao('p','ke-trong','Chưa mở được tủ văn bản.'))});
  }

  /* ---------- Kệ 2: sách và khóa học ---------- */
  var kSach=q('[data-ke-sach]');
  if(kSach){
    if(!sach.length){kSach.appendChild(tao('p','ke-trong','Kệ này đang được xếp.'))}
    else{
      var luoi=tao('div','tv-sach'), cuons=[];
      sach.forEach(function(m){
        var c=tao('article','cuon');
        var bia=tao('div','tv-bia'); bia.appendChild(tao('span','gay')); bia.setAttribute('aria-hidden','true');
        bia.appendChild(tao('span','loai',m.loai||'Sách'));
        bia.appendChild(tao('h3',null,m.ten||''));
        if(m.tacGia)bia.appendChild(tao('div','tac-gia',m.tacGia));
        c.appendChild(bia);
        var duoi=tao('div','duoi');
        var nh=tao('div','nhom-sach',[m.nhom,m.noi,m.nam].filter(Boolean).join(' · ')); nhanMau(nh,m); duoi.appendChild(nh);
        if(m.viSao)duoi.appendChild(tao('p','vi-sao',m.viSao));
        if(m.lienKet)duoi.appendChild(lienKet(m.lienKet,m.loai==='Khóa học'?'Xem khóa học ↗':'Xem sách ↗'));
        c.appendChild(duoi); luoi.appendChild(c); cuons.push(c);
      });
      dungLoc(q('[data-loc-sach]'),sach,function(m){return m.nhom},cuons);
      kSach.appendChild(luoi);
    }
  }

  /* ---------- Kệ 3: ghi chú ---------- */
  var kGhi=q('[data-ke-ghi]');
  if(kGhi){
    if(!ghi.length){kGhi.appendChild(tao('p','ke-trong','Kệ này đang được xếp.'))}
    else{
      var ds=tao('div','tv-ghi');
      ghi.slice().sort(function(a,b){return (b.ngay||'').localeCompare(a.ngay||'')}).forEach(function(m){
        var de=tao('details'), sm=tao('summary');
        sm.appendChild(tao('span','ngay',ngayVN(m.ngay)));
        var g=tao('div'); var h=tao('h3',null,m.tieuDe||''); nhanMau(h,m); g.appendChild(h);
        if(m.tomTat)g.appendChild(tao('p','tom-tat',m.tomTat));
        if(m.the&&m.the.length){var t=tao('div','the');m.the.forEach(function(x){t.appendChild(tao('span',null,x))});g.appendChild(t)}
        sm.appendChild(g); sm.appendChild(tao('span','dau','+')); de.appendChild(sm);
        var than=tao('div','than'); (m.noiDung||'').split(/\n\s*\n/).forEach(function(p){if(p.trim())than.appendChild(tao('p',null,p.trim()))});
        de.appendChild(than); ds.appendChild(de);
      });
      kGhi.appendChild(ds);
    }
  }
})();
