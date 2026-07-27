---
title: "Tạo prompt cho video AI dài mà không vỡ mạch hình ảnh"
description: "Công cụ mới trong mục Ứng dụng: nhập ý tưởng, nhận về một bộ 'Bible' bất biến cùng ma trận hàng trăm prompt shot nhất quán cho Veo, Kling, Runway hay Sora — kèm gói tiêu đề, mô tả SEO và chapters cho YouTube. Dựng video 5 đến 20 phút không lo mỗi cảnh một kiểu. Tài khoản mới được tặng 50 token."
pubDate: 2026-07-27
updatedDate: 2026-07-27
category: "ung-dung"
tags: ["video AI", "Veo", "prompt engineering", "YouTube", "sáng tạo nội dung"]
heroImage: "/images/posts/hero-tao-prompt-video-ai-dai-bang-ai.webp"
heroAlt: "Bảng dựng cảnh phim với nhiều khung hình nhất quán và biểu tượng ma trận shot"
faq:
  - q: "Công cụ này có tự tạo ra video không?"
    a: "Không. Nó tạo ra prompt — cụ thể là một bộ 'Bible' bất biến (bối cảnh, phong cách hình, danh sách loại trừ, nhân vật cố định) cùng hàng trăm câu prompt cho từng shot đã đánh số. Việc dựng video bạn vẫn làm bằng engine bạn chọn: Veo, Kling, Runway hay Sora. Nói cách khác, nó lo phần khó nhất và tốn công nhất — giữ cho mọi cảnh nhất quán — còn khâu render là của bạn và công cụ video kia."
  - q: "Vì sao lại cần một bộ 'Bible' riêng thay vì cứ viết prompt từng cảnh?"
    a: "Vì đó chính là chỗ video AI dài hay vỡ. Bạn viết tay hai chục prompt rời, mỗi cái tả lại ánh sáng, tông màu, gương mặt nhân vật một kiểu, thế là qua mỗi cảnh nhân vật lại đổi mặt, màu phim nhảy loạn. Bible khóa những thứ phải giữ nguyên vào một chỗ, rồi mọi shot đều tham chiếu về nó. Nhờ vậy một video mười lăm phút vẫn nhìn như do một đạo diễn quay, không phải ghép từ ba mươi clip lạ nhau."
  - q: "Ma trận shot là gì, và vì sao không để AI tự chọn số cảnh?"
    a: "Ma trận là bảng chia video thành N phân đoạn, mỗi đoạn M cảnh, mỗi cảnh K shot — cộng lại ra tổng số shot khớp với độ dài bạn muốn. Con số này do công cụ tính bằng công thức, không phải do mô hình ngôn ngữ đoán, để độ dài ra đúng và tỉ lệ khung hình (cận cảnh, toàn cảnh, tĩnh) cân đối. Sau đó nó sinh prompt theo từng batch nhỏ để không bị cắt cụt giữa chừng."
  - q: "Prompt sinh ra dùng thẳng cho Veo hay Sora được luôn không?"
    a: "Được, với lưu ý thực tế. Phần phong cách và loại trừ được giữ bằng tiếng Anh vì các engine video đọc tiếng Anh chuẩn nhất, và biến kiểu [STYLE_REF] được công cụ tự bung đầy đủ ở phía máy chủ nên bạn không dán nhầm dấu ngoặc vào engine. Nhưng mỗi engine có khẩu vị riêng — bạn vẫn nên render thử vài shot đầu, chỉnh lại một hai chữ cho hợp engine mình dùng rồi mới chạy cả loạt."
  - q: "Mỗi lần tạo tốn bao nhiêu token?"
    a: "Tùy độ dài video: 5 phút 40 token, 10 phút 70, 15 phút 100, 20 phút 130. Token trừ một lần duy nhất lúc dựng Bible; sau đó các batch prompt shot sinh miễn phí trong ba tiếng. Tài khoản mới được tặng 50 token nên bạn thử được một video 5 phút ngay trước khi cần nạp thêm."
draft: false
---

**Tóm tắt nhanh:** Có một công cụ mới trong mục Ứng dụng của nguyenngocvu.com giúp bạn **tạo trọn bộ prompt cho một video AI dài mà mọi cảnh vẫn nhất quán**. Bạn cho nó một ý tưởng, chọn thể loại, độ dài và engine (Veo, Kling, Runway hay Sora); nó trả về một bộ "Bible" bất biến — bối cảnh, phong cách hình, danh sách loại trừ, nhân vật khóa cứng — cùng một ma trận hàng trăm prompt shot đã đánh số, kèm luôn tiêu đề, mô tả SEO và chapters cho YouTube. Nó không render video; nó lo phần khó nhất là giữ cho video mười lăm phút nhìn như một mạch. Dùng thử tại [app.nguyenngocvu.com/long-video-prompt-engine](https://app.nguyenngocvu.com/long-video-prompt-engine).

## Vì sao video AI dài lại hay vỡ mạch

Làm một clip AI mười giây thì dễ. Làm một video mười lăm phút mà xem không thấy chắp vá mới là chuyện khó.

Cái khó không nằm ở chất lượng từng cảnh. Các engine như Veo hay Sora giờ dựng một shot rất đẹp. Vấn đề là ở sự nhất quán giữa các shot. Bạn viết tay ba mươi prompt rời, mỗi prompt tự tả lại ánh sáng, tông màu, ống kính, gương mặt nhân vật theo cách hơi khác nhau — thế là qua mỗi cảnh, nhân vật đổi mặt, màu phim nhảy, không khí đứt đoạn. Người xem không gọi tên được lỗi, nhưng họ cảm thấy nó rời rạc và bỏ đi.

Người dựng phim chuyên nghiệp giải quyết chuyện này bằng một "series bible" — một tài liệu khóa lại những gì phải giữ nguyên suốt cả phim. Công cụ này làm đúng việc đó, tự động, cho video AI.

## Bible và ma trận shot: nó thật sự trả về gì

Nhập ý tưởng "một ngày trong rừng già nhìn từ góc của loài kiến", chọn thể loại thiên nhiên, độ dài 10 phút, engine Veo. Cái bạn nhận về không phải một cục prompt, mà là hai thứ có cấu trúc.

Thứ nhất là **Bible** — phần bất biến:

- **World seed** — bối cảnh, thời đại, không gian, mô tả một đoạn giàu chi tiết.
- **Style ref** — một chuỗi phong cách hình duy nhất: màu, grading, ánh sáng, ống kính, độ hạt phim. Giữ bằng tiếng Anh để engine đọc chuẩn.
- **Negative ref** — danh sách loại trừ: không chữ, không watermark, không nhựa CGI, không morphing.
- **Entity locks** — khóa nhận dạng từng nhân vật chính để không đổi mặt giữa chừng.
- **Spine** — trục kể phù hợp thể loại (một ngày sinh học, dòng thời gian, vĩ mô tới vi mô, ba hồi, hành trình) cùng các phân đoạn đã chia sẵn.

Thứ hai là **ma trận shot**: công cụ tính bằng công thức số shot cần cho độ dài bạn chọn, chia thành N phân đoạn, M cảnh, K shot, và cân tỉ lệ cận cảnh / toàn cảnh / tĩnh. Con số này do mã tính, không để mô hình ngôn ngữ đoán — nên độ dài ra đúng. Rồi nó sinh prompt cho từng shot theo batch nhỏ, mỗi shot đều tham chiếu về Bible, để cả loạt cùng một chất.

Kèm theo là **gói YouTube**: năm tiêu đề gợi tò mò, prompt thumbnail, mô tả SEO, danh sách chapters theo timestamp và bộ tags.

## Điểm mấu chốt: nó sinh prompt, không sinh video

Đây là chỗ tôi muốn nói thẳng để bạn dùng cho đúng. Công cụ này **không render ra file video**. Nó là một cỗ máy dựng prompt. Việc tạo hình vẫn do engine bạn chọn — Veo, Kling, Runway hay Sora — thực hiện, ở tài khoản của bạn bên đó.

Vì sao tách ra như vậy? Vì phần tốn công và dễ hỏng nhất của một video AI dài không phải là bấm render từng cảnh, mà là giữ cho ba trăm cảnh đó thuộc về cùng một thế giới. Đó đúng là phần công cụ này gánh cho bạn. Bạn khỏi phải ngồi chép tay style ref vào từng prompt và cầu cho mình không gõ sai; nó bung sẵn, đánh số, xếp theo trục kể.

## Chỗ vẫn cần bạn

Như mọi công cụ AI, đây là cái khung chắc chứ không phải nút bấm ra thành phẩm.

Mỗi engine video có khẩu vị prompt riêng. Prompt sinh ra bám theo chuẩn chung, nhưng bạn nên render thử vài shot mở đầu, chỉnh một hai chữ cho hợp engine mình dùng, rồi mới chạy cả loạt — đỡ tốn lượt render vào những shot chưa vừa. Và công cụ không bịa dữ kiện: với thể loại lịch sử hay khoa học, phần nội dung bám thể loại nhưng bạn vẫn là người kiểm chứng đúng sai trước khi dựng.

Nếu bạn định làm nội dung YouTube nghiêm túc, công cụ này đi cặp tự nhiên với [công cụ nghiên cứu thị trường YouTube](/blog/nghien-cuu-thi-truong-youtube-bang-du-lieu-that/) — khảo ngách có cửa trước, rồi mới dựng video cho nó. Còn nếu bạn thiên về kể chuyện bằng giọng đọc hơn là hình, thử [công cụ viết kịch bản podcast kể chuyện](/blog/viet-kich-ban-podcast-ke-chuyen-bang-ai/).

## Dùng thế nào

Vào [app.nguyenngocvu.com/long-video-prompt-engine](https://app.nguyenngocvu.com/long-video-prompt-engine), đăng nhập (đăng ký được tặng 50 token). Nhập ý tưởng, chọn thể loại trong bảy nhóm (thiên nhiên, lịch sử, khoa học, kể chuyện, du lịch, sản phẩm, tâm linh), chọn độ dài và engine, thêm ghi chú nếu muốn, rồi bấm dựng Bible. Xem qua Bible và ma trận để chắc đúng ý, rồi bấm sinh prompt shot — công cụ chạy hết các batch cho bạn.

Đừng để một video dài chết vì mỗi cảnh một kiểu. Khóa cái khung trước, rồi mới đi dựng hình.
