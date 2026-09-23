/* Dữ liệu 26 bài của kế hoạch nội dung 6 tháng (bản kế hoạch v3 ngày 22/09/2026).
   Bài chỉ hiện trên trang từ ngày ghi ở "ngay" trở đi, trước đó tự ẩn (xử lý trong assets/chu-de.js).
   Khánh gửi bài thật thì dựng trang trong bai-viet/, điền đường dẫn vào "duongDan" và vẽ ảnh icon vào "anh-bai/".
   {
     chuDe:   khóa trong CHU_DE bên dưới,
     tieuDe:  'Tiêu đề bài',
     tomTat:  'Một đến hai câu tóm tắt',
     ngay:    '2026-10-06',            // ngày đăng theo lịch biên tập, năm-tháng-ngày
     phutDoc: 7,                       // ước từ độ dài mục tiêu, 200 chữ một phút
     nhom:    'Hướng dẫn',             // từ 2 nhóm trở lên sẽ hiện nút lọc
     anh:     'anh-bai/ten-anh.svg',   // không bắt buộc
     noiBat:  false,                   // true để ghim làm bài nổi bật
     duongDan:'bai-viet/ten-bai.html'  // khi chưa có bài thật thì trỏ về bai-viet/dang-thuc-hien.html?bai=<mã>
   }
*/
window.CHU_DE = {
  'nghe-nhan-su':       { stt: '01', ten: 'Nghề nhân sự' },
  'tri-tue-nhan-tao':   { stt: '02', ten: 'Trí tuệ nhân tạo' },
  'tam-ly-hoc':         { stt: '03', ten: 'Tâm lý học' },
  'he-thong-quan-tri':  { stt: '04', ten: 'Hệ thống quản trị' },
  'phap-luat-lao-dong': { stt: '05', ten: 'Pháp luật lao động' },
  'chuyen-cong-so':     { stt: '06', ten: 'Chuyện công sở' }
};

window.BAI_VIET = [
  { /* bài 1.3 · tuần 1 · Bài quan điểm */
    ma:      '1.3',
    chuDe:   'nghe-nhan-su',
    tieuDe:  'Vì sao phòng nhân sự bị gọi là phòng thủ tục, và ai đang nuôi định kiến đó',
    tomTat:  'Định kiến này có phần đúng, và phần đúng đó do chính người làm nghề nuôi lớn.',
    ngay:    '2026-10-06',
    phutDoc: 7,
    nhom:    'Phân tích',
    anh:     'anh-bai/bai-1-3.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=1.3'
  },
  { /* bài 2.2 · tuần 2 · Bài hướng dẫn có trích luật */
    ma:      '2.2',
    chuDe:   'tri-tue-nhan-tao',
    tieuDe:  'Bạn vừa đưa dữ liệu nhân sự vào công cụ AI. Luật bảo vệ dữ liệu cá nhân nói gì về việc đó',
    tomTat:  'Phần lớn người làm nghề đang vi phạm mà không biết, vì chưa ai đọc kỹ chỗ nào là dữ liệu cá nhân nhạy cảm.',
    ngay:    '2026-10-13',
    phutDoc: 10,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-2-2.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=2.2'
  },
  { /* bài 3.2 · tuần 3 · Bài phân tích có dẫn nghiên cứu */
    ma:      '3.2',
    chuDe:   'tam-ly-hoc',
    tieuDe:  'Vì sao người giỏi nghỉ việc sau khi vừa được tăng lương',
    tomTat:  'Tiền chữa được vấn đề tiền. Người giỏi nghỉ vì thứ khác, và họ không nói thật trong buổi phỏng vấn nghỉ việc.',
    ngay:    '2026-10-20',
    phutDoc: 8,
    nhom:    'Phân tích',
    anh:     'anh-bai/bai-3-2.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=3.2'
  },
  { /* bài 6.2 · tuần 4 · Bài kể chuyện */
    ma:      '6.2',
    chuDe:   'chuyen-cong-so',
    tieuDe:  'Cuộc họp ai cũng gật, ra khỏi phòng là mỗi người làm một kiểu',
    tomTat:  'Cái gật đầu trong phòng họp không phải là đồng ý. Nó là cách người ta kết thúc cuộc họp sớm.',
    ngay:    '2026-10-27',
    phutDoc: 5,
    nhom:    'Kể chuyện',
    anh:     'anh-bai/bai-6-2.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=6.2'
  },
  { /* bài 5.4 · tuần 5 · Bài công cụ, có các bước */
    ma:      '5.4',
    chuDe:   'phap-luat-lao-dong',
    tieuDe:  'Văn bản bạn đang trích còn hiệu lực không: cách tự rà trong 10 phút',
    tomTat:  'Bài viết trên mạng chép lại điều khoản đã chết. Tự rà được thì không cần tin ai.',
    ngay:    '2026-11-03',
    phutDoc: 7,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-5-4.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=5.4'
  },
  { /* bài 4.2 · tuần 6 · Bài hướng dẫn có mẫu */
    ma:      '4.2',
    chuDe:   'he-thong-quan-tri',
    tieuDe:  'KPI vị trí viết sao để người bị đo cũng thấy công bằng',
    tomTat:  'KPI mất giá trị ngay khi người bị đo thấy mình không kiểm soát được con số đó.',
    ngay:    '2026-11-10',
    phutDoc: 8,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-4-2.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=4.2'
  },
  { /* bài 1.1 · tuần 7 · Bài hướng dẫn nghề */
    ma:      '1.1',
    chuDe:   'nghe-nhan-su',
    tieuDe:  'Từ nhân sự hành chính lên HRBP: 3 việc phải bỏ, 3 việc phải học',
    tomTat:  'Lên HRBP không phải học thêm, mà bỏ bớt. Phần bỏ mới là phần khó.',
    ngay:    '2026-11-17',
    phutDoc: 8,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-1-1.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=1.1'
  },
  { /* bài 2.1 · tuần 8 · Bài phân tích */
    ma:      '2.1',
    chuDe:   'tri-tue-nhan-tao',
    tieuDe:  'Sàng lọc hồ sơ bằng AI: nó học thiên kiến của hội đồng nhanh hơn bạn tưởng',
    tomTat:  'Máy không sinh ra thiên kiến. Nó học từ những lần hội đồng chấm điểm trước đó, rồi chạy nhanh hơn người.',
    ngay:    '2026-11-24',
    phutDoc: 8,
    nhom:    'Phân tích',
    anh:     'anh-bai/bai-2-1.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=2.1'
  },
  { /* bài 3.1 · tuần 9 · Bài phân tích có dẫn nghiên cứu */
    ma:      '3.1',
    chuDe:   'tam-ly-hoc',
    tieuDe:  'Thiên kiến trong phỏng vấn: 5 lỗi chấm điểm mà hội đồng nào cũng mắc',
    tomTat:  'Hội đồng nào cũng tin mình khách quan. Năm lỗi này xảy ra trước khi ứng viên kịp nói câu thứ hai.',
    ngay:    '2026-12-01',
    phutDoc: 8,
    nhom:    'Phân tích',
    anh:     'anh-bai/bai-3-1.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=3.1'
  },
  { /* bài 6.4 · tuần 10 · Bài kể chuyện có lập trường */
    ma:      '6.4',
    chuDe:   'chuyen-cong-so',
    tieuDe:  'Khi sếp yêu cầu bạn viết một điều không đúng sự thật',
    tomTat:  'Từ chối không phải là chống lại sếp. Nhưng phải trả giá, và nên biết giá đó trước.',
    ngay:    '2026-12-08',
    phutDoc: 6,
    nhom:    'Kể chuyện',
    anh:     'anh-bai/bai-6-4.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=6.4'
  },
  { /* bài 5.2 · tuần 11 · Bài trích luật có các bước */
    ma:      '5.2',
    chuDe:   'phap-luat-lao-dong',
    tieuDe:  'Sa thải đúng luật: 6 bước, và 4 chỗ doanh nghiệp hay chết',
    tomTat:  'Sa thải sai một bước thủ tục thì cả quyết định đổ, dù lý do có đúng đến đâu.',
    ngay:    '2026-12-15',
    phutDoc: 11,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-5-2.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=5.2'
  },
  { /* bài 4.5 · tuần 12 · Bài quan điểm có phương pháp */
    ma:      '4.5',
    chuDe:   'he-thong-quan-tri',
    tieuDe:  'Sửa chỉ số giữa năm mà không làm sập niềm tin vào hệ thống',
    tomTat:  'Chỉ số sai mà giữ nguyên còn hại hơn sửa. Vấn đề nằm ở cách sửa.',
    ngay:    '2026-12-22',
    phutDoc: 7,
    nhom:    'Phân tích',
    anh:     'anh-bai/bai-4-5.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=4.5'
  },
  { /* bài 1.4 · tuần 13 · Bài kể chuyện có giờ giấc */
    ma:      '1.4',
    chuDe:   'nghe-nhan-su',
    tieuDe:  'Một ngày của người làm nhân sự ở công ty vài trăm người, kể thật, có giờ giấc',
    tomTat:  'Kể thật một ngày, có giờ giấc, để người ngoài thôi đoán và người trong nghề thấy mình trong đó.',
    ngay:    '2026-12-29',
    phutDoc: 6,
    nhom:    'Kể chuyện',
    anh:     'anh-bai/bai-1-4.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=1.4'
  },
  { /* bài 2.3 · tuần 14 · Bài quy trình có mẫu prompt */
    ma:      '2.3',
    chuDe:   'tri-tue-nhan-tao',
    tieuDe:  'Viết mô tả công việc, khung năng lực, KPI bằng AI: quy trình 4 bước tôi đang dùng thật',
    tomTat:  'AI viết được bản nháp, nhưng phần quyết định chất lượng nằm ở dữ liệu bạn đưa vào và chỗ bạn sửa tay.',
    ngay:    '2027-01-05',
    phutDoc: 8,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-2-3.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=2.3'
  },
  { /* bài 3.3 · tuần 15 · Bài kịch bản hội thoại */
    ma:      '3.3',
    chuDe:   'tam-ly-hoc',
    tieuDe:  'Nói chuyện với nhân viên đang tụt tinh thần: 4 câu nên hỏi, 3 câu nên tránh',
    tomTat:  'Câu hỏi sai làm người ta đóng cửa. Bốn câu này mở cửa mà không ép.',
    ngay:    '2027-01-12',
    phutDoc: 7,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-3-3.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=3.3'
  },
  { /* bài 5.3 · tuần 16 · Bài trích luật có bảng */
    ma:      '5.3',
    chuDe:   'phap-luat-lao-dong',
    tieuDe:  'Khoản nào tính đóng bảo hiểm xã hội, khoản nào không',
    tomTat:  'Sai một khoản trong bảng lương thì sai suốt cả năm, và truy thu tính ngược lại từ đầu.',
    ngay:    '2027-01-19',
    phutDoc: 10,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-5-3.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=5.3'
  },
  { /* bài 6.6 · tuần 17 · Bài chiêm nghiệm */
    ma:      '6.6',
    chuDe:   'chuyen-cong-so',
    tieuDe:  'Đi làm vì tiền thì có gì sai',
    tomTat:  'Câu hỏi này bị trả lời sai ở cả hai phía: người xấu hổ vì nói thật, và người lên giọng vì nghe câu đó.',
    ngay:    '2027-01-26',
    phutDoc: 5,
    nhom:    'Kể chuyện',
    anh:     'anh-bai/bai-6-6.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=6.6'
  },
  { /* bài 4.4 · tuần 18 · Bài hướng dẫn có mẫu */
    ma:      '4.4',
    chuDe:   'he-thong-quan-tri',
    tieuDe:  'Khung năng lực dùng được: 5 cấp độ, hành vi quan sát được, bỏ hết tính từ',
    tomTat:  'Khung năng lực chết vì tính từ. Thay hết bằng hành vi quan sát được thì nó sống.',
    ngay:    '2027-02-02',
    phutDoc: 10,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-4-4.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=4.4'
  },
  { /* bài 1.2 · tuần 19 · Bài công cụ tự chấm */
    ma:      '1.2',
    chuDe:   'nghe-nhan-su',
    tieuDe:  'Tự chấm mình: bạn đang ở cấp độ mấy trên 5 cấp của nghề',
    tomTat:  'Biết mình ở đâu thì mới biết bước kế tiếp. Bảng tự chấm này không để xếp hạng ai.',
    ngay:    '2027-02-16',
    phutDoc: 8,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-1-2.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=1.2'
  },
  { /* bài 2.4 · tuần 20 · Bài lập trường */
    ma:      '2.4',
    chuDe:   'tri-tue-nhan-tao',
    tieuDe:  'Ba việc trong nghề nhân sự tôi không giao cho AI, và lý do',
    tomTat:  'Chỗ dừng tay quan trọng hơn chỗ tăng tốc. Ba việc này tôi giữ cho người.',
    ngay:    '2027-02-23',
    phutDoc: 6,
    nhom:    'Phân tích',
    anh:     'anh-bai/bai-2-4.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=2.4'
  },
  { /* bài 3.4 · tuần 21 · Bài khái niệm */
    ma:      '3.4',
    chuDe:   'tam-ly-hoc',
    tieuDe:  'Gắn bó chưa chắc gắn kết, nhưng gắn kết thì sẽ gắn bó',
    tomTat:  'Hai chữ này bị dùng lẫn suốt, và chính sách giữ người sai từ chỗ dùng lẫn đó.',
    ngay:    '2027-03-02',
    phutDoc: 7,
    nhom:    'Phân tích',
    anh:     'anh-bai/bai-3-4.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=3.4'
  },
  { /* bài 5.1 · tuần 22 · Bài trích luật có các bước */
    ma:      '5.1',
    chuDe:   'phap-luat-lao-dong',
    tieuDe:  'Hợp đồng lao động điện tử: làm đúng ngay từ chữ ký đầu tiên',
    tomTat:  'Hợp đồng điện tử có giá trị như bản giấy khi làm đúng. Chỗ sai thường nằm ở chữ ký, không ở nội dung.',
    ngay:    '2027-03-09',
    phutDoc: 10,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-5-1.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=5.1'
  },
  { /* bài 6.1 · tuần 23 · Bài kể chuyện */
    ma:      '6.1',
    chuDe:   'chuyen-cong-so',
    tieuDe:  'Người đồng nghiệp tôi từng xét nét, và điều tôi biết được sau khi họ nghỉ',
    tomTat:  'Cái nhìn của mình về một người thường nói nhiều về mình hơn về họ.',
    ngay:    '2027-03-16',
    phutDoc: 6,
    nhom:    'Kể chuyện',
    anh:     'anh-bai/bai-6-1.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=6.1'
  },
  { /* bài 4.1 · tuần 24 · Bài kể chuyện nghề có phương pháp */
    ma:      '4.1',
    chuDe:   'he-thong-quan-tri',
    tieuDe:  'Cascade BSC xuống từng phòng ban: những gì tôi làm sai ở lần đầu',
    tomTat:  'Lần đầu tôi cascade BSC, tôi chia đều chỉ tiêu cho các phòng. Đó là sai lầm gốc.',
    ngay:    '2027-03-23',
    phutDoc: 8,
    nhom:    'Kể chuyện',
    anh:     'anh-bai/bai-4-1.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=4.1'
  },
  { /* bài 2.5 · tuần 25 · Bài thực hành có nhật ký */
    ma:      '2.5',
    chuDe:   'tri-tue-nhan-tao',
    tieuDe:  'Dựng trợ lý hỏi đáp chính sách nội bộ trong một tuần: nó sai ở đâu và sửa thế nào',
    tomTat:  'Dựng thì nhanh. Phần khó là lúc nó trả lời sai chính sách công ty trước mặt nhân viên.',
    ngay:    '2027-03-30',
    phutDoc: 10,
    nhom:    'Kể chuyện',
    anh:     'anh-bai/bai-2-5.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=2.5'
  },
  { /* bài 5.5 · tuần 26 · Bài trích luật có danh mục */
    ma:      '5.5',
    chuDe:   'phap-luat-lao-dong',
    tieuDe:  'Nội quy lao động: những điều bắt buộc phải có, và những điều viết vào là sai',
    tomTat:  'Nội quy chưa đăng ký thì nhiều điều khoản trong đó không dùng được để xử lý kỷ luật.',
    ngay:    '2027-04-06',
    phutDoc: 10,
    nhom:    'Hướng dẫn',
    anh:     'anh-bai/bai-5-5.svg',
    noiBat:  false,
    duongDan:'bai-viet/dang-thuc-hien.html?bai=5.5'
  }
];
