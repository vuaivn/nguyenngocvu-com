---
title: "Transformer Architecture: Kiến Trúc Nền Tảng LLM Hiện Đại"
description: "Giải mã kiến trúc Transformer — nền tảng của GPT, BERT, Claude và mọi LLM hiện đại. Tìm hiểu attention mechanism, encoder-decoder và ứng dụng thực tế."
pubDate: 2026-09-10
category: "cong-nghe"
tags: ["transformer", "llm", "deep-learning", "attention-mechanism", "ai-architecture"]
heroImage: "/images/posts/hero-transformer-architecture-nen-tang-llm-hien-dai.webp"
heroAlt: "Sơ đồ minh họa kiến trúc Transformer với cơ chế attention và encoder-decoder"
faq:
  - q: "Transformer khác gì so với RNN và LSTM?"
    a: "Transformer xử lý song song toàn bộ chuỗi thay vì tuần tự từng bước như RNN/LSTM, giúp tăng tốc training và bắt được mối quan hệ xa trong văn bản nhờ self-attention."
  - q: "Self-attention hoạt động như thế nào?"
    a: "Self-attention tính điểm quan trọng của mỗi từ với tất cả từ khác trong câu bằng phép nhân ma trận Query, Key, Value — cho phép mô hình hiểu ngữ cảnh đầy đủ."
  - q: "Mọi LLM hiện nay đều dùng Transformer?"
    a: "Phần lớn LLM thương mại (GPT, BERT, Claude, Gemini, LLaMA) đều dựa trên Transformer hoặc các biến thể tối ưu (decoder-only, encoder-only, hay full encoder-decoder)."
  - q: "Positional encoding dùng để làm gì?"
    a: "Vì Transformer xử lý song song nên mất thông tin vị trí từ — positional encoding thêm vector đặc trưng cho từng vị trí để mô hình phân biệt thứ tự."
draft: false
---

**Transformer là kiến trúc deep learning cách mạng hóa xử lý ngôn ngữ tự nhiên từ 2017, trở thành nền tảng của GPT, BERT, Claude và mọi mô hình ngôn ngữ lớn (LLM) hiện đại. Khác với RNN/LSTM xử lý tuần tự, Transformer dùng cơ chế self-attention để xử lý song song toàn bộ chuỗi, giảm thời gian training từ vài tuần xuống vài ngày và bắt được mối quan hệ xa trong văn bản hiệu quả hơn gấp bội.**

## Transformer ra đời giải quyết vấn đề gì?

Trước Transformer, mô hình NLP chủ yếu dùng RNN (Recurrent Neural Network) và LSTM (Long Short-Term Memory). Chúng xử lý từng token tuần tự — đọc từ đầu tiên, cập nhật hidden state, đọc từ thứ hai,... — điều này gây hai hạn chế lớn:

- **Chậm**: Không song song được, training một mô hình lớn mất hàng tuần
- **Quên mất ngữ cảnh xa**: Dù LSTM có memory cell, các token cách xa 20-30 vị trí vẫn bị "mờ dần" (vanishing gradient)

Paper "Attention Is All You Need" (Vaswani et al., 2017) đề xuất **bỏ RNN hoàn toàn**, thay bằng self-attention — cơ chế cho phép mỗi token nhìn thẳng tất cả token khác cùng lúc. Kết quả: training nhanh hơn 10-100 lần, hiểu ngữ cảnh xa tốt hơn, và mở đường cho kỷ nguyên LLM.

Từ 2017 đến nay, gần như mọi đột phá NLP — BERT (2018), GPT-2/3/4, T5, Claude, Gemini, LLaMA — đều dựa trên Transformer hoặc các biến thể của nó. Đây là kiến trúc định nghĩa lại AI ngôn ngữ.

## Cấu trúc cốt lõi: Encoder-Decoder và Self-Attention

Transformer gốc gồm hai khối:

### Encoder
- Đọc input (ví dụ câu tiếng Anh), qua N lớp self-attention + feedforward
- Mỗi lớp attention cho phép từng token "chú ý" tới toàn bộ câu, tính trọng số quan trọng của từng vị trí
- Kết quả: một dãy vector embedding chứa toàn bộ ngữ cảnh

### Decoder
- Tạo output (ví dụ dịch sang tiếng Việt), cũng qua N lớp attention
- Có thêm **cross-attention** — nhìn sang encoder để hiểu input
- Mỗi bước sinh ra một token, dùng masked attention để không "nhìn trước" token chưa sinh

**Biến thể phổ biến:**
- **Encoder-only** (BERT): Chỉ dùng encoder, tốt cho classification, embedding, Q&A
- **Decoder-only** (GPT, Claude): Chỉ dùng decoder, tốt cho sinh văn bản tự do (text generation)
- **Encoder-Decoder đầy đủ** (T5, BART): Giữ nguyên thiết kế gốc, tốt cho dịch máy, tóm tắt

Đa số LLM thương mại hiện nay theo kiểu decoder-only vì đơn giản hơn, scale tốt hơn và linh hoạt cho đa nhiệm.

## Self-Attention hoạt động như thế nào?

Self-attention là trái tim của Transformer. Với mỗi token, nó:

1. **Tạo ba vector**: Query (Q), Key (K), Value (V) từ embedding gốc qua linear transform
2. **Tính điểm tương đồng**: Q của token hiện tại nhân ma trận với K của tất cả token → ra điểm attention
3. **Softmax**: Chuẩn hóa điểm thành phân phối xác suất (tổng = 1)
4. **Weighted sum**: Nhân trọng số với V của tất cả token, cộng lại → ra vector output

**Ví dụ**: Trong câu "The cat sat on the mat", khi xử lý từ "sat", attention có thể cho trọng số cao ở "cat" (chủ ngữ) và "mat" (bổ ngữ), trọng số thấp ở "the". Mô hình tự học cách phân phối trọng số này từ dữ liệu.

**Multi-head attention** chạy self-attention song song nhiều lần (8-16 head), mỗi head học một khía cạnh khác nhau (cú pháp, ngữ nghĩa, tham chiếu...), sau đó concat lại. Đây là lý do Transformer học được cả ngữ pháp lẫn ngữ nghĩa cùng lúc.

Muốn hiểu sâu hơn cách dùng LLM sau khi đã hiểu kiến trúc, đọc [Prompt Engineering Nâng Cao: Kỹ Thuật Tối Ưu Giao Tiếp Với AI](/blog/prompt-engineering-nang-cao-ky-thuat-toi-uu/) — hướng dẫn viết prompt khai thác tối đa khả năng của các mô hình Transformer.

## Positional Encoding: Giải quyết vấn đề vị trí

Vì self-attention xử lý song song, nó không biết thứ tự từ — "cat sat" hay "sat cat" cho cùng kết quả. Để mô hình phân biệt vị trí, Transformer **cộng thêm positional encoding** vào embedding ban đầu.

Encoding này là vector duy nhất cho mỗi vị trí, tính theo công thức sin/cos với tần số khác nhau:

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
```

Nhờ đó, attention không chỉ học "từ nào quan trọng" mà còn học "từ ở vị trí nào quan trọng".

**Biến thể hiện đại** (RoPE, ALiBi) thay sin/cos bằng cách mã hóa tương đối — quan hệ giữa hai token, không phải vị trí tuyệt đối — giúp mô hình xử lý văn bản dài hơn mà không bị suy giảm.

## Feedforward Network và Layer Normalization

Sau mỗi lớp attention, Transformer chạy qua một feedforward network (FFN) đơn giản:

```
FFN(x) = max(0, xW1 + b1)W2 + b2
```

FFN này xử lý từng token độc lập (không có cross-token interaction), vai trò chính là tăng khả năng biểu diễn phi tuyến. Thông thường FFN chiếm 2/3 tham số của Transformer.

**Layer Normalization** (LayerNorm) chuẩn hóa output mỗi lớp về mean=0, var=1, giúp training ổn định hơn — không có LayerNorm, mô hình sâu 12-24 lớp rất khó hội tụ. Hai biến thể phổ biến: Pre-LN (norm trước attention) và Post-LN (norm sau).

## Ứng dụng thực tế: Từ dịch máy đến chatbot

Transformer ban đầu được thiết kế cho **dịch máy** (Anh → Đức), nhưng nhanh chóng lan rộng:

- **BERT (2018)**: Encoder-only, pre-training trên Wikipedia, đạt SOTA trên 11 task NLP — phân loại, Q&A, NER...
- **GPT-2/3 (2019-2020)**: Decoder-only, sinh văn bản tự do gần như không phân biệt với người viết
- **T5 (2020)**: Encoder-Decoder, đưa mọi task về dạng text-to-text, dễ transfer learning
- **Vision Transformer (ViT, 2021)**: Áp dụng Transformer cho ảnh (chia ảnh thành patch, xử lý như token), vượt CNN trên ImageNet
- **Multimodal** (CLIP, Flamingo, GPT-4): Kết hợp văn bản, ảnh, âm thanh trong cùng một kiến trúc Transformer

Hiện nay, nếu muốn tích hợp AI ngôn ngữ vào ứng dụng, bạn đang tương tác với Transformer qua API — xem [LLM API: Tích Hợp AI Vào Ứng Dụng Thực Tế](/blog/llm-api-tich-hop-ai-ung-dung-thuc-te/) để biết cách gọi GPT/Claude qua API.

Các mô hình đa phương thức mới nhất kế thừa Transformer, mở rộng khả năng hiểu hình ảnh và âm thanh — đọc [Multimodal AI: Kết Hợp Văn Bản, Hình Ảnh Và Âm Thanh Trong Một Mô Hình](/blog/multimodal-ai-ket-hop-van-ban-hinh-anh-am-thanh/) để thấy cách chúng hoạt động.

## Hạn chế và hướng cải tiến

Dù mạnh, Transformer có hai hạn chế lớn:

### 1. Độ phức tạp O(n²)
Self-attention tính điểm cho mọi cặp token — với chuỗi dài n, cần n² phép tính. Context window 8K token đã nặng, 128K token (như GPT-4 Turbo) đòi hỏi kỹ thuật tối ưu đặc biệt (flash attention, sparse attention).

**Giải pháp**: Flash Attention (Dao et al., 2022) tối ưu memory + tốc độ, giảm 3-5x VRAM; Sparse Attention (Longformer, BigBird) chỉ attend một tập con token thay vì toàn bộ.

### 2. Tham số khổng lồ
GPT-3 có 175B tham số, LLaMA-3.1 có 405B. Training tốn hàng triệu USD điện + GPU. Inference một request cũng tốn vài trăm MB VRAM.

**Giải pháp**: Model compression (quantization, pruning, distillation) giảm kích thước 2-4x mà giữ 95%+ chất lượng. Các mô hình nhỏ như LLaMA-3.1 8B, Mistral 7B chạy tốt trên laptop consumer.

## Tương lai: Transformer còn thống trị bao lâu?

Câu hỏi mở. Vài hướng nghiên cứu thay thế:

- **State Space Models (SSM)** như Mamba: O(n) thay vì O(n²), training nhanh hơn nhưng chưa đủ mạnh để thay Transformer hoàn toàn
- **Mixture of Experts (MoE)**: Chỉ kích hoạt một phần tham số mỗi lần forward — GPT-4 và Mixtral đã dùng
- **Hybrid**: Kết hợp Transformer (ngắn) + RNN/SSM (dài) để có cả tốc độ lẫn khả năng xử lý context vô hạn

Nhưng đến 2026, Transformer vẫn là kiến trúc chủ đạo — mọi LLM thương mại đều dựa trên nó. Khả năng cao nó sẽ tiếp tục thống trị thêm 3-5 năm, trừ khi có đột phá về hiệu quả tính toán.

**Đọc thêm:**
- [Prompt Engineering Nâng Cao: Kỹ Thuật Tối Ưu Giao Tiếp Với AI](/blog/prompt-engineering-nang-cao-ky-thuat-toi-uu/) — Khai thác tối đa LLM dựa trên Transformer qua cách viết prompt
- [LLM API: Tích Hợp AI Vào Ứng Dụng Thực Tế](/blog/llm-api-tich-hop-ai-ung-dung-thuc-te/) — Hướng dẫn gọi GPT/Claude API, xử lý lỗi và tối ưu chi phí
- [Multimodal AI: Kết Hợp Văn Bản, Hình Ảnh Và Âm Thanh Trong Một Mô Hình](/blog/multimodal-ai-ket-hop-van-ban-hinh-anh-am-thanh/) — Cách Transformer mở rộng sang xử lý đa phương thức
