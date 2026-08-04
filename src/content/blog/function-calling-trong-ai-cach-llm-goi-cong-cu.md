---
title: "Function Calling Trong AI: Cách LLM Gọi Công Cụ Thực Tế"
description: "Tìm hiểu function calling trong AI - kỹ thuật cho phép LLM gọi công cụ bên ngoài, từ API đến database, để giải quyết bài toán thực tế."
pubDate: 2026-08-04
category: "cong-nghe"
tags: ["AI", "LLM", "Function Calling", "API", "Tool Use"]
heroImage: "/images/posts/hero-function-calling-trong-ai-cach-llm-goi-cong-cu.webp"
heroAlt: "Minh họa function calling - AI gọi công cụ thực tế"
faq:
  - q: "Function calling trong AI là gì?"
    a: "Function calling là khả năng của mô hình ngôn ngữ lớn (LLM) nhận diện khi nào cần gọi một công cụ bên ngoài (API, database, tính toán), trích xuất tham số phù hợp từ ngữ cảnh, và định dạng lời gọi đúng chuẩn — sau đó hệ thống thực thi và trả kết quả về cho mô hình tiếp tục xử lý."
  - q: "Tại sao function calling quan trọng?"
    a: "LLM thuần chỉ tạo văn bản từ kiến thức đã học. Function calling cho phép AI kết nối với thế giới thực: lấy dữ liệu thời gian thực, thực hiện giao dịch, điều khiển thiết bị, truy vấn database riêng — biến AI từ 'chatbot' thành 'agent hành động'."
  - q: "OpenAI, Anthropic và Google hỗ trợ function calling như thế nào?"
    a: "OpenAI gọi là 'function calling' (GPT-3.5+), Anthropic gọi là 'tool use' (Claude 3+), Google gọi là 'function declarations' (Gemini). Cả ba đều cho phép khai báo schema công cụ (tên, mô tả, tham số) — mô hình trả về structured JSON khi cần gọi, hệ thống execute, rồi đưa kết quả vào lượt tiếp theo."
  - q: "Function calling khác gì với prompt thông thường?"
    a: "Prompt thông thường chỉ yêu cầu AI tạo câu trả lời từ kiến thức sẵn có. Function calling cung cấp structured interface — AI biết chính xác công cụ nào khả dụng, tham số là gì, và output dạng JSON machine-readable, không phải plain text cần parse. Điều này đảm bảo tính nhất quán và tích hợp dễ dàng."
draft: false
---

**Function calling cho phép mô hình AI (LLM) nhận diện khi cần gọi công cụ bên ngoài — API, database, calculator — rồi tự động trích xuất tham số và định dạng lời gọi đúng chuẩn.** Thay vì chỉ trả lời dựa trên kiến thức đã học, AI giờ thực sự hành động. Đặt vé máy bay. Tra thời tiết real-time. Query database nội bộ. Điều khiển thiết bị IoT. Đây là nền tảng biến AI từ chatbot đơn thuần thành agent có năng lực can thiệp.

## Function Calling Là Gì?

Function calling (hay tool use, function declarations tùy nhà cung cấp) là khả năng của LLM:

1. **Nhận diện** khi câu hỏi/yêu cầu của người dùng cần dữ liệu/hành động ngoài phạm vi kiến thức tĩnh
2. **Chọn** công cụ phù hợp từ danh sách schema được khai báo trước
3. **Trích xuất** tham số từ ngữ cảnh hội thoại
4. **Định dạng** lời gọi thành structured output (JSON)
5. **Đợi** hệ thống thực thi công cụ và trả kết quả về
6. **Tổng hợp** kết quả vào câu trả lời cuối cùng cho người dùng

Ví dụ: người dùng hỏi "Thời tiết Hà Nội hôm nay thế nào?" — AI nhận ra cần gọi công cụ `get_weather(location="Ha Noi", date="2026-08-04")`, hệ thống gọi API thời tiết thực, nhận về `{"temp": 32, "condition": "sunny"}`, AI tổng hợp: "Hà Nội hôm nay nắng, nhiệt độ 32°C."

## Tại Sao Cần Function Calling?

### Giới Hạn Của LLM Thuần

LLM thuần chỉ tạo văn bản từ kiến thức đã học (data cutoff cũ) và context trong prompt.

Nghĩa là không biết thông tin real-time. Giá cổ phiếu? Không. Thời tiết hôm nay? Không. Tin tức mới nhất? Cũng không.

Không thực hiện hành động — gửi email, đặt lịch, thanh toán — tất cả đều nằm ngoài tầm với.

Không truy cập dữ liệu riêng: database công ty, tài liệu nội bộ, CRM. Và dễ hallucinate số liệu không tồn tại khi bị ép phải trả lời.

### Function Calling Mở Ra Khả Năng

- **Real-time data**: Giá Bitcoin, tỷ giá, thời tiết, lịch cá nhân
- **Action-oriented**: Đặt vé, gửi thông báo, tạo ticket, cập nhật CRM
- **Private knowledge**: Query vector database nội bộ (RAG), tra cứu ERP/CRM
- **Complex computation**: Tính toán phức tạp (Python interpreter, WolframAlpha)
- **Multi-step workflows**: Kết hợp nhiều công cụ — tra giá vé → so sánh → đặt vé → gửi xác nhận

## Cách Function Calling Hoạt Động

### 1. Khai Báo Schema Công Cụ

Developer định nghĩa danh sách công cụ AI có thể dùng, mỗi công cụ bao gồm:

- **Tên** (function name)
- **Mô tả** (giúp AI hiểu khi nào dùng)
- **Tham số** (kiểu dữ liệu, required/optional, mô tả từng tham số)

Ví dụ schema JSON cho OpenAI:

```json
{
  "name": "get_weather",
  "description": "Lấy thông tin thời tiết hiện tại của một thành phố",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "Tên thành phố, ví dụ: 'Ha Noi', 'Ho Chi Minh City'"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Đơn vị nhiệt độ"
      }
    },
    "required": ["location"]
  }
}
```

### 2. AI Nhận Diện Và Quyết Định

Khi nhận yêu cầu từ người dùng, AI:

- Phân tích ý định
- So khớp với danh sách công cụ
- Quyết định gọi công cụ nào (hoặc nhiều công cụ)

Ví dụ: "Thời tiết Đà Nẵng và Sài Gòn?" → AI nhận ra cần 2 lời gọi `get_weather`.

### 3. Trích Xuất Tham Số

AI đọc ngữ cảnh và điền tham số:

- Từ câu hỏi trực tiếp: "Thời tiết **Hà Nội**" → `location="Ha Noi"`
- Từ hội thoại trước: "Tôi ở Bangkok. Hôm nay thời tiết thế nào?" → `location="Bangkok"`
- Default/inference: không nói đơn vị → `unit="celsius"` (nếu có default)

### 4. Output Structured JSON

AI không gọi trực tiếp (LLM không execute code), mà trả về:

```json
{
  "function_call": {
    "name": "get_weather",
    "arguments": "{\"location\": \"Ha Noi\", \"unit\": \"celsius\"}"
  }
}
```

### 5. Hệ Thống Execute Và Trả Kết Quả

Developer code logic:

```python
if response.function_call:
    func_name = response.function_call.name
    args = json.loads(response.function_call.arguments)
    
    if func_name == "get_weather":
        result = call_weather_api(args["location"], args["unit"])
        # result = {"temp": 32, "condition": "sunny"}
```

### 6. AI Tổng Hợp Câu Trả Lời

Kết quả được đưa vào lượt tiếp theo dưới dạng "function result":

```json
{
  "role": "function",
  "name": "get_weather",
  "content": "{\"temp\": 32, \"condition\": \"sunny\"}"
}
```

AI đọc và tạo câu trả lời tự nhiên: "Hà Nội hôm nay trời nắng, nhiệt độ 32°C."

## So Sánh Các Nền Tảng

| Nhà Cung Cấp | Tên Gọi | Model Hỗ Trợ | Đặc Điểm |
|--------------|---------|--------------|----------|
| **OpenAI** | Function Calling | GPT-3.5-turbo, GPT-4, GPT-4o | Schema JSON, parallel function calls (gọi nhiều tool cùng lúc), strict mode (JSON schema validation) |
| **Anthropic** | Tool Use | Claude 3 Opus/Sonnet/Haiku | Schema tương tự, thinking process minh bạch (Claude giải thích tại sao chọn tool), multi-step orchestration tốt |
| **Google** | Function Declarations | Gemini 1.5 Pro/Flash | Schema OpenAPI-style, tích hợp Google Search/Maps sẵn, parallel calls |
| **Open-source** | Tool/Function Use | Llama 3.1+, Command R+, Mistral | Hỗ trợ qua fine-tuning hoặc prompt engineering, chất lượng thấp hơn closed models |

## Ứng Dụng Thực Tế

### Customer Support Agent

```
Tools: search_knowledge_base, create_ticket, check_order_status, send_email
Flow: User → AI search KB → nếu không đủ info → create ticket → send confirmation email
```

### Personal Assistant

```
Tools: get_calendar, create_event, send_message, get_weather, search_web
Flow: "Đặt lịch họp 3pm mai với team" → AI check calendar conflict → create_event → send invite
```

### Data Analysis Agent

```
Tools: query_database, run_python_code, generate_chart, send_report
Flow: "Revenue Q2?" → query_database → run_python (aggregate) → generate_chart → send_report
```

### E-commerce Workflow

```
Tools: search_products, check_inventory, add_to_cart, process_payment, track_shipment
Flow: "Mua laptop gaming giá tốt" → search → compare → add_to_cart → confirm → process_payment → track
```

## Best Practices

### Viết Mô Tả Công Cụ Tốt

Cụ thể hơn mơ hồ. "Get current weather" tốt hơn "Weather tool".

Nói rõ ngữ cảnh: "Use when user asks about weather, climate, or temperature".

Mô tả chi tiết từng tham số — kiểu dữ liệu, format, ví dụ.

### Xử Lý Lỗi

- AI có thể gọi sai công cụ (ví dụ dùng search khi cần calculator)
- AI có thể thiếu tham số required
- API có thể fail (timeout, rate limit)

→ Luôn validate input, handle errors, và trả feedback rõ ràng cho AI tiếp tục sửa.

### Giới Hạn Số Lượng Công Cụ

Quá nhiều tools (>20) làm giảm độ chính xác — AI bối rối chọn sai. Nhóm logic hoặc dùng routing (AI chọn category trước, rồi chọn tool cụ thể).

### Security

- **Never trust LLM output blindly**: Luôn validate args trước khi execute
- **Scope giới hạn**: Mỗi user chỉ thấy data của họ (không để AI query toàn database)
- **Rate limiting**: Ngăn lạm dụng (AI call tool 1000 lần/giây)

## Function Calling vs. RAG

| Function Calling | RAG (Retrieval-Augmented Generation) |
|------------------|--------------------------------------|
| Gọi hành động, API, computation | Lấy context từ vector database |
| Output structured (JSON) | Output text chunks |
| Real-time, dynamic | Static knowledge base |
| Ví dụ: đặt vé, send email | Ví dụ: tìm tài liệu nội bộ liên quan |

Trong thực tế, hai kỹ thuật thường **kết hợp**: RAG là một "function" — AI quyết định khi nào cần search vector DB, extract query, rồi gọi `semantic_search(query)`.

## Code Ví Dụ: OpenAI Function Calling (Python)

```python
import openai
import json

openai.api_key = "your-api-key"

# 1. Định nghĩa công cụ
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Lấy thông tin thời tiết hiện tại",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "Tên thành phố"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["location"]
            }
        }
    }
]

# 2. User message
messages = [{"role": "user", "content": "Thời tiết Hà Nội hôm nay?"}]

# 3. Gọi AI
response = openai.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto"  # AI tự quyết định
)

# 4. Kiểm tra tool call
message = response.choices[0].message
if message.tool_calls:
    for tool_call in message.tool_calls:
        func_name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)
        
        # 5. Execute tool (giả lập)
        if func_name == "get_weather":
            result = {"temp": 32, "condition": "sunny"}  # Giả lập API call
        
        # 6. Đưa kết quả vào context
        messages.append(message)  # AI message with tool_call
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "name": func_name,
            "content": json.dumps(result)
        })
    
    # 7. Gọi AI lần 2 để tổng hợp
    final_response = openai.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    print(final_response.choices[0].message.content)
    # Output: "Hà Nội hôm nay trời nắng, nhiệt độ 32°C."
```

## Xu Hướng

- **Multi-agent systems**: Nhiều AI agent chuyên biệt, mỗi agent có bộ tools riêng, phối hợp qua orchestrator
- **Autonomous agents**: AI tự lập kế hoạch nhiều bước, gọi chuỗi tools mà không cần human-in-the-loop mỗi bước
- **Tool learning**: AI học cách dùng tool mới từ documentation/examples (few-shot tool use)
- **Sandboxed execution**: Chạy code trong môi trường cô lập (Docker, WebAssembly) để an toàn

## Kết Luận

Function calling biến LLM từ "hệ thống trả lời câu hỏi" thành "agent hành động".

Đây không phải bước nhỏ. Khả năng gọi API, truy vấn database, thực thi code, tương tác với hệ thống thực — đó là phân thủy lĩnh giữa AI thụ động và AI chủ động. Từ chatbot customer service đến personal assistant, automation workflow, research agent — function calling là nền tảng chung của tất cả.

Nếu bạn nghiêm túc với việc xây dựng ứng dụng AI sản xuất, không chỉ demo, thành thạo function calling là bước không thể bỏ qua.

**Đọc thêm:**

- [RAG Là Gì? Cách Doanh Nghiệp Dùng AI Trả Lời Từ Dữ Liệu Riêng](/blog/rag-la-gi-ung-dung-doanh-nghiep/) — kỹ thuật bổ sung cho function calling khi cần truy vấn knowledge base riêng.
- [Agentic AI Workflows: Orchestration Hệ Thống AI Agents](/blog/agentic-ai-workflows-orchestration-agents/) — cách phối hợp nhiều AI agent với function calling để giải quyết bài toán phức tạp.
- [LangChain Vs LlamaIndex: So Sánh Thực Tế Cho Dự Án AI](/blog/langchain-vs-llamaindex-so-sanh-thuc-te/) — hai framework phổ biến hỗ trợ function calling và tool orchestration.
