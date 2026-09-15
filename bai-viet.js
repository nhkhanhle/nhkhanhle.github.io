/* Dữ liệu dùng chung cho 4 trang chủ đề.
   Thêm bài mới: chép một khối trong BAI_VIET, sửa nội dung. Bài mới nhất tự lên đầu.
   {
     chuDe:   'nghe-nhan-su' | 'he-thong-quan-tri' | 'tam-ly-hoc' | 'phap-luat-lao-dong',
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
  'he-thong-quan-tri':  { stt: '02', ten: 'Hệ thống quản trị' },
  'tam-ly-hoc':         { stt: '03', ten: 'Tâm lý học' },
  'phap-luat-lao-dong': { stt: '04', ten: 'Pháp luật lao động' }
};

window.BAI_VIET = [
];
