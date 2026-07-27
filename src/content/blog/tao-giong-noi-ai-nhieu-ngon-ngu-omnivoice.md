---
title: "Tạo giọng nói AI nhiều ngôn ngữ ngay trên web với OmniVoice"
description: "Công cụ mới trong mục Ứng dụng: gõ văn bản, nhận về file giọng nói AI tự nhiên bằng hơn 600 ngôn ngữ. Tự chọn giọng hoặc thiết kế giọng theo giới tính, cao độ, chất giọng. Chạy trên máy GPU riêng, tính token theo số giây audio thật. Đăng ký nhận 50 token dùng thử."
pubDate: 2026-07-26
updatedDate: 2026-07-26
category: "ung-dung"
tags: ["text-to-speech", "giọng nói AI", "OmniVoice", "lồng tiếng", "sáng tạo nội dung"]
heroImage: "/images/posts/hero-tao-giong-noi-ai-nhieu-ngon-ngu-omnivoice.webp"
heroAlt: "Sóng âm thanh phát ra từ dòng chữ, biểu tượng chuyển văn bản thành giọng nói"
faq:
  - q: "Giọng đọc ra có tự nhiên không hay nghe máy móc?"
    a: "Nó dùng OmniVoice, một mô hình text-to-speech đời mới sinh giọng khá tự nhiên, có ngữ điệu chứ không đều đều kiểu đọc rô-bốt. Bạn còn chèn được các dấu như [laughter] hay [sigh] ngay trong văn bản để thêm tiếng cười, tiếng thở. Nhưng tôi nói thẳng: giọng tiếng Việt tốt, còn phần thiết kế giọng theo mô tả (nam trầm, giọng Anh…) thì mạnh nhất với tiếng Anh và tiếng Trung, các ngôn ngữ khác đôi khi ra chưa ổn định."
  - q: "Vì sao có lúc báo 'máy chủ giọng nói đang offline'?"
    a: "Vì mô hình này nặng, cần card đồ họa để chạy, nên nó không đặt trên máy chủ web mà chạy trên một máy GPU riêng. Khi máy đó bật thì công cụ online; khi tắt thì bạn thấy báo offline và không bị trừ token. Đây là đánh đổi có chủ đích để giữ chi phí thấp thay vì thuê GPU đám mây đắt đỏ. Nếu gặp offline, thử lại sau một lúc."
  - q: "Tính token thế nào cho một lần tạo?"
    a: "Theo số giây audio thật tạo ra, khoảng 0,2 token mỗi giây, tức tầm 12 token cho một phút giọng nói. Đoạn ngắn vài giây chỉ tốn vài token. Chỉ trừ khi tạo xong; nếu lỗi hay máy offline thì không mất token. Tài khoản mới được tặng 50 token nên bạn thử được ngay vài đoạn."
  - q: "Tôi lồng được giọng của chính mình không?"
    a: "Phiên bản đầu này chưa có nhân bản giọng từ mẫu ghi âm — mới có chế độ tự động và thiết kế giọng theo thuộc tính. Tính năng nhân bản giọng (đưa 3–10 giây giọng mẫu để bắt chước) đang để dành cho bản sau, sẽ mở khi phần chạy nền đủ ổn định."
draft: false
---

**Tóm tắt nhanh:** Có một công cụ mới trong mục Ứng dụng của nguyenngocvu.com giúp bạn **biến văn bản thành giọng nói AI** ngay trên trình duyệt, hỗ trợ hơn 600 ngôn ngữ. Bạn gõ nội dung, chọn để máy tự chọn giọng hoặc mô tả giọng mình muốn (nam/nữ, trầm/cao, chất giọng vùng miền), rồi nhận về một file WAV nghe và tải được. Nó chạy trên một máy GPU riêng, tính token theo số giây audio thật. Dùng thử tại [app.nguyenngocvu.com/omnivoice-tts](https://app.nguyenngocvu.com/omnivoice-tts).

## Công cụ này thật ra làm gì

Bạn có một đoạn kịch bản, một lời dẫn, hay một câu chuyện ngắn. Bạn gõ nó vào ô văn bản, bấm tạo, và chờ một chút. Cái nhận về không phải chữ nữa mà là tiếng — một file giọng đọc bạn có thể nghe thử ngay trên trang và tải về dùng.

Bên dưới nó chạy OmniVoice, một mô hình text-to-speech mã nguồn mở phủ hơn 600 ngôn ngữ, trong đó có tiếng Việt. Điểm hay là bạn không cần cài gì cả. Toàn bộ phần nặng nề — mô hình, card đồ họa — nằm ở máy khác; trình duyệt của bạn chỉ việc gửi chữ đi và nhận tiếng về.

## Hai cách chọn giọng

Công cụ cho bạn hai đường đi, tùy bạn muốn kiểm soát nhiều hay ít.

- **Tự động** — bạn chỉ gõ văn bản, để mô hình tự chọn một giọng hợp lý. Nhanh, hợp khi bạn cần nghe thử nội dung.
- **Thiết kế giọng** — bạn mô tả giọng mình muốn bằng vài thuộc tính tiếng Anh, kiểu `female, low pitch, british accent` (nữ, giọng trầm, chất Anh). Có sẵn vài mẫu bấm là dùng được, hoặc tự gõ. Cách này hợp khi bạn cần một chất giọng cụ thể cho nhân vật hay thương hiệu.

Trong cả hai chế độ, bạn chèn được các dấu biểu cảm như `[laughter]`, `[sigh]` ngay giữa câu để thêm tiếng cười hay tiếng thở, và kéo thanh tốc độ đọc nhanh chậm theo ý.

## Vì sao nó chạy trên một máy riêng, không phải máy chủ web

Đây là chỗ tôi muốn nói thật, vì nó ảnh hưởng đến cách bạn dùng.

Mô hình giọng nói tốt thì nặng và cần card đồ họa. Đặt nó lên máy chủ web thông thường thì hoặc không chạy nổi, hoặc phải thuê GPU đám mây với chi phí cao. Nên tôi chọn cách khác: mô hình chạy trên một máy có card đồ họa riêng, còn trang web đóng vai trò mặt tiền — lo đăng nhập, trừ token, và chuyển yêu cầu qua lại.

Đổi lại sự tiết kiệm đó là hai điều bạn nên biết. Thứ nhất, khi máy chạy nền tắt, công cụ sẽ báo offline và bạn không tạo được lúc đó — nhưng cũng không bị trừ token. Thứ hai, máy xử lý tuần tự một yêu cầu một lúc, nên nếu văn bản dài, bạn có thể chờ vài phút; cứ để tab mở, có thanh trạng thái báo đang xếp hàng hay đang tạo.

## Chỗ nó mạnh, và chỗ vẫn còn giới hạn

Tôi không vẽ cho bạn một cái máy đọc hoàn hảo. Vài giới hạn nói trước để bạn dùng cho đúng việc.

Giọng tiếng Việt ra khá tự nhiên. Phần thiết kế giọng theo mô tả thì mạnh nhất với tiếng Anh và tiếng Trung — đó là dữ liệu mô hình được huấn luyện kỹ nhất; với ngôn ngữ khác nó vẫn làm được nhưng đôi lúc chưa ổn định. Bản đầu này cũng chưa có nhân bản giọng từ mẫu ghi âm; tính năng đó để dành cho phiên bản sau. Và như mọi thứ dùng AI, hãy nghe lại một lượt trước khi đem đi dùng thật — nhất là với số, tên riêng, hay từ nước ngoài, thỉnh thoảng cần bạn chỉnh cách đọc.

Nói ngắn gọn: nó rất hợp để dựng nhanh phần lồng tiếng nháp, đọc thử kịch bản, hay làm giọng dẫn cho video ngắn. Phần thẩm định cuối vẫn là tai bạn.

## Ghép với các công cụ khác

Công cụ này đi cặp tự nhiên với những thứ đã có trong mục Ứng dụng. Bạn có thể [viết kịch bản podcast kể chuyện bằng AI](/blog/viet-kich-ban-podcast-ke-chuyen-bang-ai/) trước, rồi mang kịch bản đó qua đây để nghe thử bằng giọng đọc. Nếu đang dựng một kênh mới, bộ [tạo tên, mô tả, logo và banner kênh](/blog/tao-nhan-dien-kenh-youtube-bang-ai/) lo phần nhận diện, còn công cụ này lo phần tiếng nói.

## Dùng thế nào

Vào [app.nguyenngocvu.com/omnivoice-tts](https://app.nguyenngocvu.com/omnivoice-tts), đăng nhập (đăng ký được tặng 50 token). Chọn chế độ tự động hoặc thiết kế giọng, gõ văn bản, chỉnh tốc độ nếu muốn, rồi bấm tạo. Đoạn ngắn có kết quả sau ít giây; đoạn dài cứ để tab chạy đến khi xong, nghe thử rồi tải file WAV về.

Thay vì gõ chữ cho người ta đọc, giờ bạn để máy đọc thành tiếng — còn bạn giữ phần quan trọng nhất: quyết định nội dung nào đáng được cất lên thành lời.
</content>
