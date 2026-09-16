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
];
