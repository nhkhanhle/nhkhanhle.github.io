/* Hào quang sáu góc nhìn (Khánh chọn phương án A + D ngày 28/09).
   A "ánh sáng kể nghĩa": ánh sáng chạy theo ý nghĩa hình trên bìa. D "sáu kiểu hạt": mỗi cuốn một kiểu hạt sáng bay quanh.
   01 bậc thang sáng dần tới mặt trời + bụi vàng bay lên
   02 xung sáng chạy từ chân chip ra như mạch điện + đốm sáng chạy đường gấp khúc
   03 sóng tròn lan từ giao điểm, hai vòng hút lại + đom đóm lượn
   04 nút sáng lần lượt, ánh sáng chạy dọc đường nối + hạt nối chòm sao rồi tan
   05 cột sáng dọc trục cân, hai đĩa sáng luân phiên + sao băng rơi chéo
   06 bong bóng thoại nhỏ bay ra + bong bóng sáng nổi lên
   Vẽ trong hệ tọa độ của hình trên bìa (0 tới 100), khung nhìn -140 tới 240 nên hào quang rộng gấp 3.8 lần hình.
   window.HaoQuang.ve(stt 1..6, mã riêng) trả về chuỗi SVG. Kiểu dáng và chuyển động ở assets/ke-sach.css (tiền tố pq-). */
(function(){
  function R(a,b){return a+Math.random()*(b-a)}
  function n1(v){return Math.round(v*10)/10}
  function pol(r,a,cx,cy){a=a*Math.PI/180;return [n1((cx==null?50:cx)+r*Math.cos(a)),n1((cy==null?50:cy)+r*Math.sin(a))]}
  function st(o){var s='';for(var k in o)s+=k+':'+o[k]+';';return ' style="'+s+'"'}
  var TAM='<circle cx="50" cy="50" r="130" style="stroke:none"/>';   /* giữ tâm nhóm xoay đúng giữa hình */
  function defs(id){
    return '<defs><radialGradient id="h'+id+'"><stop offset="0" stop-color="#FFF6DE" stop-opacity=".75"/><stop offset=".28" stop-color="#ECD4A0" stop-opacity=".38"/><stop offset=".6" stop-color="#B6A383" stop-opacity=".12"/><stop offset="1" stop-color="#B6A383" stop-opacity="0"/></radialGradient>'
      +'<linearGradient id="c'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1CC" stop-opacity="0"/><stop offset=".35" stop-color="#FFF1CC" stop-opacity=".45"/><stop offset=".5" stop-color="#FFF6DE" stop-opacity=".8"/><stop offset=".65" stop-color="#FFF1CC" stop-opacity=".45"/><stop offset="1" stop-color="#FFF1CC" stop-opacity="0"/></linearGradient>'
      +'<linearGradient id="s'+id+'" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="34" y2="-34"><stop offset="0" stop-color="#FFF6DE"/><stop offset="1" stop-color="#FFF6DE" stop-opacity="0"/></linearGradient>'
      +'<filter id="b'+id+'" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter></defs>';
  }
  function hao(id,r,o,cls,cx,cy){return '<g opacity="'+o+'"><circle cx="'+(cx==null?50:cx)+'" cy="'+(cy==null?50:cy)+'" r="'+r+'" class="'+(cls||'pq-tho')+'" style="fill:url(#h'+id+')"/></g>'}

  /* ---------- A: ánh sáng kể nghĩa ---------- */
  var A={
    1:function(id){
      var s='';
      ['M12 84h20V68','M32 68h20V52','M52 52h20V36','M72 36h16'].forEach(function(d,i){
        var t=st({'animation-delay':(i*.35)+'s'});
        s+='<path d="'+d+'" class="pq-chop pq-net" stroke-width="6" filter="url(#b'+id+')"'+t+'/><path d="'+d+'" class="pq-chop pq-net" stroke-width="2.2"'+t+'/>';
      });
      var tia='';for(var k=0;k<12;k++){var p1=pol(10,k*30,0,0),p2=pol(k%2?16:23,k*30,0,0);tia+='<line x1="'+p1[0]+'" y1="'+p1[1]+'" x2="'+p2[0]+'" y2="'+p2[1]+'"/>'}
      s+=hao(id,32,.95,'pq-chop',80,22);
      s+='<g transform="translate(80 22)"><g class="pq-chop"'+st({'animation-delay':'1.4s'})+'><g class="pq-xoay pq-net" stroke-width="1.4"'+st({'animation-duration':'12s'})+'><circle r="25" style="stroke:none"/>'+tia+'</g></g></g>';
      return s;
    },
    2:function(id){
      var s='';
      var T=['M40 15V-5H20V-40','M60 15V-15H85V-45','M40 85V110H15V135','M60 85V100H88V135','M15 40H-10V20H-45','M15 60H-20V85H-40','M85 40H105V10H145','M85 60H115V90H145'];
      var E=[[20,-40],[85,-45],[15,135],[88,135],[-45,20],[-40,85],[145,10],[145,90]];
      T.forEach(function(d,i){
        var dl=st({'animation-delay':'-'+n1(R(0,2.2))+'s'});
        s+='<path d="'+d+'" class="pq-net" stroke-width="1" opacity=".3"/><path d="'+d+'" pathLength="1" class="pq-net pq-chay" stroke-width="2.6"'+dl+'/><circle cx="'+E[i][0]+'" cy="'+E[i][1]+'" r="2.6" class="pq-dom pq-lap"'+dl+'/>';
      });
      return s+'<rect x="42" y="42" width="16" height="16" rx="3" class="pq-dom pq-lap" filter="url(#b'+id+')"/>';
    },
    3:function(id){
      var s='';
      for(var k=0;k<3;k++)s+='<circle cx="50" cy="50" r="120" class="pq-net pq-lan" stroke-width="1.6"'+st({'animation-delay':(k*1.2)+'s'})+'/>';
      s+='<circle cx="37" cy="50" r="25" class="pq-net pq-hut-trai" stroke-width="2.4" filter="url(#b'+id+')"/><circle cx="63" cy="50" r="25" class="pq-net pq-hut-phai" stroke-width="2.4" filter="url(#b'+id+')"/>';
      return s+'<circle cx="50" cy="50" r="4.5" class="pq-dom pq-lap"/>';
    },
    4:function(id){
      var s='';
      [[50,18],[20,56],[80,56],[50,84]].forEach(function(p,i){
        var t=st({'animation-delay':(i*.55)+'s','animation-duration':'2.2s'});
        s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="22" class="pq-net pq-lan" stroke-width="1.3"'+t+'/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="7.5" class="pq-dom pq-chop" filter="url(#b'+id+')"'+t+'/>';
      });
      ['M45 24L25 50','M55 24L75 50','M27 56H73','M25 62L45 79','M75 62L55 79','M50 25V77'].forEach(function(d,i){
        s+='<path d="'+d+'" pathLength="1" class="pq-net pq-chay" stroke-width="3"'+st({'animation-delay':(i*.37)+'s','animation-duration':'1.8s'})+'/>';
      });
      return s;
    },
    5:function(id){
      var s='<g class="pq-tho-doc"><rect x="42" y="-135" width="16" height="370" style="fill:url(#c'+id+')" filter="url(#b'+id+')"/><rect x="48.6" y="-135" width="2.8" height="370" style="fill:url(#c'+id+')"/></g>';
      for(var k=0;k<4;k++)s+='<circle cx="'+n1(R(46,54))+'" cy="-110" r="1.6" class="pq-dom pq-roi"'+st({'animation-delay':(k*.65)+'s'})+'/>';
      s+='<ellipse cx="18" cy="57" rx="17" ry="8" class="pq-dom pq-can" filter="url(#b'+id+')"/><ellipse cx="82" cy="57" rx="17" ry="8" class="pq-dom pq-can" filter="url(#b'+id+')"'+st({'animation-delay':'-1.6s'})+'/>';
      return s+'<circle cx="50" cy="13" r="5" class="pq-dom pq-lap"/>';
    },
    6:function(){
      var s='', B='M-8 -5h16a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-9l-5 4v-4h-2a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z';
      [[38,24],[76,38],[30,22],[82,40],[46,26],[70,36],[36,24]].forEach(function(p){
        var t=n1(R(3,4.4));
        s+='<g transform="translate('+p[0]+' '+p[1]+')"><g class="pq-bay"'+st({'--dx':n1(R(-34,34))+'px','--dy':n1(R(-110,-150))+'px','animation-duration':t+'s','animation-delay':'-'+n1(R(0,t))+'s'})+'><path d="'+B+'" transform="scale('+n1(R(.55,1.1))+')" class="pq-net" stroke-width="1.3" style="fill:rgba(255,241,204,.18)"/></g></g>';
      });
      return s;
    }
  };

  /* ---------- D: sáu kiểu hạt ---------- */
  var D={
    1:function(){
      var s='';
      for(var k=0;k<20;k++){var t=n1(R(2.6,4.6));s+='<circle cx="'+n1(R(0,100))+'" cy="'+n1(R(55,110))+'" r="'+n1(R(1,2.4))+'" class="pq-dom pq-bay"'+st({'--dx':n1(R(-16,16))+'px','--dy':n1(R(-130,-180))+'px','animation-duration':t+'s','animation-delay':'-'+n1(R(0,t))+'s'})+'/>'}
      return s;
    },
    2:function(){
      var s='';
      for(var k=0;k<7;k++){
        var a=k*360/7+R(-12,12),p=pol(38,a),x=p[0],y=p[1],d='M'+x+' '+y,sx=Math.cos(a*Math.PI/180)>0?1:-1,sy=Math.sin(a*Math.PI/180)>0?1:-1;
        for(var j=0;j<4;j++){if(j%2===0){x=n1(x+sx*R(16,30));d+='H'+x}else{y=n1(y+sy*R(16,30));d+='V'+y}}
        var t=st({'animation-duration':n1(R(1.8,3))+'s','animation-delay':'-'+n1(R(0,3))+'s'});
        s+='<path d="'+d+'" pathLength="1" class="pq-net pq-chay" stroke-width="1.2" opacity=".5"'+t+'/><path d="'+d+'" pathLength="1" class="pq-net pq-chay-dot" stroke-width="3.6"'+t+'/>';
      }
      return s;
    },
    3:function(id){
      var s='';
      [['pq-xoay',9,52],['pq-xoay-nguoc',13,76],['pq-xoay',17,100]].forEach(function(v){
        var g='';for(var k=0;k<4;k++){var p=pol(v[2],R(0,360));g+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.4" class="pq-dom pq-lap"'+st({'animation-duration':n1(R(1.4,2.6))+'s','animation-delay':'-'+n1(R(0,2))+'s'})+'/>'}
        s+='<g class="'+v[0]+'"'+st({'animation-duration':v[1]+'s'})+'>'+TAM+'<g filter="url(#b'+id+')">'+g+'</g>'+g+'</g>';
      });
      return s;
    },
    4:function(){
      var s='', p=[];
      for(var k=0;k<7;k++)p.push(pol(R(60,108),k*51+R(-12,12)));
      s+='<path d="M'+p.map(function(q){return q.join(' ')}).join('L')+'" pathLength="1" class="pq-net pq-ve-sao" stroke-width="1.1"/>';
      p.forEach(function(q,i){s+='<g transform="translate('+q[0]+' '+q[1]+')"><polygon points="0,-5 1.2,-1.2 5,0 1.2,1.2 0,5 -1.2,1.2 -5,0 -1.2,-1.2" class="pq-dom pq-lap-sao"'+st({'animation-delay':(i*.28)+'s'})+'/></g>'});
      return s;
    },
    5:function(id){
      var s='';
      for(var k=0;k<6;k++){var t=n1(R(2.4,3.6));s+='<g transform="translate('+n1(R(70,200))+' '+n1(R(-130,-40))+')"><g class="pq-bang"'+st({'animation-duration':t+'s','animation-delay':'-'+n1(R(0,t))+'s'})+'><line x1="0" y1="0" x2="34" y2="-34" stroke="url(#s'+id+')" stroke-width="1.8" stroke-linecap="round"/><circle r="1.8" class="pq-dom"/></g></g>'}
      return s;
    },
    6:function(){
      var s='';
      for(var k=0;k<12;k++){var t=n1(R(3,4.6));s+='<circle cx="'+n1(R(5,95))+'" cy="'+n1(R(40,90))+'" r="'+n1(R(3,7.5))+'" class="pq-net pq-bay-no" stroke-width="1" style="fill:rgba(255,241,204,.12);--dx:'+n1(R(-24,24))+'px;--dy:'+n1(R(-120,-170))+'px;animation-duration:'+t+'s;animation-delay:-'+n1(R(0,t))+'s"/>'}
      return s;
    }
  };

  window.HaoQuang={ve:function(k,id){
    return '<svg viewBox="-140 -140 380 380" aria-hidden="true" focusable="false">'+defs(id)+hao(id,135,.7)+D[k](id)+A[k](id)+'</svg>';
  }};
})();
