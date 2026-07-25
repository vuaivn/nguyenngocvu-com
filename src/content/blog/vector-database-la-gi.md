---
title: "Vector database là gì? Bộ nhớ dài hạn giúp AI thông minh hơn"
description: "Vector database là nơi lưu 'ý nghĩa' của dữ liệu dưới dạng số, giúp AI tìm kiếm theo ngữ nghĩa và ghi nhớ dài hạn. Giải thích dễ hiểu cho người mới, kèm ứng dụng thực tế."
pubDate: 2026-07-11
updatedDate: 2026-07-11
category: "cong-nghe"
tags: ["vector database", "AI", "RAG", "embedding", "LLM"]
heroImage: "/images/posts/hero-vector-database-la-gi.webp"
heroAlt: "Sơ đồ các điểm dữ liệu gần nghĩa được nhóm lại trong không gian vector nhiều chiều"
faq:
  - q: "Vector database là gì?"
    a: "Vector database (cơ sở dữ liệu vector) là loại cơ sở dữ liệu chuyên lưu trữ và tìm kiếm các 'vector' — dãy số biểu diễn ý nghĩa của văn bản, hình ảnh hay âm thanh. Thay vì tìm theo từ khóa chính xác, nó tìm theo mức độ gần nghĩa, nên rất hợp với AI."
  - q: "Vector database khác gì database thường?"
    a: "Database thường (như SQL) tìm theo giá trị khớp chính xác: đúng tên, đúng ID. Vector database tìm theo ngữ nghĩa: bạn hỏi 'thú cưng' nó vẫn tìm ra 'chó', 'mèo' dù không trùng chữ. Nó đo khoảng cách giữa các vector để biết hai thứ gần nghĩa đến đâu."
  - q: "Embedding là gì và liên quan thế nào?"
    a: "Embedding là quá trình biến một đoạn văn bản (hay ảnh) thành vector số. Một mô hình embedding đọc câu 'con mèo dễ thương' và xuất ra một dãy số. Những câu gần nghĩa sẽ có vector gần nhau. Vector database chính là nơi lưu và tra cứu các embedding này."
  - q: "Vector database dùng để làm gì?"
    a: "Ứng dụng phổ biến nhất là RAG — cho AI tra cứu tài liệu thật trước khi trả lời. Ngoài ra: tìm kiếm ngữ nghĩa, hệ thống gợi ý (recommendation), tìm ảnh giống nhau, phát hiện trùng lặp, và làm 'bộ nhớ dài hạn' cho chatbot/AI agent."
  - q: "Có những vector database phổ biến nào?"
    a: "Một số tên quen thuộc: Pinecone, Weaviate, Qdrant, Milvus, Chroma (mã nguồn mở, hợp người mới). Nhiều database truyền thống cũng thêm khả năng vector, như PostgreSQL với pgvector. Người mới có thể bắt đầu với Chroma vì đơn giản và miễn phí."
---

**Tóm tắt nhanh:** Vector database là nơi lưu **"ý nghĩa" của dữ liệu dưới dạng số** (vector), giúp AI tìm kiếm theo **ngữ nghĩa** thay vì từ khóa chính xác. Nó là mảnh ghép cốt lõi giúp AI có "bộ nhớ dài hạn" và trả lời dựa trên dữ liệu thật — nền tảng của kỹ thuật RAG.

Trong bài [RAG là gì](/blog/rag-la-gi-cho-nguoi-moi), tôi có nhắc tới chuyện AI "biến tài liệu thành vector rồi lưu vào một kho". Cái kho đó chính là **vector database**. Đây là công nghệ âm thầm đứng sau rất nhiều ứng dụng AI mà tôi dùng hằng ngày — từ "chat với tài liệu" đến bộ nhớ của AI agent. Hãy cùng mổ xẻ nó một cách dễ hiểu.

## Vì sao AI cần một loại database mới?

Database truyền thống hoạt động theo kiểu **khớp chính xác**. Bạn tìm khách hàng tên "Nguyễn Văn A" thì nó trả về đúng người tên đó. Rất tốt cho dữ liệu có cấu trúc.

Nhưng AI làm việc với **ý nghĩa**, không phải chữ khớp. Khi tôi hỏi "cách giữ bình tĩnh khi căng thẳng", tôi muốn AI tìm cả những đoạn nói về "thư giãn", "hít thở sâu", "chánh niệm" — dù không đoạn nào chứa đúng cụm từ tôi gõ. Database thường chịu thua ở đây. Cần một cách lưu trữ hiểu được **sự gần nghĩa**.

## Vector và embedding: trái tim của mọi thứ

Máy tính không hiểu chữ, nó hiểu số. Nên bước đầu tiên là biến ý nghĩa thành số — gọi là **embedding**.

Hãy tưởng tượng một tấm bản đồ khổng lồ. Mỗi câu chữ được đặt lên một điểm trên bản đồ đó. Những câu **gần nghĩa nằm gần nhau**: "con chó" và "con mèo" ở cạnh nhau (đều là thú cưng), còn "hóa đơn tiền điện" thì ở tận góc xa.

Tấm bản đồ này không phải 2 chiều mà là **hàng trăm, hàng nghìn chiều** — nên mỗi điểm được mô tả bằng một dãy số dài (chính là vector). Con người không hình dung nổi nghìn chiều, nhưng máy tính tính khoảng cách giữa chúng dễ dàng.

![Các điểm dữ liệu gần nghĩa được nhóm lại trong không gian vector nhiều chiều](/images/posts/in-vector-database-la-gi.webp)

## Vector database hoạt động ra sao?

Về cơ bản có hai giai đoạn:

1. **Lưu (indexing).** Mỗi tài liệu được đưa qua mô hình embedding để thành vector, rồi cất vào database kèm nội dung gốc.
2. **Tìm (query).** Khi có câu hỏi, câu hỏi cũng được biến thành vector. Database tìm những vector **gần nhất** với nó — tức là những nội dung gần nghĩa nhất — và trả về.

Phép "tìm gần nhất" này gọi là **similarity search** (tìm theo độ tương đồng). Để nhanh với hàng triệu vector, database dùng các thuật toán đánh chỉ mục thông minh (như HNSW) thay vì so từng cái một.

## Ứng dụng thực tế tôi thấy hữu ích

- **RAG** — cho chatbot tra tài liệu nội bộ trước khi trả lời (xem [bài RAG](/blog/rag-la-gi-cho-nguoi-moi)).
- **Bộ nhớ dài hạn cho AI agent** — lưu lại những gì đã trao đổi để lần sau "nhớ" (liên quan mật thiết tới [AI Agent là gì](/blog/ai-agent-la-gi)).
- **Tìm kiếm ngữ nghĩa** trong kho tài liệu, ghi chú cá nhân.
- **Gợi ý** sản phẩm, bài viết, video gần giống sở thích.

## Người mới bắt đầu từ đâu?

Nếu bạn muốn thử, tôi khuyên bắt đầu với **Chroma** — mã nguồn mở, miễn phí, cài vài dòng là chạy. Kết hợp với một mô hình embedding (nhiều cái miễn phí) là bạn đã có thể tự làm một hệ thống "chat với tài liệu" nhỏ. Khi cần quy mô lớn hơn mới nghĩ tới Pinecone, Qdrant, Weaviate.

## Những điều cốt lõi

- **Vector database** lưu ý nghĩa dưới dạng số (vector), tìm theo **ngữ nghĩa** chứ không phải chữ khớp.
- **Embedding** biến văn bản/ảnh thành vector; câu gần nghĩa có vector gần nhau.
- Tìm kiếm dựa trên **độ tương đồng** (similarity search), tối ưu bằng thuật toán đánh chỉ mục.
- Là nền tảng của **RAG**, bộ nhớ AI agent, tìm kiếm ngữ nghĩa, hệ gợi ý.
- Người mới nên bắt đầu với **Chroma** (miễn phí, đơn giản).

## Kết

Vector database nghe "kỹ thuật" nhưng ý tưởng lại rất đời: **sắp xếp mọi thứ theo sự gần gũi về ý nghĩa**, giống cách trí nhớ con người liên tưởng. Hiểu được nó, bạn sẽ hiểu vì sao AI ngày nay có thể "đọc" tài liệu của bạn và trả lời đúng trọng tâm. Nếu muốn đi tiếp, đọc [RAG là gì](/blog/rag-la-gi-cho-nguoi-moi) để thấy vector database được dùng trong thực tế như thế nào.
