---
title: "Structured Output Với LLM: JSON Schema & Pydantic Để Nhận Dữ Liệu Có Cấu Trúc"
description: "Hướng dẫn chi tiết cách dùng JSON Schema và Pydantic để ép LLM trả về dữ liệu có cấu trúc, tránh parsing lỗi, phù hợp ứng dụng production."
pubDate: 2026-08-15
category: cong-nghe
tags: [ai, llm, json-schema, pydantic, structured-output, prompt-engineering]
heroImage: /images/posts/hero-structured-output-llm-json-schema-pydantic.webp
heroAlt: "Biểu đồ minh họa quy trình LLM sinh JSON theo schema, với validation qua Pydantic"
faq:
  - q: "Structured output khác gì so với prompt thường yêu cầu LLM trả JSON?"
    a: "Prompt thường chỉ 'nhờ' LLM trả JSON, không đảm bảo 100%. Structured output ép LLM tuân thủ schema nghiêm ngặt ở tầng API — nếu không match schema sẽ retry tự động hoặc báo lỗi ngay, tránh parse fail."
  - q: "Khi nào nên dùng Pydantic thay vì JSON Schema thuần?"
    a: "Dùng Pydantic khi code Python và cần validation phức tạp (regex, custom validator, nested model). JSON Schema thuần phù hợp khi gọi API từ ngôn ngữ khác hoặc cần spec chuẩn độc lập với runtime."
  - q: "Structured output có tốn token hơn không?"
    a: "Thường tốn thêm 5-15% token vì cần gửi schema + retry khi output sai. Nhưng tiết kiệm được chi phí debug + error handling, nên tổng thể hiệu quả hơn."
  - q: "Có thể kết hợp structured output với streaming không?"
    a: "Có — nhiều provider hỗ trợ structured streaming, từng chunk JSON hợp lệ dần. Nhưng phức tạp hơn và không phải provider nào cũng có."
draft: false
---

**Structured output bắt LLM trả dữ liệu theo khuôn JSON nghiêm ngặt — không còn văn bản tự do để rồi parse lỗi nữa. JSON Schema vẽ "hợp đồng" dữ liệu. Pydantic (Python) validation runtime kiểm chặt. Kết hợp cả hai, ứng dụng AI sản xuất nhận output tin được, ít lỗi, cắm vào hệ thống sau gọn lẹ.**

## Tại Sao Cần Structured Output Với LLM?

LLM sinh ra để trả lời bằng ngôn ngữ tự nhiên. Nhưng khi xây ứng dụng thực tế — chatbot lấy thông tin khách hàng, agent gọi API, pipeline phân tích dữ liệu — bạn cần **dữ liệu có cấu trúc cố định**, không phải đoạn văn.

Cách cũ: prompt kiểu "Trả lời theo format JSON này: {...}". 

Vấn đề? LLM quên ngoặc. Hoặc thêm comment. Hoặc trả markdown fence `\`\`\`json` parse không nổi. Field bắt buộc không đảm bảo. Phải viết logic parsing dài dằng dặc xử lý edge case.

**Structured output** (còn gọi constrained decoding, schema-enforced output) giải quyết bằng cách:
- Gửi **JSON Schema** hoặc Pydantic model cho LLM.
- API LLM **bắt buộc** tuân thủ schema — nếu không match, tự retry hoặc raise lỗi sớm.
- Developer nhận JSON đúng chuẩn, parse ngay mà không sợ exception.

Lợi ích thấy ngay:

**Độ tin cậy cao** — schema đảm bảo type, required fields.  
**Ít code xử lý lỗi** — không cần try-catch parsing mọi nơi.  
**Tích hợp dễ** — output khớp type system (TypeScript interface, Python dataclass).  
**Giảm token waste** — ít retry vì lỗi format.

## JSON Schema Là Gì Và Cách Dùng Với LLM

### JSON Schema 101

JSON Schema là một spec IETF draft mô tả cấu trúc JSON. Ví dụ:

```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "age": {"type": "integer", "minimum": 0},
    "email": {"type": "string", "format": "email"}
  },
  "required": ["name", "email"],
  "additionalProperties": false
}
```

Schema này nói: object phải có `name` (string) và `email` (string dạng email), `age` nếu có thì là số nguyên ≥0, không chấp nhận field ngoài.

### Gửi Schema Cho LLM

Nhiều LLM API (OpenAI GPT-4, Anthropic Claude 3.5+, Google Gemini Pro) hỗ trợ tham số `response_format` hoặc `schema`:

**OpenAI (từ GPT-4 Turbo)**:
```python
from openai import OpenAI

client = OpenAI()

schema = {
  "type": "object",
  "properties": {
    "product_name": {"type": "string"},
    "price": {"type": "number"},
    "in_stock": {"type": "boolean"}
  },
  "required": ["product_name", "price"],
  "additionalProperties": False
}

response = client.chat.completions.create(
  model="gpt-4-turbo",
  messages=[{"role": "user", "content": "Extract product info: iPhone 15 Pro, $999, available"}],
  response_format={
    "type": "json_schema",
    "json_schema": {"name": "product", "schema": schema, "strict": True}
  }
)
output = response.choices[0].message.content
# output là JSON string đảm bảo match schema
```

**Anthropic Claude (từ 3.5 Sonnet)**:
```python
import anthropic

schema = {...}  # tương tự
client = anthropic.Anthropic(api_key="...")
message = client.messages.create(
  model="claude-3-5-sonnet-20241022",
  messages=[{"role": "user", "content": "..."}],
  tools=[{
    "name": "output",
    "description": "Structured output",
    "input_schema": schema
  }],
  tool_choice={"type": "tool", "name": "output"}
)
# Parse từ tool_use block
```

Khi schema truyền vào, LLM sẽ:
1. **Constrain** quá trình sinh — chỉ tạo token hợp lệ theo schema (grammar-guided decoding).
2. Nếu vẫn sinh output không hợp lệ, provider có thể retry hoặc raise error sớm (tùy implementation).

### Schema Nâng Cao

- **Nested objects**: mô tả object lồng nhau.
- **Arrays**: `"type": "array", "items": {...}`.
- **Enums**: `"enum": ["A", "B", "C"]` — field chỉ nhận giá trị trong list.
- **Pattern**: regex cho string, `"pattern": "^\\d{3}-\\d{4}$"` (mã bưu điện).
- **Conditional schema**: `oneOf`, `anyOf`, `allOf` cho logic phức tạp.

Ví dụ array + nested:
```json
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "integer"},
          "name": {"type": "string"}
        },
        "required": ["id", "name"]
      }
    }
  }
}
```

## Pydantic: Validation Runtime Mạnh Mẽ Cho Python

### Pydantic Là Gì?

[Pydantic](https://docs.pydantic.dev/) là thư viện Python validation dùng type hints. Định nghĩa model:

```python
from pydantic import BaseModel, EmailStr, Field

class Product(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    email: EmailStr
    tags: list[str] = []
```

Khi parse:
```python
data = {"name": "iPhone", "price": 999, "email": "test@example.com"}
product = Product(**data)
# Nếu data sai (price âm, email sai format) → raise ValidationError
```

### Tích Hợp Pydantic Với LLM

**Cách 1: Instructor** (thư viện wrapper OpenAI/Anthropic):
```python
import instructor
from openai import OpenAI

client = instructor.from_openai(OpenAI())

class User(BaseModel):
    name: str
    age: int

user = client.chat.completions.create(
  model="gpt-4-turbo",
  messages=[{"role": "user", "content": "Extract: John, 30 years old"}],
  response_model=User
)
# user là instance của User, đã validated
```

**Cách 2: LangChain** với `StructuredOutputParser`:
```python
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate

parser = PydanticOutputParser(pydantic_object=Product)
prompt = PromptTemplate(
  template="Extract product info.\n{format_instructions}\n{query}",
  input_variables=["query"],
  partial_variables={"format_instructions": parser.get_format_instructions()}
)
# format_instructions auto-gen từ Pydantic model thành prompt
chain = prompt | llm | parser
output = chain.invoke({"query": "..."})
# output là Product instance
```

**Lợi ích Pydantic**:
- **Custom validators**: logic phức tạp (kiểm tra số điện thoại VN, validate URL).
- **Type coercion**: tự chuyển "123" → 123.
- **Nested models**: `User` chứa `Address`, chứa `Coordinates`.
- **IDE autocomplete**: field type rõ ràng.

### So Sánh JSON Schema Thuần vs Pydantic

| Tiêu chí | JSON Schema | Pydantic |
|----------|-------------|----------|
| Ngôn ngữ | Độc lập (JSON) | Python-only |
| Validation phức tạp | Hạn chế (chỉ regex, range) | Mạnh (custom function) |
| Nested model | Có, nhưng verbose | Gọn gàng với class |
| IDE support | Ít | Tốt (type hints) |
| Sử dụng | Gọi API trực tiếp từ bất kỳ ngôn ngữ | Python app, tích hợp sâu |

**Khuyến nghị**:
- Dùng **JSON Schema thuần** khi gọi LLM API từ JavaScript/Go/Rust, hoặc cần spec chia sẻ cross-team.
- Dùng **Pydantic** khi code Python và cần validation phức tạp + type safety.

## Khi Nào Nên Dùng Structured Output?

**Dùng khi**:
- **Ứng dụng production cần độ tin cậy**: chatbot lấy thông tin khách hàng, agent gọi API, data pipeline.
- **Output phức tạp**: nhiều field, nested, enum — prompt tự do dễ sai.
- **Tích hợp downstream**: output đưa vào database, API khác yêu cầu schema chặt.

**Không cần khi**:
- Output chỉ là đoạn văn tự do (tóm tắt, viết blog).
- Prototype nhanh, demo — prompt "trả JSON" đủ dùng.
- LLM không hỗ trợ (model cũ, local LLM chưa có constrained decoding).

**Trade-off** có:

Chi phí token tăng 5-15% (schema + retry).  
Latency cao hơn nếu retry nhiều.  
Giảm linh hoạt — LLM không thể "sáng tạo" format khác ngoài schema.

Nhưng tổng thể? Lợi ích vượt chi phí khi scale.

## Ví Dụ Thực Tế: Trích Xuất Thông Tin Sản Phẩm

**Bài toán**: Từ mô tả sản phẩm tự do, trích ra: tên, giá, danh mục, có sẵn hàng không.

**Input**: "Laptop Dell XPS 13, giá 25 triệu, thuộc danh mục máy tính, còn hàng."

**Pydantic model**:
```python
from pydantic import BaseModel
from enum import Enum

class Category(str, Enum):
    laptop = "laptop"
    phone = "phone"
    tablet = "tablet"

class Product(BaseModel):
    name: str
    price: float  # triệu đồng
    category: Category
    in_stock: bool
```

**Code (OpenAI + Instructor)**:
```python
import instructor
from openai import OpenAI

client = instructor.from_openai(OpenAI(api_key="..."))

text = "Laptop Dell XPS 13, giá 25 triệu, thuộc danh mục máy tính, còn hàng."
product = client.chat.completions.create(
  model="gpt-4-turbo",
  messages=[{"role": "user", "content": f"Extract product info: {text}"}],
  response_model=Product
)

print(product.model_dump_json(indent=2))
# {
#   "name": "Dell XPS 13",
#   "price": 25.0,
#   "category": "laptop",
#   "in_stock": true
# }
```

**Lợi ích**:
- Không cần parse tay, không sợ thiếu field.
- `category` đảm bảo nằm trong enum.
- `in_stock` luôn boolean, không bao giờ string "có" gây lỗi.

## Best Practices Khi Dùng Structured Output

1. **Schema rõ ràng**: mô tả đầy đủ, đặt tên field dễ hiểu (`user_email` thay vì `ue`).
2. **Required vs optional**: chỉ đánh required field thật sự cần — giảm retry.
3. **Default value**: dùng default cho field không quan trọng.
4. **Validation hợp lý**: đừng quá chặt (regex phức tạp) khiến LLM khó match.
5. **Error handling**: vẫn cần try-catch cho ValidationError — LLM đôi khi vẫn sai.
6. **Test schema**: thử với input edge case trước khi production.
7. **Versioning**: khi thay đổi schema, version để tránh break client cũ.

## Công Cụ & Thư Viện Hữu Ích

- **[Instructor](https://github.com/jxnl/instructor)**: Wrapper OpenAI/Anthropic/Gemini cho Pydantic, dễ dùng nhất Python.
- **[LangChain StructuredOutputParser](https://python.langchain.com/docs/modules/model_io/output_parsers/types/pydantic/)**: tích hợp chain LangChain.
- **[Marvin](https://github.com/PrefectHQ/marvin)**: AI engineering framework, hỗ trợ structured extraction.
- **[Outlines](https://github.com/outlines-dev/outlines)**: Constrained generation cho local LLM (llama.cpp, vLLM).
- **[JSON Schema Validator online](https://www.jsonschemavalidator.net/)**: test schema nhanh.
- **[Pydantic Docs](https://docs.pydantic.dev/)**: tài liệu chính thức, đầy đủ.

## FAQ

### Structured output khác gì so với prompt thường yêu cầu LLM trả JSON?

Prompt thường chỉ "nhờ" LLM trả JSON, không đảm bảo 100%. Structured output ép LLM tuân thủ schema nghiêm ngặt ở tầng API — nếu không match schema sẽ retry tự động hoặc báo lỗi ngay, tránh parse fail.

### Khi nào nên dùng Pydantic thay vì JSON Schema thuần?

Dùng Pydantic khi code Python và cần validation phức tạp (regex, custom validator, nested model). JSON Schema thuần phù hợp khi gọi API từ ngôn ngữ khác hoặc cần spec chuẩn độc lập với runtime.

### Structured output có tốn token hơn không?

Thường tốn thêm 5-15% token vì cần gửi schema + retry khi output sai. Nhưng tiết kiệm được chi phí debug + error handling, nên tổng thể hiệu quả hơn.

### Có thể kết hợp structured output với streaming không?

Có — nhiều provider hỗ trợ structured streaming, từng chunk JSON hợp lệ dần. Nhưng phức tạp hơn và không phải provider nào cũng có.

### Local LLM (llama.cpp, Ollama) có hỗ trợ structured output không?

Có — dùng thư viện như [Outlines](https://github.com/outlines-dev/outlines) hoặc [Guidance](https://github.com/guidance-ai/guidance) để constrained generation. Llama.cpp cũng có tham số `json_schema` (experimental).

## Kết Luận

Structured output — bước tiến thật sự khi đưa LLM vào production. JSON Schema + Pydantic vẽ "hợp đồng" chặt giữa LLM và ứng dụng. Giảm lỗi. Tăng tin cậy. Dễ maintain.

Ứng dụng production? Bắt buộc dùng cho mọi endpoint trả dữ liệu.  
Prototype/demo? Prompt tự do cũng OK, nhưng chuyển sang schema sớm khi scale.  
Code Python? Instructor + Pydantic cho trải nghiệm developer tốt nhất.

Thiết kế schema tốt từ đầu tiết kiệm hàng chục giờ debug parsing lỗi sau.

**Đọc thêm:**
- [Function Calling Trong AI: Cách LLM Gọi Công Cụ Thực Tế](/blog/function-calling-trong-ai-cach-llm-goi-cong-cu/) — structured output là nền tảng cho function calling, cùng đọc để hiểu cách LLM tương tác với API bên ngoài.
- [Prompt Optimization: Tối Ưu Chi Phí Và Hiệu Suất LLM](/blog/prompt-optimization-ky-thuat-toi-uu-llm/) — kỹ thuật prompt giảm token waste, kết hợp structured output để tối ưu cả chi phí lẫn độ tin cậy.
