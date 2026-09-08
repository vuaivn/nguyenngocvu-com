---
title: "Zero-Shot và Few-Shot Learning: AI Học Từ Ít Dữ Liệu"
description: "Khám phá zero-shot và few-shot learning - kỹ thuật giúp AI học hiệu quả từ ít dữ liệu, giảm chi phí training và mở rộng khả năng ứng dụng thực tế."
pubDate: 2026-09-08
category: cong-nghe
tags: [AI, Machine Learning, Zero-Shot Learning, Few-Shot Learning, Transfer Learning, Meta-Learning, Prompt Engineering]
heroImage: /images/posts/hero-zero-shot-few-shot-learning-ai-hoc-tu-it-du-lieu.webp
heroAlt: "Minh họa zero-shot và few-shot learning với biểu đồ so sánh khả năng học của AI từ ít dữ liệu"
faq:
  - q: "Zero-shot learning và few-shot learning khác nhau như thế nào?"
    a: "Zero-shot learning cho phép mô hình thực hiện tác vụ hoàn toàn mới mà không cần ví dụ nào, chỉ dựa vào mô tả bằng ngôn ngữ tự nhiên. Few-shot learning cần 1-10 ví dụ minh họa để hiểu được định dạng và ngữ cảnh trước khi thực hiện. Zero-shot linh hoạt hơn nhưng độ chính xác thấp hơn few-shot khi có ví dụ tốt."
  - q: "Khi nào nên dùng few-shot thay vì fine-tuning mô hình?"
    a: "Dùng few-shot khi: bạn có ít hơn 100 mẫu dữ liệu, cần triển khai nhanh trong vài giờ thay vì vài ngày, không có GPU để training, hoặc tác vụ thay đổi thường xuyên. Fine-tuning phù hợp hơn khi có hàng nghìn mẫu dữ liệu chất lượng cao, cần tối ưu hiệu suất tối đa, và tác vụ ổn định trong thời gian dài."
  - q: "Làm thế nào để viết prompt few-shot hiệu quả?"
    a: "Chọn 3-5 ví dụ đại diện cho các trường hợp biên và đa dạng nhất của tác vụ. Sắp xếp từ đơn giản đến phức tạp. Đảm bảo định dạng input-output nhất quán. Thêm nhãn rõ ràng cho mỗi phần. Đặt ví dụ khó nhất cuối cùng vì mô hình chú ý nhiều hơn đến context gần nhất. Test và điều chỉnh thứ tự để tối ưu kết quả."
  - q: "Zero-shot và few-shot learning áp dụng được cho những tác vụ AI nào?"
    a: "Hiệu quả nhất với: phân loại văn bản (sentiment, spam, intent), trích xuất thông tin có cấu trúc (entity, key-value), dịch thuật giữa các ngôn ngữ ít dữ liệu, tóm tắt và chuyển đổi format, phân tích cảm xúc đa chiều. Kém hiệu quả hơn với: nhận diện hình ảnh phức tạp, tác vụ cần độ chính xác 99%+, real-time latency thấp."
draft: false
---

**Zero-shot và few-shot learning là hai kỹ thuật cho phép mô hình AI thực hiện tác vụ mới với rất ít hoặc không cần dữ liệu huấn luyện chuyên biệt.** Thay vì fine-tune lại toàn bộ mô hình với hàng nghìn mẫu, bạn chỉ cần mô tả tác vụ bằng ngôn ngữ tự nhiên (zero-shot) hoặc cung cấp 3-5 ví dụ minh họa (few-shot). Điều này giảm đáng kể chi phí, thời gian triển khai, và mở rộng khả năng ứng dụng AI cho những lĩnh vực có ít dữ liệu sẵn có.

## Zero-Shot Learning là gì?

Zero-shot learning cho phép mô hình AI thực hiện tác vụ hoàn toàn mới mà không cần bất kỳ ví dụ huấn luyện nào cho tác vụ đó. Mô hình dựa vào kiến thức đã học từ pre-training trên tập dữ liệu lớn, kết hợp với mô tả nhiệm vụ bằng ngôn ngữ tự nhiên.

### Cách thức hoạt động

Mô hình ngôn ngữ lớn (LLM) như GPT-4, Claude, hoặc Gemini được huấn luyện trước trên hàng tỷ văn bản từ internet. Quá trình này giúp chúng học được:

- **Hiểu ngữ cảnh**: Nhận biết ý nghĩa từ ngữ trong các tình huống khác nhau
- **Suy luận logic**: Áp dụng pattern đã học vào tình huống mới
- **Transfer knowledge**: Chuyển hóa kiến thức từ domain này sang domain khác

Khi bạn đưa ra một prompt mô tả tác vụ mới, mô hình sử dụng khả năng suy luận này để "đoán" cách thực hiện đúng mà không cần ví dụ cụ thể.

### Ví dụ thực tế

**Tác vụ**: Phân loại đánh giá sản phẩm thành 3 mức độ: tích cực, trung lập, tiêu cực.

**Zero-shot prompt**:
```
Phân loại đánh giá sau thành: tích cực, trung lập, hoặc tiêu cực.

Đánh giá: "Sản phẩm đóng gói đẹp nhưng chất lượng không như mong đợi."
Phân loại:
```

Mô hình sẽ trả lời "tiêu cực" hoặc "trung lập" dựa vào việc nó đã học được mối liên hệ giữa các từ như "không như mong đợi" với sentiment tiêu cực trong quá trình pre-training.

### Ưu điểm và hạn chế

**Ưu điểm**:
- **Triển khai nhanh**: Không cần thu thập và gán nhãn dữ liệu
- **Linh hoạt**: Dễ dàng chuyển đổi sang tác vụ khác chỉ bằng cách thay đổi prompt
- **Tiết kiệm chi phí**: Không cần GPU để training hay thuê expert gán nhãn

**Hạn chế**:
- **Độ chính xác thấp hơn**: Thường đạt 60-75% so với 85-95% khi fine-tuning
- **Không ổn định**: Kết quả có thể thay đổi với cách diễn đạt prompt khác nhau
- **Khó kiểm soát**: Khó debug khi mô hình đưa ra kết quả sai

## Few-Shot Learning là gì?

Few-shot learning là bước tiến hóa từ zero-shot, cho phép mô hình học từ một số lượng nhỏ ví dụ (thường 1-10 mẫu) được cung cấp trực tiếp trong prompt. Những ví dụ này giúp mô hình hiểu rõ hơn về format đầu ra mong muốn, ngữ cảnh cụ thể, và các trường hợp biên.

### Cách thức hoạt động

Few-shot learning dựa trên nguyên lý **in-context learning** - khả năng của LLM để nhận diện pattern từ các ví dụ trong context window và áp dụng pattern đó cho trường hợp mới mà không cần thay đổi trọng số của mô hình.

Quá trình diễn ra như sau:

1. **Mô hình đọc các ví dụ**: Phân tích cấu trúc input-output
2. **Trích xuất pattern**: Nhận diện quy luật chung từ các ví dụ
3. **Áp dụng cho input mới**: Tạo output theo pattern đã học

Toàn bộ quá trình này xảy ra trong một lần forward pass, không có backpropagation hay cập nhật trọng số.

### Ví dụ thực tế

**Tác vụ**: Trích xuất tên công ty, vị trí, và mức lương từ tin tuyển dụng.

**Few-shot prompt** (3 ví dụ):
```
Trích xuất thông tin từ tin tuyển dụng dưới dạng JSON.

Tin 1: "VNG tuyển Senior Backend Engineer tại Hồ Chí Minh, lương 2000-3000 USD"
Output: {"company": "VNG", "position": "Senior Backend Engineer", "location": "Hồ Chí Minh", "salary": "2000-3000 USD"}

Tin 2: "FPT Software cần Python Developer ở Đà Nẵng, thu nhập 15-20 triệu"
Output: {"company": "FPT Software", "position": "Python Developer", "location": "Đà Nẵng", "salary": "15-20 triệu"}

Tin 3: "Startup AI tuyển ML Engineer, remote, lương thỏa thuận"
Output: {"company": "Startup AI", "position": "ML Engineer", "location": "remote", "salary": "thỏa thuận"}

Tin 4: "Grab Vietnam tuyển Data Scientist tại Hà Nội, mức lương từ 25 triệu đồng"
Output:
```

Mô hình sẽ trả về:
```json
{"company": "Grab Vietnam", "position": "Data Scientist", "location": "Hà Nội", "salary": "từ 25 triệu đồng"}
```

### Tại sao few-shot hiệu quả hơn zero-shot?

Các ví dụ cụ thể giúp:

- **Định dạng rõ ràng**: Mô hình biết chính xác format output mong muốn (JSON, CSV, text thuần...)
- **Xử lý edge case**: Ví dụ về lương "thỏa thuận" hay location "remote" giúp mô hình biết cách handle trường hợp đặc biệt
- **Giảm mơ hồ**: Khi zero-shot có thể hiểu sai yêu cầu, few-shot làm rõ ngữ cảnh
- **Tăng consistency**: Output ổn định hơn giữa các lần chạy

Nghiên cứu của OpenAI cho thấy few-shot (5 ví dụ) có thể cải thiện accuracy từ 65% (zero-shot) lên 82% cho tác vụ phân loại văn bản.

## So sánh Zero-Shot, Few-Shot, và Fine-Tuning

| Tiêu chí | Zero-Shot | Few-Shot | Fine-Tuning |
|----------|-----------|----------|-------------|
| **Số mẫu cần** | 0 | 1-10 | 100-10,000+ |
| **Thời gian setup** | < 1 giờ | < 1 giờ | 1-7 ngày |
| **Chi phí triển khai** | Thấp (chỉ API calls) | Thấp (chỉ API calls) | Cao (GPU, expert labeling) |
| **Độ chính xác** | 60-75% | 75-90% | 85-99% |
| **Linh hoạt** | Rất cao | Cao | Thấp (cần retrain để thay đổi) |
| **Khi nào dùng** | POC, tác vụ đơn giản | Production nhỏ, MVP | Production quy mô lớn |

### Khi nào nên chọn phương pháp nào?

**Chọn zero-shot** khi:
- Bạn đang trong giai đoạn thử nghiệm, chưa rõ tác vụ cuối cùng
- Cần triển khai ngay trong vài giờ
- Tác vụ thay đổi liên tục, không ổn định
- Độ chính xác 60-70% là chấp nhận được

**Chọn few-shot** khi:
- Cần độ chính xác cao hơn zero-shot nhưng không có đủ dữ liệu để fine-tune
- Có 5-20 mẫu đại diện tốt
- Tác vụ có format output cụ thể (JSON, table...)
- Cần triển khai nhanh nhưng vẫn đảm bảo chất lượng production

**Chọn fine-tuning** khi:
- Có sẵn hàng nghìn mẫu dữ liệu chất lượng cao
- Cần độ chính xác 90%+ (y tế, tài chính, pháp lý)
- Tác vụ ổn định, ít thay đổi
- Có ngân sách và đội ngũ để maintain mô hình

Một chiến lược phổ biến: **Bắt đầu với few-shot để validate idea và thu thập dữ liệu thật từ production. Khi có đủ 1000+ mẫu, chuyển sang fine-tuning để tối ưu hiệu suất.**

## Kỹ thuật nâng cao Few-Shot Learning

### 1. Chọn ví dụ đại diện

Không phải ví dụ nào cũng có giá trị như nhau. Ví dụ tốt cần:

- **Đa dạng**: Cover các loại input khác nhau (ngắn/dài, đơn giản/phức tạp, standard/edge case)
- **Rõ ràng**: Input-output mapping không mơ hồ
- **Đại diện**: Phản ánh phân phối thực tế của dữ liệu production

**Ví dụ**: Nếu 80% query thực tế là câu hỏi ngắn dưới 10 từ, nhưng 20% là câu phức tạp nhiều mệnh đề, hãy đưa 4 ví dụ ngắn + 1 ví dụ dài trong 5-shot prompt.

### 2. Thứ tự ví dụ quan trọng

Nghiên cứu của Stanford (2022) cho thấy mô hình chú ý nhiều hơn đến các ví dụ cuối cùng trong prompt (**recency bias**). Nguyên tắc sắp xếp:

1. Ví dụ đơn giản nhất đầu tiên (warm-up)
2. Ví dụ trung bình ở giữa
3. **Ví dụ khó hoặc quan trọng nhất cuối cùng**

Cấu trúc này tương tự cách con người học: nắm được pattern cơ bản trước, rồi mới xử lý trường hợp phức tạp.

### 3. Dynamic few-shot selection

Thay vì dùng cùng một bộ ví dụ cho mọi input, chọn ví dụ **tương đồng nhất** với input hiện tại. Quy trình:

1. Embed tất cả ví dụ sẵn có trong database (dùng embedding model như OpenAI Ada-002)
2. Khi có input mới, embed nó
3. Tìm top-k ví dụ gần nhất theo cosine similarity
4. Đưa k ví dụ này vào prompt

Kỹ thuật này tăng accuracy 5-15% so với static examples, nhưng tốn thêm latency để query embedding database.

### 4. Chain-of-Thought (CoT) few-shot

Với tác vụ cần suy luận phức tạp, thêm **quá trình tư duy** vào ví dụ giúp mô hình hiểu logic thay vì chỉ học pattern bề ngoài.

**Ví dụ**: Tính toán phức tạp

```
Q: Một cửa hàng giảm giá 20% cho sản phẩm 500k, sau đó thêm 10% phí ship. Khách trả bao nhiêu?
A: Giá sau giảm = 500k × (1 - 0.2) = 500k × 0.8 = 400k.
   Phí ship = 400k × 0.1 = 40k.
   Tổng = 400k + 40k = 440k.

Q: Sản phẩm 1200k giảm 30%, cộng thuế 8%. Tổng tiền?
A: Giá sau giảm = 1200k × 0.7 = 840k.
   Thuế = 840k × 0.08 = 67.2k.
   Tổng = 840k + 67.2k = 907.2k.

Q: Giá gốc 800k, giảm 15%, thêm 5% phí dịch vụ. Khách trả bao nhiêu?
A:
```

Mô hình sẽ output cả quá trình tính, giảm lỗi logic đáng kể.

## Ứng dụng thực tế trong sản xuất

### 1. Phân loại văn bản đa ngôn ngữ

Một công ty thương mại điện tử cần phân loại đánh giá khách hàng bằng tiếng Việt, tiếng Thái, và tiếng Indonesia. Thay vì fine-tune 3 mô hình riêng (tốn 6 tuần + $15k cho labeling), họ dùng GPT-4 với 5-shot examples cho mỗi ngôn ngữ:

- **Setup time**: 2 ngày (viết prompt + test)
- **Chi phí**: $200/tháng API calls
- **Accuracy**: 84% (vs 91% của fine-tuned model, nhưng acceptable cho MVP)
- **Lợi thế**: Thêm ngôn ngữ mới chỉ cần 1 giờ

### 2. Trích xuất thông tin từ hóa đơn

Startup fintech cần đọc thông tin từ hóa đơn nhiều format (siêu thị, nhà hàng, khách sạn...). Few-shot với 8 ví dụ đại diện đạt 87% accuracy - đủ để deploy và thu thập dữ liệu thực để fine-tune sau.

**Insight**: Họ phát hiện 3 ví dụ cho edge case (hóa đơn bị nhàu, scan nghiêng, thiếu thông tin) quan trọng hơn 5 ví dụ chuẩn.

### 3. Tóm tắt báo cáo kỹ thuật

Công ty tư vấn cần tóm tắt báo cáo audit từ 50 trang xuống 2 trang, giữ lại các findings quan trọng. Zero-shot thường bỏ sót các vấn đề nhỏ nhưng critical.

Giải pháp: 4-shot với các ví dụ khác nhau về độ nghiêm trọng (critical, high, medium, low). Accuracy tăng từ 68% lên 89%, giảm được 80% thời gian review thủ công.

## Công cụ và framework hỗ trợ

### LangChain Example Selectors

LangChain cung cấp các bộ chọn ví dụ tự động:

```python
from langchain.prompts import FewShotPromptTemplate
from langchain.prompts.example_selector import SemanticSimilarityExampleSelector
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

# Định nghĩa pool ví dụ
examples = [
    {"input": "Tôi rất thích sản phẩm này", "output": "tích cực"},
    {"input": "Giao hàng chậm quá", "output": "tiêu cực"},
    # ... 50 ví dụ khác
]

# Tạo selector dựa trên similarity
example_selector = SemanticSimilarityExampleSelector.from_examples(
    examples,
    OpenAIEmbeddings(),
    Chroma,
    k=5  # Chọn 5 ví dụ gần nhất
)

# Tự động chọn ví dụ phù hợp với input
similar_examples = example_selector.select_examples(
    {"input": "Chất lượng tệ, không đáng tiền"}
)
```

### Guidance (Microsoft)

Guidance cho phép kiểm soát chặt chẽ format output trong few-shot learning:

```python
from guidance import models, gen

model = models.OpenAI("gpt-4")

# Template với structure enforced
prompt = model + f"""
Extract company info:

Example 1:
Text: "Apple Inc. revenue $394B in 2023"
{{"company": "Apple Inc.", "metric": "revenue", "value": "$394B", "year": "2023"}}

Example 2:
Text: "Microsoft profit margin 35% last quarter"
{{"company": "Microsoft", "metric": "profit margin", "value": "35%", "year": "last quarter"}}

New text: "{input_text}"
{gen(stop='}}')}}}
"""
```

### DSPy (Stanford)

DSPy tự động tối ưu prompt và chọn ví dụ tốt nhất:

```python
import dspy

class SentimentClassifier(dspy.Module):
    def __init__(self):
        self.classify = dspy.ChainOfThought("text -> sentiment")
    
    def forward(self, text):
        return self.classify(text=text)

# DSPy tự động tìm ví dụ tốt nhất từ training set
optimizer = dspy.BootstrapFewShot(metric=accuracy)
optimized_classifier = optimizer.compile(
    SentimentClassifier(),
    trainset=examples
)
```

## Xu hướng tương lai

### 1. Multimodal few-shot

GPT-4V và Gemini Ultra đã hỗ trợ few-shot learning với ảnh. Ví dụ: cho mô hình 3 ảnh sản phẩm lỗi kèm nhãn, nó có thể phân loại ảnh mới chính xác 80-85%.

### 2. Meta-learning tích hợp

Các mô hình mới được pre-train với meta-learning objectives, giúp cải thiện khả năng few-shot tự nhiên. FLAN-T5 và FLAN-PaLM là ví dụ điển hình - chúng được huấn luyện trên hàng nghìn tác vụ khác nhau với instruction-following format.

### 3. Adaptive context length

Với context window mở rộng (Claude 3.5 Sonnet hỗ trợ 200k tokens), few-shot có thể scale lên **hundreds-shot** hoặc thậm chí **thousands-shot**, mờ ranh giới với fine-tuning truyền thống.

### 4. Hybrid approaches

Kết hợp retrieval-augmented generation (RAG) + few-shot: hệ thống tự động tìm ví dụ tương tự từ knowledge base, ghép vào prompt cùng tài liệu tham khảo. Điều này đặc biệt hiệu quả cho domain-specific tasks.

## Kết luận

Zero-shot và few-shot learning đang thay đổi cách chúng ta triển khai AI trong sản xuất. Thay vì chu trình phát triển truyền thống (thu thập data → label → train → deploy) kéo dài hàng tháng, giờ đây bạn có thể:

- **Prototype trong vài giờ** với zero-shot
- **Deploy MVP trong 1-2 ngày** với few-shot
- **Thu thập dữ liệu thực từ production** để quyết định có cần fine-tune không

Điểm mấu chốt: **đừng fine-tune sớm**. Bắt đầu với zero-shot để validate idea. Nếu cần độ chính xác cao hơn, thêm vài ví dụ (few-shot). Chỉ khi tác vụ đã ổn định và có hàng nghìn mẫu chất lượng cao, hãy cân nhắc fine-tuning.

Với LLM ngày càng mạnh, ranh giới giữa few-shot và fine-tuning đang mờ dần. Câu hỏi không còn là "có nên fine-tune không?" mà là "bao nhiêu ví dụ trong context là đủ?".

**Đọc thêm:**

- [Prompt Engineering Nâng Cao: Kỹ Thuật Tối Ưu Giao Tiếp Với AI](/blog/prompt-engineering-nang-cao-ky-thuat-toi-uu/) - Học cách viết prompt hiệu quả cho zero-shot và few-shot, kèm các kỹ thuật như chain-of-thought và role prompting để tăng độ chính xác.
- [Agent AI Tự Động: Thiết Kế Và Triển Khai Thực Tế](/blog/agent-ai-tu-dong-thiet-ke-trien-khai/) - Khám phá cách AI agents sử dụng few-shot learning để tự điều chỉnh hành vi theo context, giảm thiểu nhu cầu hard-code rules.
- [Multimodal AI: Kết hợp văn bản, hình ảnh và âm thanh trong một mô hình](/blog/multimodal-ai-ket-hop-van-ban-hinh-anh-am-thanh/) - Tìm hiểu few-shot learning mở rộng sang visual tasks với GPT-4V và các mô hình multimodal khác.
