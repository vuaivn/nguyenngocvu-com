---
title: "Function Calling Trong AI: Kết Nối LLM Với Công Cụ Bên Ngoài"
description: "Function Calling cho phép LLM gọi API, truy vấn database, thực thi code. Hiểu cách hoạt động, ứng dụng thực tế và best practices triển khai."
pubDate: 2026-10-20
category: cong-nghe
tags: ["AI", "LLM", "Function Calling", "API", "Tool Use", "Agent AI"]
heroImage: /images/posts/hero-function-calling-ai-ket-noi-llm-cong-cu.webp
heroAlt: "Minh họa Function Calling - LLM kết nối với các công cụ và API bên ngoài"
faq:
  - q: "Function Calling khác gì so với prompt thông thường?"
    a: "Prompt thông thường chỉ trả về text. Function Calling cho phép LLM quyết định GỌI một hàm cụ thể với tham số phù hợp, sau đó nhận kết quả thực thi để tiếp tục xử lý. Nó biến LLM từ chatbot thành agent có khả năng hành động thực tế."
  - q: "Những LLM nào hỗ trợ Function Calling?"
    a: "GPT-4, GPT-3.5-turbo, Claude 3 (Opus, Sonnet, Haiku), Gemini Pro, Command R+, và nhiều open-source models như Llama 3.1, Mistral. Mỗi provider có cú pháp định nghĩa function riêng nhưng logic giống nhau."
  - q: "Function Calling có an toàn không?"
    a: "Phụ thuộc cách triển khai. Luôn validate tham số từ LLM, giới hạn quyền truy cập của functions, log mọi lời gọi, và KHÔNG cho phép LLM thực thi code tùy ý. Áp dụng principle of least privilege."
  - q: "Chi phí Function Calling cao hơn prompt thông thường bao nhiêu?"
    a: "Token input tăng vì phải gửi kèm schema của functions. Với 5-10 functions đơn giản, tăng khoảng 200-500 tokens/request. Chi phí output không đổi. Tổng thể tăng 10-30% tùy độ phức tạp schema."
draft: false
---

**Function Calling (Tool Use) là khả năng cho phép mô hình ngôn ngữ lớn (LLM) không chỉ trả lời bằng text, mà còn quyết định GỌI các hàm/API bên ngoài với tham số phù hợp, nhận kết quả thực thi, và tiếp tục suy luận.** Đây là bước nhảy vọt biến LLM từ chatbot đơn thuần thành AI agent có khả năng tương tác với thế giới thực — tra cứu database, gọi API thời tiết, đặt lịch, thực thi code, điều khiển thiết bị IoT.

## Function Calling Là Gì Và Hoạt Động Thế Nào?

Function Calling không phải là LLM tự thực thi code — đừng tưởng tượng GPT-4 tự mở terminal chạy Python. Đó là một **giao thức 3 bước** giữa bạn và model:

1. **Bạn định nghĩa functions** — gửi kèm request một danh sách các hàm khả dụng. Mỗi hàm có tên, mô tả, và JSON schema tham số.
2. **LLM quyết định gọi function** — dựa vào ngữ cảnh, model trả về `function_call` object chứa tên hàm + arguments (dạng JSON), thay vì text thông thường.
3. **Bạn thực thi và gửi lại kết quả** — code của bạn chạy hàm đó với arguments từ LLM, lấy output, gửi lại cho model. LLM tiếp tục suy luận và trả lời user.

Ví dụ cụ thể:

**User hỏi:** "Thời tiết Hà Nội hôm nay thế nào?"

**Bạn gửi cho LLM:**
- Messages: `[{role: "user", content: "Thời tiết Hà Nội hôm nay thế nào?"}]`
- Functions: 
```json
[{
  "name": "get_weather",
  "description": "Lấy thông tin thời tiết theo địa điểm",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {"type": "string", "description": "Tên thành phố"},
      "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
    },
    "required": ["location"]
  }
}]
```

**LLM trả về:**
```json
{
  "role": "assistant",
  "function_call": {
    "name": "get_weather",
    "arguments": "{\"location\": \"Hà Nội\", \"unit\": \"celsius\"}"
  }
}
```

**Bạn thực thi** `get_weather("Hà Nội", "celsius")`, nhận kết quả `{temp: 28, condition: "sunny"}`.

**Gửi lại cho LLM:**
```json
{
  "role": "function",
  "name": "get_weather",
  "content": "{\"temp\": 28, \"condition\": \"sunny\"}"
}
```

**LLM trả lời user:** "Hôm nay Hà Nội trời nắng, nhiệt độ 28°C."

## Ứng Dụng Thực Tế Function Calling

### 1. Agent AI Tự Động
Đây là ứng dụng mạnh nhất. LLM tự quyết định chuỗi hành động để hoàn thành task phức tạp. Ví dụ: "Tìm 5 khách sạn ở Đà Nẵng giá dưới 1 triệu, đặt phòng cho ngày 25/12" → model gọi `search_hotels()`, so sánh kết quả, chọn khách sạn phù hợp, rồi gọi `book_room()`.

### 2. Chatbot Tra Cứu Dữ Liệu Nội Bộ
Thay vì hardcode logic phức tạp, bạn cho LLM quyền gọi `query_database()`, `search_documents()`, `get_user_profile()`. LLM tự động chọn function phù hợp với câu hỏi.

### 3. Workflow Automation
Kết hợp với [RAG - Retrieval-Augmented Generation](/blog/rag-retrieval-augmented-generation-ky-thuat-nen-tang-ai-chatbot/), LLM có thể điều phối các bước: đọc email → tóm tắt → tra CRM → tạo draft phản hồi → gửi Slack.

### 4. Code Execution & Data Analysis
Cho phép LLM viết Python code, gọi `execute_code()`, nhận output, và giải thích kết quả. Các sản phẩm như ChatGPT Code Interpreter, OpenClaw làm đúng cách này.

### 5. IoT & Smart Home Control
LLM gọi `turn_on_light("living room")`, `set_temperature(24)` dựa vào lệnh tự nhiên của user.

## Best Practices Triển Khai

### Thiết Kế Function Schema Rõ Ràng
- **Tên hàm phải mô tả**: `get_weather` > `weather`, `search_products_by_category` > `search`.
- **Description cụ thể**: Không viết "Tìm kiếm", mà "Tìm sản phẩm theo từ khóa trong catalog, trả về tối đa 10 kết quả".
- **Tham số rõ ràng**: Dùng `enum` cho giá trị cố định, `required` cho bắt buộc, `description` cho mọi field.

### Validate & Sanitize Arguments
LLM có thể hallucinate arguments — đây là thực tế, không phải lỗi. Model đôi khi "tưởng tượng" giá trị hợp lý nhưng sai. Luôn:
- Parse JSON arguments trong try-catch
- Validate kiểu dữ liệu, giới hạn giá trị
- Sanitize input trước khi query database (ngăn SQL injection)
- Reject nếu arguments không hợp lệ và yêu cầu LLM thử lại

Tin tưởng mù quáng output của LLM là con đường ngắn nhất đến production bug.

### Giới Hạn Quyền Hạn
- Chỉ expose functions an toàn (đọc data, search). Không cho phép `delete_database()`, `execute_shell_command()` trừ khi thật sự cần và có kiểm soát chặt.
- Functions nhạy cảm cần confirmation từ user trước khi thực thi.
- Rate limiting: giới hạn số lần gọi function/phút để tránh abuse.

### Xử Lý Lỗi Gracefully
- Nếu function fail, trả về error message có ý nghĩa cho LLM: `{"error": "Không tìm thấy thành phố 'Ha Noi Viet Nam', vui lòng dùng tên ngắn gọn"}`.
- LLM sẽ tự điều chỉnh và retry với arguments đúng hơn.

### Logging & Monitoring
- Log mọi function call: tên hàm, arguments, kết quả, timestamp.
- Monitor tỷ lệ lỗi, latency, cost per function.
- Debug khi LLM chọn sai function hoặc arguments sai.

## So Sánh Với Các Kỹ Thuật Khác

| Kỹ thuật | Ưu điểm | Hạn chế |
|----------|---------|---------|
| **Function Calling** | LLM tự quyết định hành động, linh hoạt, dễ mở rộng | Phụ thuộc khả năng reasoning của model, cost cao hơn |
| **Hardcoded Logic** | Nhanh, rẻ, dễ kiểm soát | Không linh hoạt, phải code mọi trường hợp |
| **Prompt Engineering Thuần** | Không cần function schema | LLM chỉ trả text, bạn phải parse → dễ lỗi, không structured |
| **Fine-tuning** | Model học được pattern cụ thể | Mất thời gian train, khó adapt với function mới |

Function Calling là sweet spot: **cân bằng giữa linh hoạt và kiểm soát**.

## Những Sai Lầm Thường Gặp

1. **Schema quá dài, quá phức tạp** - LLM bối rối, chọn sai function. Giữ dưới 10 functions/request, mỗi function dưới 200 tokens schema.
2. **Không validate arguments** - Tin tưởng mù quáng output của LLM dẫn đến lỗi runtime hoặc security issue.
3. **Không xử lý parallel function calls** - Một số model hỗ trợ gọi nhiều functions cùng lúc (GPT-4 Turbo), code của bạn cần handle.
4. **Function quá generic** - `do_something()` với 20 tham số optional → LLM không biết dùng khi nào. Tách thành các functions nhỏ, rõ ràng.
5. **Quên giới hạn context window** - Function schema ăn token. Khi có 50 functions, schema chiếm 5-10k tokens → ít token cho conversation.

## Xu Hướng Và Tương Lai

- **Parallel & Nested Function Calls**: LLM gọi nhiều functions cùng lúc, hoặc gọi function A, dùng kết quả để gọi function B → [Agent AI tự động](/blog/agent-ai-tu-dong-thiet-ke-trien-khai/) phức tạp hơn.
- **Function Calling trong Multimodal Models**: [Multimodal AI](/blog/multimodal-ai-ket-hop-van-ban-hinh-anh-am-thanh/) có thể gọi functions dựa vào hình ảnh (ví dụ: nhận diện vật thể trong ảnh → gọi `search_product_by_image()`).
- **Auto-generated Function Descriptions**: Thay vì viết tay schema, tool tự động sinh từ docstring hoặc OpenAPI spec.
- **Fine-tuned Models cho Function Calling**: Models nhỏ (7B-13B params) được fine-tune chuyên về function calling → rẻ hơn, nhanh hơn GPT-4.

## Tổng Kết

Function Calling là cầu nối giữa khả năng suy luận của LLM và hành động thực tế trên hệ thống. Nó biến AI từ "người trả lời" thành "người thực thi".

Nếu bạn đang xây dựng chatbot cần tra cứu data, agent tự động hóa workflow, hoặc ứng dụng AI tương tác với thế giới bên ngoài — Function Calling là kỹ thuật không thể bỏ qua. Không phải vì nó hot, mà vì nó giải quyết đúng vấn đề: cho LLM quyền hành động có kiểm soát.

Triển khai đúng với schema rõ ràng, validation chặt chẽ, giới hạn quyền hạn hợp lý — bạn sẽ có AI agent mạnh mẽ, an toàn và đáng tin cậy. Triển khai sai, bạn có một chatbot gọi API loạn xạ và production bug không đếm xuể.

**Đọc thêm:**
- [Agent AI Tự Động: Thiết Kế Và Triển Khai Thực Tế](/blog/agent-ai-tu-dong-thiet-ke-trien-khai/) — Cách xây dựng AI agent tự động hóa workflow phức tạp bằng Function Calling.
- [RAG - Retrieval-Augmented Generation: Kỹ Thuật Nền Tảng AI Chatbot](/blog/rag-retrieval-augmented-generation-ky-thuat-nen-tang-ai-chatbot/) — Kết hợp Function Calling với RAG để chatbot tra cứu dữ liệu nội bộ chính xác.
- [Prompt Engineering Nâng Cao: Kỹ Thuật Tối Ưu Giao Tiếp Với AI](/blog/prompt-engineering-nang-cao-ky-thuat-toi-uu/) — Thiết kế prompts hiệu quả khi làm việc với Function Calling.
