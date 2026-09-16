/* Dữ liệu dùng chung cho 5 trang chủ đề.
   Thêm bài mới: chép một khối trong BAI_VIET, sửa nội dung. Bài mới nhất tự lên đầu.
   {
     chuDe:   'nghe-nhan-su' | 'tri-tue-nhan-tao' | 'tam-ly-hoc' | 'he-thong-quan-tri' | 'phap-luat-lao-dong',
     tieuDe:  'Tiêu đề bài',
     tomTat:  'Một đến hai câu tóm tắt',
     ngay:    '2026-09-15',            // năm-tháng-ngày
     phutDoc: 6,
     nhom:    'Tuyển dụng',            // không bắt buộc; từ 2 nhóm trở lên sẽ hiện nút lọc
     anh:     'anh-bai/ten-anh.jpg',   // không bắt buộc; có ảnh thì bài được ưu tiên làm bài nổi bật
     noiBat:  false,                   // true để ghim làm bài nổi bật
     duongDan:'bai-viet/ten-bai.html'
   }
*/
window.CHU_DE = {
  'nghe-nhan-su':       { stt: '01', ten: 'Nghề nhân sự' },
  'tri-tue-nhan-tao':   { stt: '02', ten: 'Trí tuệ nhân tạo' },
  'tam-ly-hoc':         { stt: '03', ten: 'Tâm lý học' },
  'he-thong-quan-tri':  { stt: '04', ten: 'Hệ thống quản trị' },
  'phap-luat-lao-dong': { stt: '05', ten: 'Pháp luật lao động' }
};

window.BAI_VIET = [
  { chuDe:"nghe-nhan-su", tieuDe:"Từ nhân sự hành chính lên HRBP: 3 việc phải bỏ, 3 việc phải học", tomTat:"Đổi tên chức danh là việc của một buổi chiều. Đổi cách làm việc mới là phần mất vài năm. Đây là ba thứ phải buông và ba thứ phải tập.", ngay:"2026-09-16", phutDoc:9, nhom:"Lộ trình nghề", anh:"anh-bai/tu-hanh-chinh-len-hrbp.svg", noiBat:true, duongDan:"bai-viet/tu-hanh-chinh-len-hrbp.html" },
  { chuDe:"nghe-nhan-su", tieuDe:"Tự chấm mình: bạn đang ở cấp độ mấy trên 5 cấp của nghề", tomTat:"Năm cấp độ của nghề nhân sự, mô tả bằng hành vi quan sát được. Đọc xong tự chấm được mình trong mười phút.", ngay:"2026-09-10", phutDoc:7, nhom:"Lộ trình nghề", anh:"anh-bai/tu-cham-cap-do-nghe.svg", duongDan:"bai-viet/tu-cham-cap-do-nghe.html" },
  { chuDe:"nghe-nhan-su", tieuDe:"Vì sao phòng nhân sự bị gọi là phòng thủ tục, và ai đang nuôi định kiến đó", tomTat:"Định kiến này không tự sinh ra. Có ba chỗ nuôi nó, và một trong ba chỗ đó nằm ngay trong phòng nhân sự.", ngay:"2026-09-04", phutDoc:6, nhom:"Góc nhìn nghề", anh:"anh-bai/phong-nhan-su-bi-goi-phong-thu-tuc.svg", duongDan:"bai-viet/phong-nhan-su-bi-goi-phong-thu-tuc.html" },
  { chuDe:"nghe-nhan-su", tieuDe:"Một ngày của người làm nhân sự ở công ty vài trăm người, kể thật, có giờ giấc", tomTat:"Không phải bản mô tả công việc. Là một ngày có giờ giấc, có việc xen ngang, có phần không ai nhìn thấy.", ngay:"2026-08-28", phutDoc:8, nhom:"Góc nhìn nghề", anh:"anh-bai/mot-ngay-cua-nguoi-lam-nhan-su.svg", duongDan:"bai-viet/mot-ngay-cua-nguoi-lam-nhan-su.html" },
  { chuDe:"nghe-nhan-su", tieuDe:"Người làm nhân sự nên đọc gì trong 12 tháng tới", tomTat:"Bốn mảng phải đọc, chia theo tỉ lệ thời gian trong năm, kèm cách đọc để thứ đọc được đem ra dùng.", ngay:"2026-08-20", phutDoc:5, nhom:"Học nghề", anh:"anh-bai/doc-gi-trong-12-thang-toi.svg", duongDan:"bai-viet/doc-gi-trong-12-thang-toi.html" }
];
