/* Thư viện luật (thu-vien-luat.html): phòng đọc phương án A, kệ "tủ cổ ba chiều", hiệu ứng B + C (Khánh chọn 01/10/2026).
   Gộp trang Tra cứu pháp luật lao động dựng 27/09: tìm, duyệt văn bản, tình huống, địa chỉ ?q=&vb= giữ nguyên.
   Tủ 9 ngăn, mọi văn bản là gáy (Khánh đổi 01/10: văn bản gốc cũng đứng gáy): cao bằng nhau, dày theo số điều, màu theo loại;
     chữ gáy là loại và số ("Nghị định 145", "Thông tư 10") hay tên luật ("Luật việc làm"), dưới là năm hiệu lực (Khánh đổi 02/10);
     rê chuột, chọn bằng bàn phím hay đang mở thì gáy xoay chính diện thành bìa, các cuốn phía sau dịt ra (PhongDoc.xepHang chia hàng).
   Bấm một cuốn: bìa bay sang quyển sổ một mặt bên phải (assets/phep-thuat-thu-vien.js); trang sổ là phiếu thư viện (bìa lớn, số hiệu,
     ngày, số điều); "Đọc thêm" cuối trang mở sổ lớn giữa màn hình: trái là mục lục điều theo chương, phải là nguyên văn điều đang chọn
     (Khánh chỉnh 01/10: sổ còn một mặt, ô tìm nằm trên sổ, bỏ đầu trang). Chưa chọn cuốn nào: sổ tình huống; đang tìm: kết quả lật 5 điều một trang.
   Dữ liệu: tra-cuu/du-lieu/muc-luc.json (tải ngay) và tra-cuu/du-lieu/<nhóm>.json (toàn văn, tải khi cần, giữ trong bộ nhớ).
   Tìm: bỏ dấu, tách từ, bỏ từ dừng; điểm = từ khớp trong tiêu đề ×6, trong thân ×1 (tối đa 5 mỗi từ), đủ mọi từ +10, nguyên cụm +8.
   Gõ "điều 35" thì mở thẳng điều 35.
   Thân điều (02/10, Khánh yêu cầu dạng cho người đọc): script dựng dữ liệu đã bỏ ký hiệu markdown, HTML và đánh dấu đầu dòng:
     ␞ hàng bảng (ô cách bằng ␟, ␝ ngay sau là hàng tiêu đề), ␛ mục Nơi nhận, ␜ chức vụ người ký, ␚ tên người ký. veThan() dựng lại thành
     đoạn, bảng kẻ ô, khối Nơi nhận và chữ ký canh phải. Địa chỉ file nhóm mang ?v=<phienBan> để trình duyệt không giữ bản cũ. */
(function(){
  var GOC=window.TRA_CUU_GOC||'', PD=window.PhongDoc||null;
  function q(s,g){return (g||document).querySelector(s)}
  function tao(tag,cls,chu){var e=document.createElement(tag);if(cls)e.className=cls;if(chu!=null)e.textContent=chu;return e}
  function boDau(s){return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase()}
  function ngayVN(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');return m?m[3]+'/'+m[2]+'/'+m[1]:''}
  /* Từ dừng: chỉ bỏ từ nối, từ hỏi; không bỏ 'bao', 'làm', 'trong' vì sau khi bỏ dấu chúng trùng với chữ trong luật (báo trước, làm thêm) */
  var DUNG={'la':1,'va':1,'cua':1,'cac':1,'co':1,'khong':1,'the':1,'nao':1,'gi':1,'duoc':1,'thi':1,'khi':1,'nhu':1,'ve':1,'cho':1,'voi':1,'tren':1,'toi':1,'da':1,'se':1,'hay':1,'hoac':1,'phai':1,'can':1,'muon':1,'sao':1,'bi':1,'moi':1,'nhat':1,'nhieu':1,'lau':1};

  var mucLuc=null, VB={}, DL={}, dangTai={}, hien={q:'',vb:''};
  var oTim=q('[data-tc-tim]'), nutTim=q('[data-tc-nut]'), trangThai=q('[data-tc-trang-thai]'), tu=q('[data-tu]'), so=q('[data-phieu]'), soTrai=q('[data-so-trai]'), phamVi=q('[data-tc-pham-vi]'), goiY=q('[data-tc-goi-y]');
  if(!oTim||!tu||!soTrai)return;
  function baoTrangThai(t){if(trangThai)trangThai.textContent=t||''}

  /* ---------- Tải dữ liệu ---------- */
  /* Mục lục luôn hỏi lại máy chủ (no-cache: trùng thì dùng bản đã có); file nhóm gắn phiên bản nên giữ trong bộ nhớ đệm được */
  function taiJSON(u,giu){return fetch(GOC+u,{cache:giu?'force-cache':'no-cache'}).then(function(r){if(!r.ok)throw new Error(u);return r.json()})}
  function taiNhom(ma){
    if(DL[ma])return Promise.resolve(DL[ma]);
    if(dangTai[ma])return dangTai[ma];
    var n=mucLuc.nhom.filter(function(x){return x.ma===ma})[0];
    dangTai[ma]=taiJSON(n.tep+(mucLuc.phienBan?'?v='+mucLuc.phienBan:''),true).then(function(d){
      Object.keys(d).forEach(function(id){d[id].forEach(function(x){x._vb=id;x._t=boDau(x.tieuDe);x._tron=chuTron(x.than);x._b=boDau(x._tron)})});
      DL[ma]=d; return d;
    });
    return dangTai[ma];
  }
  /* ---------- Thân điều: đoạn, bảng, Nơi nhận, chữ ký ---------- */
  var DB='\u241E', OB='\u241F', DT='\u241D', NN='\u241B', CV='\u241C', TK='\u241A';
  /* Chữ trơn của thân (để trích đoạn, tìm, gửi trợ lý): bỏ Nơi nhận, chữ ký; hàng bảng thành ô cách nhau bằng dấu chấm giữa */
  function chuTron(than){
    return (than||'').split('\n').filter(function(d){var c=d.charAt(0);return c!==NN&&c!==CV&&c!==TK}).map(function(d){
      return d.charAt(0)===DB?d.replace(DB,'').replace(DT,'').split(OB).filter(function(x){return x.trim()}).join(' · '):d}).join('\n');
  }
  function veThan(cha,than,tokens){
    var ds=(than||'').split('\n'), i=0;
    while(i<ds.length){
      var d=ds[i], c=d.charAt(0);
      if(!d.trim()){i++;continue}
      if(c===DB){
        var boc=tao('div','tc-bang-cuon'), bang=tao('table','tc-bang'), dau=null, than_=tao('tbody');
        boc.setAttribute('tabindex','0'); boc.setAttribute('role','region'); boc.setAttribute('aria-label','Bảng trong điều luật');
        while(i<ds.length&&ds[i].charAt(0)===DB){
          var h=ds[i].slice(1), laDau=h.charAt(0)===DT; if(laDau)h=h.slice(1);
          var tr=tao('tr');
          h.split(OB).forEach(function(o){var td=tao(laDau?'th':'td');if(o.trim().length<=2&&o.trim())td.className='tc-o-ngan';td.innerHTML=toSang(o,tokens);tr.appendChild(td)});
          if(laDau&&!than_.children.length){if(!dau){dau=tao('thead');bang.appendChild(dau)}dau.appendChild(tr)}else than_.appendChild(tr);
          i++;
        }
        bang.appendChild(than_); boc.appendChild(bang); cha.appendChild(boc); continue;
      }
      if(c===NN||c===CV||c===TK){
        var ky=tao('div','tc-ky'), nhan=null, ten=null;
        while(i<ds.length&&[NN,CV,TK].indexOf(ds[i].charAt(0))>=0){
          var x=ds[i], k=x.charAt(0), chu=x.slice(1);
          if(k===NN){if(!nhan){nhan=tao('div','tc-noi-nhan');nhan.appendChild(tao('span','tc-noi-nhan-nhan','Nơi nhận:'));nhan.appendChild(tao('ul'));ky.insertBefore(nhan,ky.firstChild)}nhan.lastChild.appendChild(tao('li',null,chu))}
          else{if(!ten){ten=tao('div','tc-ky-ten');ky.appendChild(ten)}ten.appendChild(tao('span',k===TK?'tc-ky-nguoi':null,chu))}
          i++;
        }
        cha.appendChild(ky); continue;
      }
      var p=tao('p'); p.innerHTML=toSang(d,tokens); cha.appendChild(p); i++;
    }
  }
  function cacDieu(ma){var d=DL[ma]||{},ra=[];Object.keys(d).forEach(function(id){ra=ra.concat(d[id])});return ra}

  /* ---------- Bìa và gáy ---------- */
  /* Màu gáy theo loại văn bản; --m2, --m3 là hai đầu dải màu trên bìa. Mọi gáy cao bằng nhau (CAO), chỉ dày mỏng theo số điều (Khánh đổi 02/10) */
  var CAO=176;
  var LOAI=[
    {ten:'Bộ luật, Luật',khop:['Bộ luật','Luật'],m:'#2F3B4A',m2:'#3B4859',m3:'#26303C'},
    {ten:'Văn bản hợp nhất',khop:['Văn bản hợp nhất'],m:'#4A5868',m2:'#56657A',m3:'#3A4552'},
    {ten:'Nghị định',khop:['Nghị định'],m:'#5E6B5A',m2:'#6A7866',m3:'#46523F'},
    {ten:'Nghị quyết',khop:['Nghị quyết'],m:'#6B3F43',m2:'#7A4A4F',m3:'#4F2C30'},
    {ten:'Thông tư',khop:['Thông tư'],m:'#8A5A44',m2:'#9A6650',m3:'#6B4232'},
    {ten:'Quyết định',khop:['Quyết định'],m:'#7A6A4F',m2:'#8A7A5E',m3:'#5F5240'},
    {ten:'Hướng dẫn, văn bản khác',khop:[],m:'#5F5240',m2:'#6E6150',m3:'#4A3F30'}
  ];
  function loaiCua(v){for(var i=0;i<LOAI.length-1;i++)if(LOAI[i].khop.indexOf(v.loai)>=0)return LOAI[i];return LOAI[LOAI.length-1]}
  function laGoc(v){return v.loai==='Bộ luật'||v.loai==='Luật'}
  /* Hình nét cho từng ngăn, cùng họ với hình trên bìa 6 cuốn trang chủ (khung 0 tới 100) */
  var HINH={
    'lao-dong':'<path d="M50 16v68M32 84h36M18 28h64"/><circle cx="50" cy="13" r="3"/><path d="M18 28 8 54M18 28l10 26M82 28 72 54M82 28l10 26"/><path d="M5 54h26a13 9 0 0 1-26 0zM69 54h26a13 9 0 0 1-26 0z"/>',
    'bhxh':'<path d="M50 12 20 26v22c0 20 13 36 30 42 17-6 30-22 30-42V26z"/><path d="M38 50l9 9 16-18"/>',
    'bhyt':'<path d="M50 86 22 58a16 16 0 0 1 28-20 16 16 0 0 1 28 20z"/><path d="M42 52h16M50 44v16"/>',
    'viec-lam':'<rect x="14" y="30" width="72" height="50" rx="6"/><path d="M36 30v-8h28v8M14 50h72M44 50v8h12v-8"/>',
    'cong-doan':'<circle cx="50" cy="30" r="10"/><circle cx="24" cy="40" r="8"/><circle cx="76" cy="40" r="8"/><path d="M32 80v-14a18 18 0 0 1 36 0v14M8 74v-10a14 14 0 0 1 20-12M92 74v-10a14 14 0 0 0-20-12"/>',
    'atvsld':'<path d="M18 62a32 32 0 0 1 64 0z"/><path d="M12 62h76M50 30v-8M38 70v10h24v-10"/>',
    'thue-tncn':'<circle cx="50" cy="50" r="34"/><path d="M36 64 64 36M40 40a4 4 0 1 0 0 .1M60 60a4 4 0 1 0 0 .1"/>',
    'du-lieu-ca-nhan':'<rect x="26" y="42" width="48" height="40" rx="6"/><path d="M34 42V30a16 16 0 0 1 32 0v12M50 58v10"/>',
    'di-nuoc-ngoai':'<path d="M14 66 84 34M40 54l-6 22 10-4 10-18M58 46 44 24l10 2 20 18"/><path d="M20 82h60"/>'
  };
  function hinhNgan(ma){var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 100 100');s.setAttribute('aria-hidden','true');s.innerHTML=HINH[ma]||HINH['lao-dong'];return s}
  /* Tên đầy đủ: luật thì "Bộ luật Lao động", "Luật bảo hiểm xã hội" (tên trong dữ liệu đã có chữ Luật thì không ghép thêm, sửa 02/10: trước ra "Luật Luật bảo hiểm xã hội") */
  function tenDay(v){
    if(laGoc(v)){var t=(v.ten||'').trim();return /^(bộ )?luật\b/i.test(t)?t.charAt(0).toUpperCase()+t.slice(1):(v.loai+' '+t).trim()}
    return v.ten?(v.loai?v.loai+' ':'')+v.ten:(v.tenNgan||v.soHieu);
  }
  /* Năm ghi dưới gáy: năm có hiệu lực, không có thì năm ký, không có nữa thì năm trong số hiệu */
  function namGay(v){var m=/^(\d{4})/.exec(v.hieuLuc||v.ngayKy||'');if(m)return m[1];var p=(v.soHieu||'').split('/');return /^\d{4}$/.test(p[1]||'')?p[1]:''}
  /* Một bìa (Khánh đổi 02/10): hình ngăn, tên canh giữa, năm hiệu lực dưới tên; nhãn loại, số hiệu, số điều đã bỏ. Tên quá 3 dòng thì CSS cắt bằng dấu ba chấm,
     tên đầy đủ vẫn ở nhãn đọc màn hình của gáy và dòng dưới tên trong sổ. lon: bìa trong sổ (chữ to hơn do CSS). */
  function veBia(v,lon){
    var l=loaiCua(v), b=tao('span','bia bia-luat'+(lon?' so-bia':'')); b.style.setProperty('--m2',l.m2); b.style.setProperty('--m3',l.m3);
    b.appendChild(hinhNgan(v._nhom)); b.appendChild(tao('b',null,tenDay(v)));
    if(namGay(v))b.appendChild(tao('small','hieu-luc',namGay(v)));   /* năm có hiệu lực dưới tên (Khánh thêm 02/10), cùng số với dưới gáy */
    return b;
  }
  /* Chữ trên gáy (Khánh đổi 02/10): loại viết đủ và số, "Nghị định 145", "Thông tư 10", "Văn bản hợp nhất 6";
     luật ghi tên, "Luật việc làm", "Bộ luật Lao động"; tên luật quá dài (luật sửa đổi nhiều luật) thì "Luật 97/2025".
     Văn bản thiếu loại trong dữ liệu thì đoán loại từ đuôi số hiệu (QD, TT, ND...). Tên đầy đủ nằm ở mặt bìa và nhãn đọc màn hình. */
  var LOAI_TU_SO={QD:'Quyết định',TT:'Thông tư',ND:'Nghị định',NQ:'Nghị quyết',HD:'Hướng dẫn',VBHN:'Văn bản hợp nhất'};
  function loaiGay(v){if(v.loai)return v.loai;var m=/\/([A-Z]+)-/.exec(boDau(v.soHieu||'').toUpperCase());return (m&&LOAI_TU_SO[m[1]])||'Văn bản'}
  function chuGay(v){
    var p=(v.soHieu||'').split('/'), so=p[0]||v.tenNgan||'';
    if(laGoc(v)){var t=tenDay(v);return t.length<=30?t:v.loai+' '+so+(/^\d{4}$/.test(p[1]||'')?'/'+p[1]:'')}
    return loaiGay(v)+' '+so;
  }
  var nutCua={};
  function dungTu(){
    mucLuc.nhom.forEach(function(n){
      var ngan=tao('section','pd-ngan'); ngan.setAttribute('aria-label','Ngăn '+n.ten);
      var dau=tao('div','pd-ngan-ten'); dau.appendChild(tao('h2',null,n.ten)); ngan.appendChild(dau);   /* dòng đếm văn bản, điều đã bỏ (Khánh 02/10) */
      var nuts=[];
      n.vanBan.forEach(function(v){
        var l=loaiCua(v), cg=chuGay(v), dai=cg.length>16;
        var nut=tao('button','gay'+(v.soDieu<10&&!dai?' mong':''));
        /* Dày theo căn bậc hai số điều, 30 tới 56px; chữ gáy dài xuống hai cột thì tối thiểu 40px */
        var r=Math.round(Math.min(56,Math.max(dai?40:30,22+Math.sqrt(v.soDieu||1)*2.4)));
        nut.style.setProperty('--r',r+'px'); nut.setAttribute('data-r',r);
        nut.style.setProperty('--h',CAO+'px'); nut.style.setProperty('--m',l.m);
        var khoi=tao('span','gay-khoi'), than=tao('span','gay-than');
        than.appendChild(tao('b',dai?'hai':null,cg)); than.appendChild(tao('small',null,namGay(v))); khoi.appendChild(than);
        var mat=veBia(v,false); mat.classList.add('gay-bia'); khoi.appendChild(mat); nut.appendChild(khoi);
        nut.type='button'; nut.setAttribute('aria-pressed','false');
        nut.setAttribute('aria-label',tenDay(v)+', '+(v.soHieu||'')+', '+v.soDieu+' điều');
        nut.addEventListener('click',function(){if(hien.vb===v.id&&!hien.q)boPhamVi();else moVanBan(v.id,null,nut)});
        nuts.push(nut); nutCua[v.id]=nut;
      });
      tu.appendChild(ngan);
      if(PD)PD.xepHang(ngan,nuts); else{var hang=tao('div','pd-hang');hang.style.flexWrap='wrap';nuts.forEach(function(x){hang.appendChild(x)});ngan.appendChild(hang)}
    });
    if(PD){PD.nghe(tu);PD.datDen(tu)}   /* ba thanh đèn mỗi ngăn (03/10) */
  }
  function danhDauTu(id){
    Object.keys(nutCua).forEach(function(k){nutCua[k].setAttribute('aria-pressed',k===id?'true':'false')});
    if(PD)PD.chon(id?nutCua[id]:null);
  }

  /* ---------- Trang sổ: đầu trang, lật trang, cuộn ---------- */
  /* Đầu trang sổ: nhãn, tên, nút đóng (dấu sáp đỏ "nk" bên phải đã bỏ, Khánh 02/10) */
  function dauTrang(nhan,ten,dong){
    var d=tao('div','so-dau'), t=tao('div');
    t.appendChild(tao('p','nhan',nhan)); t.appendChild(tao('h2',null,ten)); d.appendChild(t);
    if(dong){
      var ph=tao('div','so-dau-phai');
      var b=tao('button','pd-dong','×');b.type='button';b.setAttribute('aria-label','Đóng, về sổ tình huống');b.addEventListener('click',dong);ph.appendChild(b);
      d.appendChild(ph);
    }
    return d;
  }
  /* Máy tính: sổ đứng yên, hai trang tự cuộn về đầu. Điện thoại: sổ nằm trên tủ, cuộn trang web tới sổ */
  function veDauSo(){
    soTrai.scrollTop=0;
    if(getComputedStyle(so.parentNode).position==='sticky')return;
    var y=so.getBoundingClientRect().top; if(y<0||y>innerHeight*.6)window.scrollTo({top:y+window.scrollY-84,behavior:PD&&PD.giam?'auto':'smooth'});
  }
  /* Chia một danh sách thành các trang lật được. veMot(x) trả về phần tử một dòng. Trả về {noi, den(i)} */
  function lapTrang(cha,ds,moiTrang,veMot,cuon){
    var noi=tao('div','so-noi'), lat=tao('div','so-lat'), lui=tao('button',null,'‹'), toi=tao('button',null,'›'), dem=tao('span'), t=0, tong=Math.max(1,Math.ceil(ds.length/moiTrang));
    lui.type=toi.type='button'; lui.setAttribute('aria-label','Trang trước'); toi.setAttribute('aria-label','Trang sau');
    function ve(){
      noi.innerHTML=''; ds.slice(t*moiTrang,(t+1)*moiTrang).forEach(function(x){noi.appendChild(veMot(x))});
      dem.textContent='Trang '+(t+1)+' / '+tong; lui.disabled=t<=0; toi.disabled=t>=tong-1;
      if(PD)PD.vietMuc(noi);
    }
    function den(i,huong){
      i=Math.max(0,Math.min(tong-1,i)); if(i===t&&huong!==0){return}
      var cu=t; t=i;
      if(!PD||PD.giam||huong===0){ve();return}
      noi.classList.remove('lat-toi','lat-lui'); void noi.offsetWidth; noi.classList.add(i>cu?'lat-toi':'lat-lui');
      setTimeout(ve,230); setTimeout(function(){noi.classList.remove('lat-toi','lat-lui')},520);
      (cuon||soTrai).scrollTop=0;
    }
    lui.addEventListener('click',function(){den(t-1)}); toi.addEventListener('click',function(){den(t+1)});
    lat.appendChild(lui); lat.appendChild(dem); lat.appendChild(toi);
    cha.appendChild(noi); if(tong>1)cha.appendChild(lat);
    ve(); return {noi:noi,den:den,trangCua:function(i){return Math.floor(i/moiTrang)}};
  }

  /* ---------- Thẻ một điều ---------- */
  function theDieu(x,tokens,moSan){
    var v=VB[x._vb], the=tao('article','tc-dieu');
    var vb=tao('div','vb'); vb.appendChild(tao('span',null,v.tenNgan)); vb.appendChild(tao('span','sh',v.soHieu)); if(x.chuong)vb.appendChild(tao('span','ch',x.chuong)); the.appendChild(vb);
    var h=tao('h3'); if(x.so){h.appendChild(tao('span','so so-vang','Điều '+x.so+'. '))} h.appendChild(document.createTextNode(x.tieuDe||(x.so?'':'Toàn văn'))); the.appendChild(h);
    var trich=tao('p','tc-trich'); trich.innerHTML=toSang(doanTrich(x._tron,tokens),tokens); the.appendChild(trich);
    var than=tao('div','than'); veThan(than,x.than,tokens); the.appendChild(than);
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
    var nutVb=tao('button','mo-vb','Mở văn bản'); nutVb.type='button'; nutVb.addEventListener('click',function(){moVanBan(x._vb,x.so,nutCua[x._vb])}); hang.appendChild(nutVb);
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
    cau=(cau||'').trim(); hien.q=cau; ghiDiaChi();
    if(!cau){if(hien.vb)moVanBan(hien.vb);else hienMacDinh();return}
    var id=++lanTim, nhomCan=hien.vb?[VB[hien.vb]._nhom]:mucLuc.nhom.map(function(n){return n.ma});
    soTrai.innerHTML=''; soTrai.classList.remove('cho-bay');
    soTrai.appendChild(dauTrang('Kết quả tìm','“'+cau+'”',function(){oTim.value='';tim('',true);oTim.focus()}));
    var dem=tao('p','pd-muc'); soTrai.appendChild(dem);
    soTrai.appendChild(tao('p','pd-goi',hien.vb?'Đang tìm trong riêng '+VB[hien.vb].tenNgan+'.':'Tìm trong cả '+mucLuc.tongVanBan+' văn bản. “Mở văn bản” để xem cả cuốn.'));
    var vung=tao('div'); soTrai.appendChild(vung);
    veDauSo();
    var xong=0;
    function ve(){
      if(id!==lanTim)return;
      var danh=[]; nhomCan.forEach(function(ma){danh=danh.concat(cacDieu(ma))});
      if(hien.vb)danh=danh.filter(function(x){return x._vb===hien.vb});
      var kq=timTrong(danh,cau);
      dem.textContent=(kq.truc?'Mở thẳng ':'')+kq.ds.length+' điều'+(kq.ds.length>=40?' đầu':'')+(xong<nhomCan.length?' · đang đọc thêm '+(nhomCan.length-xong)+' nhóm…':'');
      vung.innerHTML='';
      if(!kq.ds.length){if(xong>=nhomCan.length)vung.appendChild(tao('p','tc-trong','Không thấy điều nào khớp. Thử từ khác ngắn hơn, ví dụ “thử việc”, “làm thêm giờ”, hoặc gõ “điều 35”.'));return}
      lapTrang(vung,kq.ds,5,function(x){return theDieu(x,kq.tokens,kq.truc)});
    }
    ve();
    nhomCan.forEach(function(ma){
      taiNhom(ma).then(function(){xong++;baoTrangThai(xong<nhomCan.length?'Đang đọc '+xong+'/'+nhomCan.length+' nhóm văn bản…':'');ve()},function(){xong++;baoTrangThai('Không tải được một nhóm văn bản.');ve()});
    });
  }

  /* ---------- Mở một văn bản: bìa bay sang sổ một mặt; "Đọc thêm" mở sổ lớn ---------- */
  function moVanBan(id,soDieu,tuNut){
    var v=VB[id]; if(!v)return;
    var moi=hien.vb!==id;
    hien.vb=id; hien.q=''; oTim.value=''; ghiDiaChi(); danhDauTu(id);
    phamVi.classList.add('hien'); q('b',phamVi).textContent=v.tenNgan; oTim.placeholder='Tìm trong '+v.tenNgan+'…';
    var nhom=mucLuc.nhom.filter(function(x){return x.ma===v._nhom})[0];
    soTrai.innerHTML='';
    soTrai.appendChild(dauTrang('Ngăn '+(nhom?nhom.ten:''),laGoc(v)?tenDay(v):v.tenNgan,boPhamVi));
    if(!laGoc(v)&&v.ten)soTrai.appendChild(tao('p','pd-goi',tenDay(v)));
    var biaLon=veBia(v,true); biaLon.classList.add('sang'); soTrai.appendChild(biaLon);
    var dl=tao('dl','pd-the');
    [['Số hiệu',v.soHieu,true],['Tên ngắn',v.tenNgan],['Ngày ký',ngayVN(v.ngayKy)],['Hiệu lực',ngayVN(v.hieuLuc),true],['Gồm',v.soDieu+' điều'+(v.chuong&&v.chuong.length>1?' · '+v.chuong.length+' chương':''),true]].forEach(function(r){if(!r[1])return;dl.appendChild(tao('dt',null,r[0]));var dd=tao('dd');if(r[2]){dd.appendChild(tao('span','so-vang',r[1]))}else dd.textContent=r[1];dl.appendChild(dd)});
    soTrai.appendChild(dl);
    var them=tao('button','pd-doc-them'); them.type='button'; them.appendChild(tao('span',null,'Đọc thêm')); var mt=tao('i',null,'→'); mt.setAttribute('aria-hidden','true'); them.appendChild(mt);
    them.setAttribute('aria-label','Đọc thêm: mở toàn văn '+v.tenNgan);
    them.addEventListener('click',function(){docVanBan(v,null,them)});
    soTrai.appendChild(them);
    veDauSo();
    /* Bìa bay từ tủ sang sổ; bay xong mới hiện bìa thật và viết chữ */
    var tuBia=tuNut&&tuNut.querySelector('.bia');
    function xongBay(){soTrai.classList.remove('cho-bay');if(PD)PD.vietMuc(dl)}
    if(PD&&moi&&tuBia){soTrai.classList.add('cho-bay');PD.baySach(tuBia,biaLon,veBia(v,false),xongBay)}else xongBay();
    /* Đến từ tình huống hay kết quả tìm có số điều: mở thẳng sổ lớn tới điều đó */
    if(soDieu)docVanBan(v,soDieu,them);
  }
  /* Sổ lớn: trái là mục lục điều theo chương, phải là nguyên văn điều đang chọn, có điều trước, điều sau, chép trích dẫn */
  function docVanBan(v,soDieu,nut){
    if(!PD)return;
    var trai=tao('div'), phai=tao('div','mo-dieu');
    trai.appendChild(dauTrang(v.loai||'Văn bản',laGoc(v)?tenDay(v):v.tenNgan,null));
    if(!laGoc(v)&&v.ten)trai.appendChild(tao('p','pd-goi',tenDay(v)));
    var dl=tao('dl','pd-the');
    [['Số hiệu',v.soHieu],['Hiệu lực',ngayVN(v.hieuLuc)],['Gồm',v.soDieu+' điều']].forEach(function(r){if(!r[1])return;dl.appendChild(tao('dt',null,r[0]));var dd=tao('dd');dd.appendChild(tao('span','so-vang',r[1]));dl.appendChild(dd)});
    trai.appendChild(dl);
    trai.appendChild(tao('p','pd-muc','Mục lục'));
    var vung=tao('div'); trai.appendChild(vung); vung.appendChild(tao('p','pd-goi','Đang mở…'));
    phai.appendChild(tao('p','pd-goi','Chọn một điều ở mục lục để đọc nguyên văn.'));
    var o=PD.moLon(trai,phai,nut);
    taiNhom(v._nhom).then(function(d){
      var ds=d[v.id]||[], nuts=[], ul=tao('ul','mo-ds'), chuongCu=null;
      vung.innerHTML='';
      ds.forEach(function(x,i){
        if(x.chuong&&x.chuong!==chuongCu){chuongCu=x.chuong;ul.appendChild(tao('li','mo-chuong',x.chuong))}
        var li=tao('li'), b=tao('button'); b.type='button';
        b.appendChild(tao('span',null,x.so?'Điều '+x.so:'')); b.appendChild(tao('span',null,x.tieuDe||(x._tron||'').slice(0,90)));
        b.addEventListener('click',function(){chon(i,true)}); li.appendChild(b); ul.appendChild(li); nuts.push(b);
      });
      vung.appendChild(ul);
      function chon(i,diToi){
        var x=ds[i]; if(!x)return;
        nuts.forEach(function(b,k){b.setAttribute('aria-current',k===i?'true':'false')});
        phai.innerHTML='';
        var ve=tao('button','mo-ve','← Mục lục'); ve.type='button'; ve.addEventListener('click',function(){PD.xemPhai(false);nuts[i].focus({preventScroll:true})}); phai.appendChild(ve);
        phai.appendChild(dauTrang(v.tenNgan+(x.chuong?' · '+x.chuong.split(' · ')[0]:''),(x.so?'Điều '+x.so+'. ':'')+(x.tieuDe||'Toàn văn'),null));
        var van=tao('div','pd-van'); veThan(van,x.than,null); phai.appendChild(van);
        var hang=tao('div','mo-dieu-hang');
        var lui=tao('button',null,'← Điều trước'); lui.type='button'; lui.disabled=i<=0; lui.addEventListener('click',function(){chon(i-1,false)});
        var chep=tao('button',null,'Chép trích dẫn'); chep.type='button'; chep.addEventListener('click',function(){chepTrich(x,v,chep)});
        var toi=tao('button',null,'Điều sau →'); toi.type='button'; toi.disabled=i>=ds.length-1; toi.addEventListener('click',function(){chon(i+1,false)});
        hang.appendChild(lui); hang.appendChild(chep); hang.appendChild(toi); phai.appendChild(hang);
        o.phai.scrollTop=0; PD.vietMuc(van);
        if(diToi)PD.xemPhai(true);
        nuts[i].scrollIntoView({block:'nearest'});
      }
      var k=0; if(soDieu){for(var j=0;j<ds.length;j++)if(ds[j].so===soDieu){k=j;break}}
      if(ds.length){chon(k,!!soDieu);if(soDieu)nuts[k].scrollIntoView({block:'center'})}
      else phai.innerHTML='<p class="pd-goi">Văn bản này chưa tách được thành điều.</p>';
    });
  }
  function chepTrich(x,v,nutChep){
    var t=(x.so?'Điều '+x.so+(x.tieuDe?' ('+x.tieuDe+') ':' '):'')+v.tenNgan+(v.soHieu&&v.tenNgan.indexOf(v.soHieu)<0?', số '+v.soHieu:'');
    var goc=nutChep.textContent, xong=function(){nutChep.textContent='Đã chép';setTimeout(function(){nutChep.textContent=goc},1800)};
    if(navigator.clipboard)navigator.clipboard.writeText(t).then(xong,function(){prompt('Chép dòng này:',t)}); else prompt('Chép dòng này:',t);
  }
  function boPhamVi(){hien.vb='';danhDauTu('');phamVi.classList.remove('hien');oTim.placeholder=oTim.getAttribute('data-goi');ghiDiaChi();if(oTim.value.trim())tim(oTim.value);else hienMacDinh()}

  /* ---------- Trạng thái mặc định: sổ tình huống ---------- */
  function hienMacDinh(){
    var th=window.TINH_HUONG||[];
    soTrai.innerHTML=''; soTrai.classList.remove('cho-bay');
    soTrai.appendChild(dauTrang('Sổ tình huống','Câu hỏi người làm nhân sự hay gặp',null));
    var dl=tao('dl','pd-the');
    [['Ngăn',mucLuc.nhom.length],['Văn bản',mucLuc.tongVanBan],['Điều',mucLuc.tongDieu],['Cập nhật',ngayVN(mucLuc.capNhat)]].forEach(function(r){dl.appendChild(tao('dt',null,r[0]));var dd=tao('dd');dd.appendChild(tao('span','so-vang',String(r[1])));dl.appendChild(dd)});
    soTrai.appendChild(dl);
    soTrai.appendChild(tao('p','pd-goi','Rê tay lên gáy để xem bìa, rút một cuốn ra để mở phiếu. Mỗi câu hỏi dưới đây dẫn tới điều luật để bạn đọc nguyên văn.'));
    if(!th.length){soTrai.appendChild(tao('p','tc-trong','Chưa có tình huống nào. Gõ từ khóa vào ô tìm để tra điều luật.'));return}
    var vung=tao('div'); soTrai.appendChild(vung);
    lapTrang(vung,th,3,function(t){
      var a=tao('article','tc-th-mot'); if(t.nhom)a.appendChild(tao('div','nhom-th',t.nhom));
      var h=tao('h3',null,t.cauHoi); if(t.mau)h.appendChild(tao('span','tv-mau','Mẫu')); a.appendChild(h);
      if(t.traLoi)a.appendChild(tao('p',null,t.traLoi));
      if(t.dan&&t.dan.length){var d=tao('div','dan');t.dan.forEach(function(x){var v=VB[x.vb];if(!v)return;var b=tao('button',null,'Điều '+x.dieu+' · '+v.tenNgan);b.type='button';b.addEventListener('click',function(){moVanBan(x.vb,x.dieu,nutCua[x.vb])});d.appendChild(b)});a.appendChild(d)}
      return a;
    });
    var ai=q('[data-tc-ai]'); if(ai&&window.TRO_LY_AI_URL){ai.classList.add('hien')}
  }

  /* ---------- Địa chỉ ---------- */
  function ghiDiaChi(){
    var p=new URLSearchParams(); if(hien.q)p.set('q',hien.q); if(hien.vb)p.set('vb',hien.vb);
    var u=location.pathname+(p.toString()?'?'+p:''); if(u!==location.pathname+location.search)history.replaceState(null,'',u);
  }

  /* ---------- Khởi động ---------- */
  if(PD)PD.dom();
  oTim.setAttribute('data-goi',oTim.placeholder);
  var hen=null;
  oTim.addEventListener('input',function(){clearTimeout(hen);hen=setTimeout(function(){tim(oTim.value,true)},280)});
  oTim.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();clearTimeout(hen);tim(oTim.value,true)}});
  nutTim.addEventListener('click',function(){clearTimeout(hen);tim(oTim.value,true)});
  q('button',phamVi).addEventListener('click',boPhamVi);
  if(goiY)[].forEach.call(goiY.querySelectorAll('button'),function(b){b.addEventListener('click',function(){oTim.value=b.textContent;tim(b.textContent,true)})});
  soTrai.innerHTML=''; soTrai.appendChild(tao('p','pd-goi','Đang mở tủ văn bản…'));
  taiJSON('tra-cuu/du-lieu/muc-luc.json').then(function(m){
    mucLuc=m;
    m.nhom.forEach(function(n){n.vanBan.forEach(function(v){v._nhom=n.ma;VB[v.id]=v})});
    var s=q('[data-tc-so]'); if(s)s.textContent=m.nhom.length+' ngăn · '+m.tongVanBan+' văn bản · '+m.tongDieu+' điều · cập nhật '+ngayVN(m.capNhat);
    dungTu();
    var p=new URLSearchParams(location.search), vb=p.get('vb'), cau=p.get('q');
    if(vb&&VB[vb]){moVanBan(vb);if(cau){oTim.value=cau;tim(cau,true)}}
    else if(cau){oTim.value=cau;tim(cau,true)}
    else hienMacDinh();
  },function(){soTrai.innerHTML='';soTrai.appendChild(tao('p','tc-trong','Không mở được dữ liệu tra cứu. Thử tải lại trang.'))});

  /* ---------- Trợ lý AI (khi có máy chủ) ---------- */
  var ai=q('[data-tc-ai]');
  if(ai&&window.TRO_LY_AI_URL){
    q('button',ai).addEventListener('click',function(){
      var cau=oTim.value.trim(); if(!cau){oTim.focus();return}
      var tl=q('p',ai); tl.textContent='Đang hỏi…';
      var danh=[]; mucLuc.nhom.forEach(function(n){danh=danh.concat(cacDieu(n.ma))});
      var kq=timTrong(danh,cau).ds.slice(0,5).map(function(x){return {vanBan:VB[x._vb].tenNgan,dieu:x.so,tieuDe:x.tieuDe,than:(x._tron||'').slice(0,3000)}});
      fetch(window.TRO_LY_AI_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cauHoi:cau,nguCanh:kq})})
        .then(function(r){return r.json()}).then(function(d){tl.textContent=d.traLoi||'Trợ lý chưa trả lời được.'},function(){tl.textContent='Không nối được với trợ lý.'});
    });
  }
})();
