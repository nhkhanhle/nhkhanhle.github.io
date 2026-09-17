/* Ô tìm kiếm cho cả trang. Dữ liệu nằm trong assets/tim-kiem-du-lieu.js,
   dựng lại bằng scripts/dung-tim-kiem.py mỗi khi đổi chữ trên trang. */
(function(){
  var ds = window.TIM_KIEM || [];
  if(!ds.length) return;

  /* Trang con nằm trong thư mục con nên phải lùi một cấp */
  var goc = /\/(chu-de|bai-viet)\//.test(location.pathname) ? '../' : '';

  /* Bỏ dấu để gõ "nhan su" vẫn ra "nhân sự" */
  function bod(s){
    return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
      .replace(/đ/g,'d').replace(/\s+/g,' ').trim();
  }
  ds.forEach(function(x){ x._chu = bod(x.chu); x._ten = bod(x.tieuDe); });

  function tao(t,c,chu){var e=document.createElement(t);if(c)e.className=c;if(chu!=null)e.textContent=chu;return e}

  /* Nút kính lúp gắn vào cuối thanh menu */
  var ul = document.querySelector('.nav ul');
  if(!ul) return;
  var li = tao('li','o-tim');
  var nut = tao('button','nut-tim');
  nut.type='button';
  nut.setAttribute('aria-label','Tìm kiếm trong trang');
  nut.setAttribute('aria-expanded','false');
  nut.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>';
  li.appendChild(nut); ul.appendChild(li);

  /* Lớp phủ */
  var lop = tao('div','lop-tim'); lop.hidden = true;
  lop.setAttribute('role','dialog'); lop.setAttribute('aria-modal','true'); lop.setAttribute('aria-label','Tìm kiếm');
  lop.innerHTML =
    '<div class="hop-tim">'
    + '<div class="o-nhap">'
    +   '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>'
    +   '<input type="search" autocomplete="off" spellcheck="false" placeholder="Tìm bài viết, góc nhìn, nội dung trang" aria-label="Từ khoá tìm kiếm">'
    +   '<button type="button" class="nut-dong">Đóng</button>'
    + '</div>'
    + '<div class="ket-qua" data-kq></div>'
    + '</div>';
  document.body.appendChild(lop);

  var o = lop.querySelector('input'), kq = lop.querySelector('[data-kq]'), dong = lop.querySelector('.nut-dong');

  function goiY(){
    kq.innerHTML='';
    var p = tao('p','goi-y','Gõ vài chữ để tìm trong 5 góc nhìn, các bài viết và nội dung trang chủ. Không cần bỏ dấu.');
    kq.appendChild(p);
  }

  /* Cắt một đoạn quanh chỗ khớp để người đọc thấy ngữ cảnh */
  function doan(x, tu){
    var i = x._chu.indexOf(tu);
    /* Khớp nằm ngay trong tiêu đề thì lấy câu tóm tắt, khỏi lặp lại tiêu đề hai lần */
    if(i < 0 || i < x.tieuDe.length) return x.mo;
    var d = Math.max(0, i-58), c = Math.min(x.chu.length, i+tu.length+78);
    return (d>0?'…':'') + x.chu.slice(d,c).trim() + (c<x.chu.length?'…':'');
  }

  /* Tô đậm chỗ khớp, so trên bản bỏ dấu nhưng cắt trên chữ gốc */
  function toDam(chu, tu){
    var g = bod(chu), ra = document.createDocumentFragment(), tu_ = tu, vt = 0;
    if(!tu_) { ra.appendChild(document.createTextNode(chu)); return ra }
    while(true){
      var i = g.indexOf(tu_, vt);
      if(i < 0 || i >= chu.length){ ra.appendChild(document.createTextNode(chu.slice(vt))); break }
      ra.appendChild(document.createTextNode(chu.slice(vt, i)));
      var m = tao('mark', null, chu.slice(i, i+tu_.length));
      ra.appendChild(m);
      vt = i + tu_.length;
    }
    return ra;
  }

  function tim(){
    var tu = bod(o.value);
    if(tu.length < 2){ goiY(); return }
    var thay = ds.map(function(x){
      var iTen = x._ten.indexOf(tu), iChu = x._chu.indexOf(tu);
      if(iTen < 0 && iChu < 0) return null;
      return {x:x, diem:(iTen>=0 ? 100-Math.min(iTen,60) : 0) + (iChu>=0 ? 10 : 0)};
    }).filter(Boolean).sort(function(a,b){return b.diem-a.diem}).slice(0,10);

    kq.innerHTML='';
    if(!thay.length){
      var kt = tao('p','khong-thay');
      kt.appendChild(document.createTextNode('Không tìm thấy '));
      kt.appendChild(tao('b',null,'"'+o.value.trim()+'"'));
      kt.appendChild(document.createTextNode('. Thử từ ngắn hơn, hoặc gõ tên góc nhìn.'));
      kq.appendChild(kt);
      return;
    }
    kq.appendChild(tao('div','dem-kq', thay.length + (thay.length===1?' kết quả':' kết quả')));
    thay.forEach(function(t){
      var x = t.x, a = tao('a','dong-kq');
      a.href = goc + x.duongDan;
      a.appendChild(tao('span','loai', x.loai + (x.nhan && x.nhan!==x.loai ? ' · ' + x.nhan : '')));
      var h = tao('h4'); h.appendChild(toDam(x.tieuDe, tu)); a.appendChild(h);
      var p = tao('p'); p.appendChild(toDam(doan(x, tu), tu)); a.appendChild(p);
      kq.appendChild(a);
    });
  }

  function mo(){
    lop.hidden = false;
    nut.setAttribute('aria-expanded','true');
    document.documentElement.style.overflow='hidden';
    goiY(); o.value=''; o.focus();
  }
  function dongLai(){
    lop.hidden = true;
    nut.setAttribute('aria-expanded','false');
    document.documentElement.style.overflow='';
    nut.focus();
  }

  nut.addEventListener('click', mo);
  dong.addEventListener('click', dongLai);
  lop.addEventListener('mousedown', function(ev){ if(ev.target===lop) dongLai() });
  o.addEventListener('input', tim);
  o.addEventListener('keydown', function(ev){
    if(ev.key==='Enter'){ var a = kq.querySelector('.dong-kq'); if(a){ ev.preventDefault(); location.href = a.href } }
    if(ev.key==='ArrowDown'){ var b = kq.querySelector('.dong-kq'); if(b){ ev.preventDefault(); b.focus() } }
  });
  document.addEventListener('keydown', function(ev){
    if(ev.key==='Escape' && !lop.hidden) dongLai();
  });
})();
