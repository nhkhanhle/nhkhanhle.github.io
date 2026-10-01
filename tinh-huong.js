/* Sổ tình huống cho trang Thư viện luật (thu-vien-luat.html): hiện ở phiếu đọc khi chưa tìm, chưa mở văn bản nào.
   Khánh soạn: mỗi tình huống là một câu hỏi người làm nhân sự hay gặp, câu trả lời ngắn theo cách hiểu của Khánh,
   và danh sách điều luật để người đọc mở nguyên văn. Mục có mau:true là chữ giữ chỗ do Bông Bí đặt.
   dan: vb là mã file văn bản (tên file .md trong contexts, không đuôi), dieu là số điều. */
window.TINH_HUONG = [
  {cauHoi:'Thử việc tối đa bao lâu và lương thử việc ít nhất bao nhiêu?', nhom:'Hợp đồng lao động',
   traLoi:'Chữ giữ chỗ: Khánh viết câu trả lời ngắn theo cách mình hiểu, rồi dẫn tới điều luật bên dưới để người đọc tự đối chiếu.',
   dan:[{vb:'45_2019_QH14',dieu:'25'},{vb:'45_2019_QH14',dieu:'26'}], mau:true},
  {cauHoi:'Người lao động muốn nghỉ việc thì phải báo trước bao nhiêu ngày?', nhom:'Chấm dứt hợp đồng',
   traLoi:'Chữ giữ chỗ.', dan:[{vb:'45_2019_QH14',dieu:'35'}], mau:true},
  {cauHoi:'Công ty được sa thải người lao động trong những trường hợp nào?', nhom:'Kỷ luật lao động',
   traLoi:'Chữ giữ chỗ.', dan:[{vb:'45_2019_QH14',dieu:'125'},{vb:'45_2019_QH14',dieu:'122'}], mau:true},
  {cauHoi:'Tiền làm thêm giờ tính thế nào?', nhom:'Tiền lương',
   traLoi:'Chữ giữ chỗ.', dan:[{vb:'45_2019_QH14',dieu:'98'},{vb:'145_2020_ND-CP',dieu:'55'}], mau:true}
];
/* Trợ lý AI (giai đoạn sau): điền địa chỉ máy chủ trung gian vào đây thì trang hiện ô "Hỏi trợ lý".
   Máy chủ nhận POST JSON {cauHoi, nguCanh:[{vanBan, dieu, tieuDe, than}]} và trả về JSON {traLoi}. Để trống thì ô này ẩn. */
window.TRO_LY_AI_URL = '';
