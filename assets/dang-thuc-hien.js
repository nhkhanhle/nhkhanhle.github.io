/* Trang chờ dùng chung cho các bài chưa viết xong.
   Lấy mã bài từ đường dẫn (?bai=1.3), đổ tên bài, góc nhìn, ngày đăng dự kiến vào khung trang đọc bài. */
(function(){
  function q(s){return document.querySelector(s)}
  function ngayVN(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?m[3]+'/'+m[2]+'/'+m[1]:(s||'')}
  var ma=new URLSearchParams(location.search).get('bai')||'';
  var ds=window.BAI_VIET||[], cd=window.CHU_DE||{};
  var b=null;
  for(var i=0;i<ds.length;i++){if(ds[i].ma===ma){b=ds[i];break}}
  if(!b){location.replace('../#chu-de');return}
  var g=cd[b.chuDe]||{stt:'',ten:''};

  document.title=b.tieuDe+' · Lê Nhật Khánh';
  var mo=q('meta[name="description"]'); if(mo)mo.setAttribute('content',b.tomTat||'');

  q('[data-ve-goc-nhin]').href='../chu-de/'+b.chuDe+'.html';
  q('[data-ve-goc-nhin]').textContent=g.ten;
  q('[data-nhan]').textContent='Góc nhìn '+g.stt+(b.nhom?' · '+b.nhom:'');
  q('[data-tieu-de]').textContent=b.tieuDe;
  q('[data-sapo]').textContent=b.tomTat||'';
  q('[data-ngay]').textContent='Dự kiến đăng '+ngayVN(b.ngay);
  q('[data-phut]').textContent=(b.phutDoc||'')+' phút đọc';
  q('[data-so-hinh]').textContent=g.stt;
  /* Hình bài tô màu mực navy qua mặt nạ (nền sáng, xem assets/nen.css) */
  if(b.anh){var h=q('[data-hinh]'), u='url("../'+b.anh+'")'; h.style.webkitMaskImage=u; h.style.maskImage=u}
  /* Họa tiết nền riêng của từng bài, cùng hệ nét kẻ với đồ họa của trang */
  q('[data-nen]').style.backgroundImage='url("../anh-bai/nen-'+b.ma.replace('.','-')+'.svg")';
  q('[data-quay-lai]').href='../chu-de/'+b.chuDe+'.html';
})();
