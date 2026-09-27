/* Tra cứu pháp luật lao động: tìm điều luật theo từ khóa hoặc câu hỏi, duyệt từng văn bản, tình huống thường gặp.
   Dữ liệu: tra-cuu/du-lieu/muc-luc.json (danh sách văn bản, tải ngay) và tra-cuu/du-lieu/<nhóm>.json (toàn văn, chỉ tải khi cần, giữ trong bộ nhớ).
   Tìm: bỏ dấu, tách từ, bỏ từ dừng; điểm = từ khớp trong tiêu đề điều ×6, trong thân ×1 (tối đa 5 mỗi từ), đủ mọi từ +10, khớp nguyên cụm +8.
   Gõ "điều 35" thì mở thẳng điều 35 của các văn bản (hoặc của văn bản đang duyệt). Trạng thái ghi lên địa chỉ (?q=, ?vb=) để chia sẻ được. */
(function(){
  var GOC=window.TRA_CUU_GOC||'';
  function q(s,g){return (g||document).querySelector(s)}
  function tao(tag,cls,chu){var e=document.createElement(tag);if(cls)e.className=cls;if(chu!=null)e.textContent=chu;return e}
  function boDau(s){return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase()}
  function ngayVN(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?m[3]+'/'+m[2]+'/'+m[1]:''}
  function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
  /* Từ dừng: chỉ bỏ từ nối, từ hỏi; không bỏ 'bao', 'làm', 'trong' vì sau khi bỏ dấu chúng trùng với chữ trong luật (báo trước, làm thêm) */
  var DUNG={'la':1,'va':1,'cua':1,'cac':1,'co':1,'khong':1,'the':1,'nao':1,'gi':1,'duoc':1,'thi':1,'khi':1,'nhu':1,'ve':1,'cho':1,'voi':1,'tren':1,'toi':1,'da':1,'se':1,'hay':1,'hoac':1,'phai':1,'can':1,'muon':1,'sao':1,'bi':1,'moi':1,'nhat':1,'nhieu':1,'lau':1};

  var mucLuc=null, VB={}, /* id -> văn bản (kèm nhóm) */ DL={}, /* mã nhóm -> {id:[điều]} */ dangTai={}, hien={q:'',vb:''};
  var oTim=q('[data-tc-tim]'), nutTim=q('[data-tc-nut]'), trangThai=q('[data-tc-trang-thai]'), ketQua=q('[data-tc-ket-qua]'), tu=q('[data-tc-tu]'), phamVi=q('[data-tc-pham-vi]'), goiY=q('[data-tc-goi-y]');

  function baoTrangThai(t){if(trangThai)trangThai.textContent=t||''}

  /* ---------- Tải dữ liệu ---------- */
  function taiJSON(u){return fetch(GOC+u,{cache:'force-cache'}).then(function(r){if(!r.ok)throw new Error(u);return r.json()})}
  function taiNhom(ma){
    if(DL[ma])return Promise.resolve(DL[ma]);
    if(dangTai[ma])return dangTai[ma];
    var n=mucLuc.nhom.filter(function(x){return x.ma===ma})[0];
    dangTai[ma]=taiJSON(n.tep).then(function(d){
      Object.keys(d).forEach(function(id){d[id].forEach(function(x){x._vb=id;x._t=boDau(x.tieuDe);x._b=boDau(x.than)})});
      DL[ma]=d; return d;
    });
    return dangTai[ma];
  }
  function cacDieu(ma){var d=DL[ma]||{},ra=[];Object.keys(d).forEach(function(id){ra=ra.concat(d[id])});return ra}

  /* ---------- Tủ văn bản ---------- */
  function dungTu(){
    mucLuc.nhom.forEach(function(n){
      var de=tao('details','tc-nhom'), sm=tao('summary'); sm.style.listStyle='none';
      var b=tao('button'); b.type='button'; b.appendChild(tao('span',null,n.ten)); b.appendChild(tao('small',null,n.soVanBan+' văn bản')); b.appendChild(tao('i',null,'+'));
      b.addEventListener('click',function(e){e.preventDefault();de.open=!de.open});
      sm.appendChild(b); de.appendChild(sm);
      var ul=tao('ul');
      n.vanBan.forEach(function(v){
        var li=tao('li'), a=tao('a'); a.href='?vb='+encodeURIComponent(v.id); a.setAttribute('data-vb',v.id);
        a.appendChild(tao('b',null,v.tenNgan)); a.appendChild(tao('small',null,v.soDieu+' điều'));
        a.addEventListener('click',function(e){e.preventDefault();moVanBan(v.id)});
        li.appendChild(a); ul.appendChild(li);
      });
      de.appendChild(ul); tu.appendChild(de);
    });
  }
  function danhDauTu(id){
    [].forEach.call(tu.querySelectorAll('a[data-vb]'),function(a){var co=a.getAttribute('data-vb')===id;a.setAttribute('aria-current',co?'true':'false');if(co)a.closest('details').open=true});
  }

  /* ---------- Thẻ một điều ---------- */
  function theDieu(x,tokens,moSan){
    var v=VB[x._vb], the=tao('article','tc-dieu');
    var vb=tao('div','vb'); vb.appendChild(tao('span',null,v.tenNgan)); vb.appendChild(tao('span','sh',v.soHieu)); if(x.chuong)vb.appendChild(tao('span','ch',x.chuong)); the.appendChild(vb);
    var h=tao('h3'); if(x.so){h.appendChild(tao('span','so','Điều '+x.so+'. '))} h.appendChild(document.createTextNode(x.tieuDe||(x.so?'':'Toàn văn'))); the.appendChild(h);
    var trich=tao('p','tc-trich'); trich.innerHTML=toSang(doanTrich(x.than,tokens),tokens); the.appendChild(trich);
    var than=tao('div','than'); (x.than||'').split('\n').forEach(function(p){if(p.trim()){var e=tao('p');e.innerHTML=toSang(p,tokens);than.appendChild(e)}}); the.appendChild(than);
    var hang=tao('div','hang');
    var nutDoc=tao('button',null,'Đọc cả điều'); nutDoc.type='button';
    nutDoc.addEventListener('click',function(){the.classList.toggle('mo');nutDoc.textContent=the.classList.contains('mo')?'Thu gọn':'Đọc cả điều'});
    hang.appendChild(nutDoc);
    var nutChep=tao('button',null,'Chép trích dẫn'); nutChep.type='button';
    nutChep.addEventListener('click',function(){
      var t=(x.so?'Điều '+x.so+(x.tieuDe?' ('+x.tieuDe+') ':' '):'')+v.tenNgan+(v.soHieu&&v.tenNgan.indexOf(v.soHieu)<0?', số '+v.soHieu:'');
      var xong=function(){nutChep.textContent='Đã chép';nutChep.classList.add('da-chep');setTimeout(function(){nutChep.textContent='Chép trích dẫn';nutChep.classList.remove('da-chep')},1800)};
      if(navigator.clipboard)navigator.clipboard.writeText(t).then(xong,function(){prompt('Chép dòng này:',t)}); else prompt('Chép dòng này:',t);
    });
    hang.appendChild(nutChep);
    var nutVb=tao('button',null,'Mở văn bản'); nutVb.type='button'; nutVb.addEventListener('click',function(){moVanBan(x._vb,x.so)}); hang.appendChild(nutVb);
    the.appendChild(hang);
    if(moSan){the.classList.add('mo');nutDoc.textContent='Thu gọn'}
    return the;
  }
  function doanTrich(than,tokens){
    var t=than||''; if(!t)return '';
    var b=boDau(t), vt=-1;
    (tokens||[]).some(function(k){vt=b.indexOf(k);return vt>=0});
    if(vt<0)return t.slice(0,240)+(t.length>240?'…':'');
    var d=Math.max(0,vt-100), c=Math.min(t.length,vt+180);
    return (d>0?'…':'')+t.slice(d,c).replace(/\n/g,' ')+(c<t.length?'…':'');
  }
  function toSang(chu,tokens){
    var an=chu.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    if(!tokens||!tokens.length)return an;
    /* Tô sáng theo chữ có dấu: so từng ký tự đã bỏ dấu với chữ gốc (độ dài bằng nhau vì mỗi ký tự có dấu vẫn là một ký tự sau NFC) */
    var goc=an, bd=boDau(goc); if(bd.length!==goc.length)return an;
    var vung=[];
    tokens.forEach(function(k){var i=0;while((i=bd.indexOf(k,i))>=0){vung.push([i,i+k.length]);i+=k.length}});
    if(!vung.length)return an;
    vung.sort(function(a,b){return a[0]-b[0]});
    var ra='',p=0; vung.forEach(function(r){if(r[0]<p)return;ra+=goc.slice(p,r[0])+'<mark>'+goc.slice(r[0],r[1])+'</mark>';p=r[1]}); return ra+goc.slice(p);
  }

  /* ---------- Tìm ---------- */
  function tachTu(s){
    var b=boDau(s).replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(function(w){return w.length>=2&&!DUNG[w]});
    var ra=[]; b.forEach(function(w){if(ra.indexOf(w)<0)ra.push(w)}); return ra;
  }
  function chamDiem(x,tokens,cum){
    var diem=0,du=0;
    tokens.forEach(function(k){
      var t=x._t.indexOf(k)>=0, n=0,i=0; while((i=x._b.indexOf(k,i))>=0&&n<5){n++;i+=k.length}
      if(t)diem+=6; diem+=n; if(t||n)du++;
    });
    if(!du)return 0;
    if(du===tokens.length)diem+=10;
    if(cum&&tokens.length>1&&(x._t.indexOf(cum)>=0||x._b.indexOf(cum)>=0))diem+=8;
    return diem;
  }
  function timTrong(danh,cau){
    var tokens=tachTu(cau), cum=boDau(cau).replace(/\s+/g,' ').trim();
    var mDieu=/^(?:dieu|đieu|điều)\s*(\d+[a-z]?)\b/i.exec(boDau(cau));
    if(mDieu){var ds=danh.filter(function(x){return x.so===mDieu[1]});if(ds.length)return {ds:ds,tokens:[],truc:true}}
    if(!tokens.length)return {ds:[],tokens:[]};
    var ra=[]; danh.forEach(function(x){var d=chamDiem(x,tokens,cum);if(d)ra.push([d,x])});
    ra.sort(function(a,b){return b[0]-a[0]});
    return {ds:ra.slice(0,40).map(function(r){return r[1]}),tokens:tokens};
  }
  var lanTim=0;
  function tim(cau,giuVb){
    cau=(cau||'').trim(); hien.q=cau; if(!giuVb)hien.vb=hien.vb;
    ghiDiaChi();
    if(!cau){hienMacDinh();return}
    var id=++lanTim, nhomCan=hien.vb?[VB[hien.vb]._nhom]:mucLuc.nhom.map(function(n){return n.ma});
    ketQua.innerHTML=''; var dem=tao('p','tc-dem'); ketQua.appendChild(dem); var vung=tao('div'); ketQua.appendChild(vung);
    var xong=0;
    function ve(){
      if(id!==lanTim)return;
      var danh=[]; nhomCan.forEach(function(ma){danh=danh.concat(cacDieu(ma))});
      if(hien.vb)danh=danh.filter(function(x){return x._vb===hien.vb});
      var kq=timTrong(danh,cau);
      vung.innerHTML='';
      dem.textContent=(kq.truc?'Mở thẳng ':'')+kq.ds.length+' điều'+(kq.ds.length>=40?' đầu':'')+(hien.vb?' trong '+VB[hien.vb].tenNgan:'')+(xong<nhomCan.length?' · đang đọc thêm '+(nhomCan.length-xong)+' nhóm…':'');
      if(!kq.ds.length&&xong>=nhomCan.length){vung.appendChild(tao('p','tc-trong','Không thấy điều nào khớp. Thử từ khác ngắn hơn, ví dụ “thử việc”, “làm thêm giờ”, hoặc gõ “điều 35”.'));return}
      kq.ds.forEach(function(x){vung.appendChild(theDieu(x,kq.tokens,kq.truc))});
    }
    ve();
    nhomCan.forEach(function(ma){
      taiNhom(ma).then(function(){xong++;baoTrangThai(xong<nhomCan.length?'Đang đọc '+xong+'/'+nhomCan.length+' nhóm văn bản…':'');ve()},function(){xong++;baoTrangThai('Không tải được một nhóm văn bản.');ve()});
    });
  }

  /* ---------- Duyệt một văn bản ---------- */
  function moVanBan(id,soDieu){
    var v=VB[id]; if(!v)return;
    hien.vb=id; hien.q=''; oTim.value=''; ghiDiaChi(); danhDauTu(id);
    phamVi.classList.add('hien'); q('b',phamVi).textContent=v.tenNgan; oTim.placeholder='Tìm trong '+v.tenNgan+'…';
    ketQua.innerHTML=''; var dau=tao('div','tc-vb-dau');
    dau.appendChild(tao('h2',null,(v.loai?v.loai+' ':'')+(v.ten||v.tenNgan)));
    var meta=tao('div','meta'); meta.appendChild(tao('span',null,'Số '+v.soHieu)); if(v.ngayKy)meta.appendChild(tao('span',null,'Ký '+ngayVN(v.ngayKy))); if(v.hieuLuc)meta.appendChild(tao('span',null,'Hiệu lực '+ngayVN(v.hieuLuc))); meta.appendChild(tao('span',null,v.soDieu+' điều')); dau.appendChild(meta);
    dau.appendChild(tao('p',null,'Bấm một điều để đọc nguyên văn. Gõ vào ô tìm phía trên để tìm trong riêng văn bản này.'));
    ketQua.appendChild(dau);
    var vung=tao('div'); ketQua.appendChild(vung); vung.appendChild(tao('p','tc-dem','Đang mở…'));
    taiNhom(v._nhom).then(function(d){
      var ds=d[id]||[]; vung.innerHTML='';
      if(v.chuong&&v.chuong.length>1){var ol=tao('ul','tc-chuong');v.chuong.forEach(function(c,i){var b=tao('button',null,c.split(' · ')[0]);b.type='button';b.title=c;b.addEventListener('click',function(){var e=vung.querySelector('[data-chuong="'+i+'"]');if(e)e.scrollIntoView({behavior:'smooth',block:'start'})});ol.appendChild(b)});vung.appendChild(ol)}
      var chuongCu=null, k=0;
      ds.forEach(function(x){
        if(x.chuong&&x.chuong!==chuongCu){chuongCu=x.chuong;var h=tao('h3','tc-muc-chuong',x.chuong);h.setAttribute('data-chuong',v.chuong.indexOf(x.chuong));vung.appendChild(h)}
        var dong=tao('button','tc-dong'); dong.type='button'; dong.appendChild(tao('span','so',x.so?'Điều '+x.so:'')); dong.appendChild(tao('span',null,x.tieuDe||(x.than||'').slice(0,90))); dong.appendChild(tao('i',null,'+'));
        var the=null;
        dong.addEventListener('click',function(){
          if(the){the.remove();the=null;dong.querySelector('i').textContent='+';return}
          the=theDieu(x,[],true); the.querySelector('.hang button:last-child').remove(); dong.insertAdjacentElement('afterend',the); dong.querySelector('i').textContent='−';
        });
        vung.appendChild(dong);
        if(soDieu&&x.so===soDieu){dong.click();setTimeout(function(){dong.scrollIntoView({behavior:'smooth',block:'start'})},50)}
      });
      if(!soDieu)window.scrollTo({top:ketQua.getBoundingClientRect().top+window.scrollY-90,behavior:'smooth'});
    });
  }
  function boPhamVi(){hien.vb='';danhDauTu('');phamVi.classList.remove('hien');oTim.placeholder=oTim.getAttribute('data-goi');ghiDiaChi();if(oTim.value.trim())tim(oTim.value);else hienMacDinh()}

  /* ---------- Trạng thái mặc định: tình huống thường gặp ---------- */
  function hienMacDinh(){
    ketQua.innerHTML='';
    var th=window.TINH_HUONG||[];
    ketQua.appendChild(tao('p','tc-dem','Tình huống thường gặp'));
    if(!th.length){ketQua.appendChild(tao('p','tc-trong','Chưa có tình huống nào. Gõ từ khóa vào ô tìm để tra điều luật.'));return}
    var luoi=tao('div','tc-th');
    th.forEach(function(t){
      var a=tao('article'); if(t.nhom)a.appendChild(tao('div','nhom-th',t.nhom));
      var h=tao('h3',null,t.cauHoi); if(t.mau)h.appendChild(tao('span','tv-mau','Mẫu')); a.appendChild(h);
      if(t.traLoi)a.appendChild(tao('p',null,t.traLoi));
      if(t.dan&&t.dan.length){var d=tao('div','dan');t.dan.forEach(function(x){var v=VB[x.vb];if(!v)return;var b=tao('button',null,'Điều '+x.dieu+' · '+v.tenNgan);b.type='button';b.addEventListener('click',function(){moVanBan(x.vb,x.dieu)});d.appendChild(b)});a.appendChild(d)}
      luoi.appendChild(a);
    });
    ketQua.appendChild(luoi);
    var ai=q('[data-tc-ai]'); if(ai&&window.TRO_LY_AI_URL){ai.classList.add('hien')}
  }

  /* ---------- Địa chỉ ---------- */
  function ghiDiaChi(){
    var p=new URLSearchParams(); if(hien.q)p.set('q',hien.q); if(hien.vb)p.set('vb',hien.vb);
    var u=location.pathname+(p.toString()?'?'+p:''); if(u!==location.pathname+location.search)history.replaceState(null,'',u);
  }

  /* ---------- Khởi động ---------- */
  oTim.setAttribute('data-goi',oTim.placeholder);
  var hen=null;
  oTim.addEventListener('input',function(){clearTimeout(hen);hen=setTimeout(function(){tim(oTim.value,true)},280)});
  oTim.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();clearTimeout(hen);tim(oTim.value,true)}});
  nutTim.addEventListener('click',function(){clearTimeout(hen);tim(oTim.value,true)});
  q('button',phamVi).addEventListener('click',boPhamVi);
  if(goiY)[].forEach.call(goiY.querySelectorAll('button'),function(b){b.addEventListener('click',function(){oTim.value=b.textContent;tim(b.textContent,true)})});
  if(window.matchMedia('(max-width:900px)').matches)tu.open=false;  /* điện thoại: tủ gập lại, kết quả lên trước */
  ketQua.innerHTML=''; ketQua.appendChild(tao('p','tc-dem','Đang mở tủ văn bản…'));
  taiJSON('tra-cuu/du-lieu/muc-luc.json').then(function(m){
    mucLuc=m;
    m.nhom.forEach(function(n){n.vanBan.forEach(function(v){v._nhom=n.ma;VB[v.id]=v})});
    var so=q('[data-tc-so]'); if(so)so.textContent=m.tongVanBan+' văn bản · '+m.tongDieu+' điều · cập nhật '+ngayVN(m.capNhat);
    dungTu();
    var p=new URLSearchParams(location.search), vb=p.get('vb'), cau=p.get('q');
    if(vb&&VB[vb]){moVanBan(vb);if(cau){oTim.value=cau;tim(cau,true)}}
    else if(cau){oTim.value=cau;tim(cau,true)}
    else hienMacDinh();
  },function(){ketQua.innerHTML='';ketQua.appendChild(tao('p','tc-trong','Không mở được dữ liệu tra cứu. Thử tải lại trang.'))});

  /* ---------- Trợ lý AI (khi có máy chủ) ---------- */
  var ai=q('[data-tc-ai]');
  if(ai&&window.TRO_LY_AI_URL){
    q('button',ai).addEventListener('click',function(){
      var cau=oTim.value.trim(); if(!cau){oTim.focus();return}
      var tl=q('p',ai); tl.textContent='Đang hỏi…';
      var danh=[]; mucLuc.nhom.forEach(function(n){danh=danh.concat(cacDieu(n.ma))});
      var kq=timTrong(danh,cau).ds.slice(0,5).map(function(x){return {vanBan:VB[x._vb].tenNgan,dieu:x.so,tieuDe:x.tieuDe,than:x.than.slice(0,3000)}});
      fetch(window.TRO_LY_AI_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cauHoi:cau,nguCanh:kq})})
        .then(function(r){return r.json()}).then(function(d){tl.textContent=d.traLoi||'Trợ lý chưa trả lời được.'},function(){tl.textContent='Không nối được với trợ lý.'});
    });
  }
})();
