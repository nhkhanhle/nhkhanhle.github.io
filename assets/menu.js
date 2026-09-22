/* Menu dùng chung cho mọi trang.
   1. Đường tắt "Tới nội dung chính": liên kết đầu tiên khi bấm Tab, bỏ qua menu. Chỉ hiện khi được chọn bằng bàn phím.
   2. Thanh điều hướng thu gọn khi rời đầu trang.
      Canh bằng một mốc 1px nằm ở độ sâu 40px: mốc khuất khỏi màn hình là thu gọn. Không nghe sự kiện cuộn. */
(function(){
  var nav=document.querySelector('.nav');
  if(!nav)return;

  var dich=document.querySelector('main')||nav.nextElementSibling;
  if(dich){
    if(!dich.id)dich.id='noi-dung-chinh';
    if(!dich.hasAttribute('tabindex'))dich.setAttribute('tabindex','-1');
    var boQua=document.createElement('a');
    boQua.className='bo-qua'; boQua.href='#'+dich.id; boQua.textContent='Tới nội dung chính';
    document.body.insertBefore(boQua,document.body.firstChild);
  }

  if(!('IntersectionObserver' in window))return;
  var moc=document.createElement('div');
  moc.setAttribute('aria-hidden','true');
  moc.style.cssText='position:absolute;top:40px;left:0;width:1px;height:1px;pointer-events:none';
  document.body.insertBefore(moc,document.body.firstChild);
  new IntersectionObserver(function(ds){nav.classList.toggle('cuon',!ds[0].isIntersecting)}).observe(moc);
})();
