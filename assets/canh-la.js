/* Cành lá vẽ nét vàng cát ở góc trên trái và góc dưới phải màn hình. Dùng chung cho trang chủ và trang góc nhìn.
   Mỗi cành là một đường cong bậc hai, lá mọc so le hai bên, nhỏ dần về ngọn. Kiểu dáng ở assets/nen.css. */
(function(){
  function canhLa(){
    if(document.querySelector('.canh-la'))return;
    function nhanh(x0,y0,cx,cy,x1,y1,so,dai,day){
      var s='<path d="M'+x0+' '+y0+'Q'+cx+' '+cy+' '+x1+' '+y1+'"/>';
      for(var i=1;i<=so;i++){
        var t=i/(so+1), u=1-t;
        var x=u*u*x0+2*u*t*cx+t*t*x1, y=u*u*y0+2*u*t*cy+t*t*y1;
        var dx=2*u*(cx-x0)+2*t*(x1-cx), dy=2*u*(cy-y0)+2*t*(y1-cy), g=Math.atan2(dy,dx)*180/Math.PI;
        var L=dai*(1-t*.55), w=day*(1-t*.4);
        [-1,1].forEach(function(p){
          s+='<path transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+(g+p*52).toFixed(1)+')" d="M0 0q'+(L/2).toFixed(1)+' '+(-w).toFixed(1)+' '+L.toFixed(1)+' 0q'+(-L/2).toFixed(1)+' '+w.toFixed(1)+' '+(-L).toFixed(1)+' 0"/>';
        });
      }
      return s;
    }
    var tren='<svg class="canh-la canh-tren" viewBox="0 0 260 300" aria-hidden="true">'+nhanh(-10,-10,90,110,180,270,11,54,9)+nhanh(-20,40,40,120,70,230,8,38,7)+'</svg>';
    var duoi='<svg class="canh-la canh-duoi" viewBox="0 0 260 300" aria-hidden="true">'+nhanh(270,310,170,200,90,30,11,50,9)+nhanh(280,250,220,190,180,120,6,34,7)+'</svg>';
    document.body.insertAdjacentHTML('afterbegin',tren+duoi);
  }
  canhLa();
})();
