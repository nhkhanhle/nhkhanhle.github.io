/* Dữ liệu trang Thư viện sách (thu-vien-sach.html, dựng bằng assets/thu-vien-sach.js): ngăn Sách, ngăn Khóa học, hộp phiếu ghi chú.
   Thêm mục mới: chép một khối {...} rồi sửa chữ, không cần đụng HTML. Mục nào có mau:true là chữ giữ chỗ do Bông Bí đặt,
   trang sẽ gắn nhãn "Mẫu" và hiện dòng báo ở đầu; Khánh thay bằng mục thật thì bỏ dòng mau:true.

   Thư viện luật không nằm ở đây: trang thu-vien-luat.html đọc tra-cuu/du-lieu/muc-luc.json (script scripts/dung-tra-cuu.py dựng từ thư mục contexts của Labor Relations)
     và sổ tình huống trong tinh-huong.js.
   Kệ sách (sach): ten, tacGia, loai ('Sách' hoặc 'Khóa học'), noi (nhà xuất bản hoặc nơi học), nam, trang (số trang, quyết định gáy dày mỏng; bỏ trống thì gáy 40px), nhom (góc nhìn hoặc chủ đề),
     viSao (vài dòng vì sao đáng đọc, xuống dòng hai lần để tách đoạn), lienKet, dangDoc (true: cuốn đang đọc, dựng mặt bìa ra ngoài kệ; chỉ một cuốn).
     Màu gáy theo nhom: sáu góc nhìn có màu riêng, nhóm khác màu cát đậm.
   Kệ ghi chú (ghiChu): tieuDe, ngay (YYYY-MM-DD), the (mảng nhãn), tomTat (một câu), noiDung (các đoạn cách nhau bằng \n\n). */
window.THU_VIEN = {
  sach: [
    {ten:'Tên sách (mẫu)', tacGia:'Tên tác giả', loai:'Sách', noi:'Nhà xuất bản', nam:'2020', trang:320, nhom:'Nghề nhân sự',
     viSao:'Vài dòng Khánh viết: cuốn này giúp gì cho người làm nhân sự, đọc lúc nào thì hợp, chương nào đáng đọc kỹ.', lienKet:'', dangDoc:true, mau:true},
    {ten:'Chứng nhận Giám đốc nhân sự', tacGia:'Học viện Quản lý PACE', loai:'Khóa học', noi:'PACE', nam:'2026', nhom:'Hệ thống quản trị',
     viSao:'Vài dòng Khánh viết: khóa học này dạy gì, Khánh mang được gì về áp dụng ngay.', lienKet:'', mau:true},
    {ten:'Tên khóa học (mẫu)', tacGia:'Nơi tổ chức', loai:'Khóa học', noi:'', nam:'', nhom:'Tâm lý học',
     viSao:'Vài dòng Khánh viết về khóa học này.', lienKet:'', mau:true}
  ],
  ghiChu: [
    {tieuDe:'Tiêu đề ghi chú (mẫu)', ngay:'2026-09-27', the:['Hợp đồng lao động','Nghề nhân sự'],
     tomTat:'Một câu tóm tắt ghi chú này nói về điều gì.',
     noiDung:'Đoạn thứ nhất của ghi chú. Ghi chú là bài ngắn kiểu sổ tay: một khái niệm, một cách làm, một điều Khánh rút ra sau một việc cụ thể.\n\nĐoạn thứ hai. Mỗi ghi chú nên đủ ngắn để đọc trong hai phút.', mau:true},
    {tieuDe:'Tiêu đề ghi chú thứ hai (mẫu)', ngay:'2026-09-20', the:['Tiền lương'],
     tomTat:'Một câu tóm tắt.',
     noiDung:'Nội dung ghi chú.', mau:true}
  ]
};
