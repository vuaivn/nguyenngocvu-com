---
title: "Context Window Management: Xử Lý Prompt Dài Hiệu Quả"
description: "Hướng dẫn kỹ thuật quản lý context window của LLM: nén prompt, chunking thông minh, caching, và tối ưu chi phí khi làm việc với đầu vào dài."
pubDate: 2026-08-19
category: cong-nghe
tags: ["llm", "prompt-engineering", "optimization", "ai"]
heroImage: /images/posts/hero-context-window-management-xu-ly-prompt-dai.webp
heroAlt: "Biểu đồ minh họa quản lý context window với các khối văn bản được nén và phân chia thông minh"
faq:
  - q: "Context window là gì và tại sao quan trọng?"
    a: "Context window là giới hạn số token mà một mô hình LLM có thể xử lý trong một lần gọi (bao gồm cả prompt và response). Quan trọng vì vượt giới hạn này sẽ khiến mô hình cắt bỏ thông tin hoặc từ chối xử lý, đồng thời ảnh hưởng trực tiếp đến chi phí API."
  - q: "Làm thế nào để biết prompt của tôi vượt quá context window?"
    a: "Dùng tokenizer của nhà cung cấp (như tiktoken cho OpenAI) để đếm số token trước khi gửi. So sánh với giới hạn của mô hình (ví dụ GPT-4 Turbo: 128K, Claude 3.5: 200K). Nếu vượt, API thường trả lỗi 'context_length_exceeded'."
  - q: "Kỹ thuật nào tiết kiệm chi phí nhất khi xử lý văn bản dài?"
    a: "Prompt caching (lưu phần tĩnh của prompt) tiết kiệm đến 90% chi phí cho các phần lặp lại. Kết hợp với chunking + summarization để chỉ gửi phần liên quan nhất, thay vì toàn bộ tài liệu vào context."
  - q: "Khi nào nên dùng RAG thay vì nhồi hết vào context window?"
    a: "Dùng RAG khi: (1) tài liệu > 100K tokens, (2) chỉ cần một phần nhỏ thông tin cho câu trả lời, (3) cần truy xuất động từ nguồn cập nhật thường xuyên. Context window thuần túy phù hợp với văn bản ≤ 50K và cần toàn bộ ngữ cảnh để phân tích."
draft: false
---

**Context window là "bộ nhớ làm việc" của LLM — vượt quá giới hạn này, mô hình sẽ cắt bớt hoặc từ chối xử lý. Bài này hướng dẫn 6 kỹ thuật thực tế để quản lý prompt dài hiệu quả: chunking thông minh, nén nội dung, caching, sliding window, summarization và RAG — giúp giảm chi phí, tăng độ chính xác và tránh lỗi token overflow.**

## Context Window Là Gì?

Context window (cửa sổ ngữ cảnh) là **giới hạn số token** mà một mô hình ngôn ngữ lớn (LLM) có thể "nhìn thấy" và xử lý trong một lần gọi API. Số này bao gồm cả **input prompt** (câu hỏi + dữ liệu đầu vào) và **output response** (câu trả lời mô hình sinh ra).

### Ví dụ thực tế

| Mô hình | Context Window | Ghi chú |
|---------|---------------|---------|
| GPT-4o | 128,000 tokens | ~96,000 từ tiếng Anh |
| Claude 3.5 Sonnet | 200,000 tokens | ~150,000 từ |
| Gemini 1.5 Pro | 2,000,000 tokens | ~1.5 triệu từ (lớn nhất 2026) |
| Llama 3.1 (70B) | 128,000 tokens | Mô hình mở |

**Lưu ý**: 1 token ≈ 0.75 từ tiếng Anh, ≈ 0.5 từ tiếng Việt (có dấu tách thành nhiều token hơn).

### Tại sao phải quản lý?

1. **Chi phí API**: Các nhà cung cấp tính phí theo số token. Prompt 100K token với GPT-4 có thể tốn \$3-5 mỗi lần gọi.
2. **Hiệu suất giảm**: Mô hình "lạc đường" trong context quá dài — thông tin quan trọng bị chôn vùi.
3. **Giới hạn cứng**: Vượt quá → lỗi `context_length_exceeded`, hoặc bị cắt cụt thông tin.

## Đo Lường Số Token Trước Khi Gửi

**Không đoán mò** — mỗi mô hình có tokenizer riêng. Dùng công cụ chính thức:

### OpenAI (GPT-4, GPT-3.5)
```python
import tiktoken

encoding = tiktoken.encoding_for_model("gpt-4")
text = "Your long prompt here..."
token_count = len(encoding.encode(text))
print(f"Token count: {token_count}")
```

### Anthropic (Claude)
```python
from anthropic import Anthropic

client = Anthropic()
token_count = client.count_tokens(text="Your prompt...")
print(token_count)
```

### Google (Gemini)
```python
import google.generativeai as genai

model = genai.GenerativeModel('gemini-1.5-pro')
token_count = model.count_tokens("Your text").total_tokens
```

**Kinh nghiệm**: Luôn để lại **buffer 10-20%** cho response. Context 128K → dùng tối đa ~110K cho prompt.

## 6 Kỹ Thuật Quản Lý Context Window

### 1. Chunking Thông Minh (Phân Đoạn Có Ngữ Cảnh)

**Ý tưởng**: Chia văn bản dài thành các chunk nhỏ, mỗi chunk xử lý riêng, sau đó tổng hợp kết quả.

**Cách làm thực tế**:
```python
def smart_chunk(text, max_tokens=4000, overlap=200):
    """Chunk với overlap để giữ ngữ cảnh liên tục"""
    encoding = tiktoken.encoding_for_model("gpt-4")
    tokens = encoding.encode(text)
    
    chunks = []
    start = 0
    while start < len(tokens):
        end = min(start + max_tokens, len(tokens))
        chunk_tokens = tokens[start:end]
        chunks.append(encoding.decode(chunk_tokens))
        start = end - overlap  # Overlap để tránh mất ngữ cảnh
    
    return chunks
```

**Khi nào dùng**: Phân tích báo cáo dài, tóm tắt sách, xử lý transcript video.

**Lưu ý**: Overlap 5-10% giữa các chunk để tránh cắt giữa câu.

### 2. Prompt Caching (Lưu Cache Phần Tĩnh)

**Ý tưởng**: Các nhà cung cấp như Anthropic/OpenAI cho phép **cache phần prompt không đổi** (ví dụ system instruction, tài liệu tham khảo) — chỉ trả tiền cho phần dynamic.

**Ví dụ với Anthropic Claude**:
```python
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "Bạn là chuyên gia phân tích hợp đồng.",
            "cache_control": {"type": "ephemeral"}  # Cache phần này
        },
        {
            "type": "text", 
            "text": full_contract_text,  # 50K tokens
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {"role": "user", "content": "Tìm điều khoản về bảo hành?"}
    ]
)
```

**Tiết kiệm**: 90% chi phí cho phần cached (chỉ trả 10% giá).

**Lưu ý**: Cache tồn tại ~5 phút. Phù hợp với nhiều câu hỏi liên tiếp về cùng tài liệu.

### 3. Sliding Window (Cửa Sổ Trượt)

**Ý tưởng**: Với cuộc hội thoại dài, chỉ giữ **N tin nhắn gần nhất** trong context, loại bỏ tin nhắn cũ.

```python
def sliding_window(messages, max_tokens=100000):
    """Giữ tin nhắn mới nhất, xóa cũ khi vượt giới hạn"""
    encoding = tiktoken.encoding_for_model("gpt-4")
    
    total_tokens = 0
    kept_messages = []
    
    # Duyệt ngược từ tin nhắn mới nhất
    for msg in reversed(messages):
        msg_tokens = len(encoding.encode(msg["content"]))
        if total_tokens + msg_tokens > max_tokens:
            break
        kept_messages.insert(0, msg)
        total_tokens += msg_tokens
    
    return kept_messages
```

**Khi nào dùng**: Chatbot tư vấn dài hơi, hỗ trợ khách hàng multi-turn.

**Trade-off**: Mất ngữ cảnh xa (người dùng phải nhắc lại thông tin cũ).

### 4. Summarization (Tóm Tắt Tiệm Tiến)

**Ý tưởng**: Thay vì xóa tin nhắn cũ, **tóm tắt chúng** thành một đoạn ngắn, giữ lại tinh túy.

```python
async def compress_context(old_messages, llm_client):
    """Nén ngữ cảnh cũ thành summary ngắn"""
    old_text = "\n".join([m["content"] for m in old_messages])
    
    summary = await llm_client.complete(
        prompt=f"Tóm tắt cuộc hội thoại sau trong 200 từ:\n\n{old_text}",
        max_tokens=300
    )
    
    return {
        "role": "system",
        "content": f"[Tóm tắt hội thoại trước]: {summary}"
    }
```

**Ưu điểm**: Giữ được맥락 xa mà vẫn tiết kiệm token.

**Nhược điểm**: Mất chi tiết (không dùng cho pháp lý/y tế cần chính xác tuyệt đối).

### 5. Hierarchical Summarization (Tóm Tắt Phân Cấp)

**Ý tưởng**: Với tài liệu cực dài (sách 500 trang), tóm tắt từng chương → tóm tắt các tóm tắt → tóm tắt cấp 3 → cuối cùng có một đoạn executive summary 500 từ.

```
[Toàn bộ sách 200K tokens]
    ↓ Chia 20 chương
[20 tóm tắt chương @ 2K tokens mỗi cái] = 40K tokens
    ↓ Tóm tắt cấp 2
[5 tóm tắt nhóm chương @ 1K tokens] = 5K tokens
    ↓ Tóm tắt cuối
[Executive summary @ 500 tokens]
```

**Khi nào dùng**: Nghiên cứu học thuật, phân tích hồ sơ dự thầu lớn.

**Tool gợi ý**: LangChain có `MapReduceDocumentsChain` hỗ trợ sẵn.

### 6. RAG (Retrieval-Augmented Generation)

**Ý tưởng**: Thay vì nhồi toàn bộ tài liệu vào prompt, **chỉ truy xuất phần liên quan nhất** (3-5 đoạn) dựa trên câu hỏi.

```python
# Bước 1: Tạo vector database
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

docs = split_document(long_text, chunk_size=500)
vectorstore = FAISS.from_documents(docs, OpenAIEmbeddings())

# Bước 2: Retrieval
query = "Điều khoản thanh toán là gì?"
relevant_chunks = vectorstore.similarity_search(query, k=5)

# Bước 3: Chỉ gửi 5 chunk liên quan vào prompt
context = "\n".join([chunk.page_content for chunk in relevant_chunks])
prompt = f"Dựa vào tài liệu:\n{context}\n\nCâu hỏi: {query}"
```

**Ưu điểm**: Giảm từ 100K tokens → 5K tokens, chi phí giảm 95%.

**Khi nào dùng**: Knowledge base lớn, FAQ động, hệ thống trả lời từ tài liệu.

## Chiến Lược Kết Hợp Thực Tế

Mỗi dự án cần mix riêng. Context window khổng lồ nghe hấp dẫn, nhưng latency cao và chi phí nhân lên nhanh. RAG chunking thường hiệu quả hơn cho tài liệu >100K tokens.

Dưới đây là bảng chọn kỹ thuật theo tình huống thực tế:

| Tình huống | Kỹ thuật khuyên dùng | Lý do |
|-----------|---------------------|-------|
| Phân tích 1 hợp đồng 50K tokens | Prompt Caching + Chunking | Cache hợp đồng, chunk để trả lời từng phần |
| Chatbot tư vấn sản phẩm (cuộc hội thoại 100+ turns) | Sliding Window + Summarization | Giữ 20 tin nhắn gần nhất + summary 5 tin cũ |
| Tóm tắt sách 500 trang | Hierarchical Summarization | Duy nhất cách khả thi |
| Hệ thống hỏi đáp nội bộ công ty (1000+ tài liệu) | RAG | Không thể nhồi hết vào context |
| So sánh 5 file PDF (mỗi file 20K tokens) | Chunking + Summarization | Tóm tắt từng file trước, so sánh các summary |

## Đo Lường Hiệu Quả

### Các chỉ số cần theo dõi

1. **Token usage per request**: Trung bình prompt dùng bao nhiêu token?
2. **Cache hit rate** (nếu dùng caching): % request tận dụng được cache?
3. **Cost per query**: Chi phí API thực tế cho mỗi câu hỏi?
4. **Response quality**: Sau khi nén context, độ chính xác có giảm không?

### Công cụ logging đơn giản

```python
import structlog

logger = structlog.get_logger()

def log_context_metrics(prompt, response):
    logger.info(
        "llm_request",
        prompt_tokens=count_tokens(prompt),
        response_tokens=count_tokens(response),
        total_cost=calculate_cost(prompt, response),
        cache_hit=getattr(response, 'cached', False)
    )
```

**Mục tiêu**: Giảm average prompt tokens ≥30% sau 1 tháng tối ưu, mà vẫn giữ accuracy ≥95%.

## Lỗi Thường Gặp

### 1. Chunk mà không overlap
**Hậu quả**: Câu bị cắt đứt giữa chừng, mô hình hiểu sai.

**Sửa**: Overlap 10-15% giữa các chunk. Với chunk 4K, overlap 200 tokens thường là điểm cân bằng tốt — đủ giữ ngữ cảnh mà không dư thừa.

### 2. Cache prompt thường xuyên thay đổi
**Hậu quả**: Cache miss → không tiết kiệm được gì, còn tốn thêm phí quản lý.

**Sửa**: Chỉ cache phần **thật sự tĩnh** (system instruction, tài liệu gốc không đổi).

### 3. Dùng RAG nhưng chunk quá nhỏ
**Hậu quả**: Mỗi chunk 100 từ → thiếu ngữ cảnh, retrieval trả kết quả rời rạc.

**Sửa**: Chunk size 400-600 từ (cân bằng giữa specificity và context).

### 4. Quên đếm token của system prompt
**Hậu quả**: Tưởng còn 120K cho user input, thực tế system prompt đã ăn 20K.

**Sửa**: Luôn đo **toàn bộ**: system + user + examples + history.

## Code Mẫu Hoàn Chỉnh

```python
import tiktoken
from typing import List, Dict

class ContextManager:
    def __init__(self, model="gpt-4", max_tokens=128000):
        self.model = model
        self.max_tokens = max_tokens
        self.encoding = tiktoken.encoding_for_model(model)
        self.system_tokens = 0
    
    def set_system_prompt(self, prompt: str):
        self.system_prompt = prompt
        self.system_tokens = len(self.encoding.encode(prompt))
    
    def available_tokens(self) -> int:
        """Tokens còn lại cho user input + response"""
        return self.max_tokens - self.system_tokens
    
    def fit_messages(self, messages: List[Dict], reserve_for_response=2000):
        """Sliding window: giữ tin nhắn gần nhất vừa đủ"""
        budget = self.available_tokens() - reserve_for_response
        
        kept = []
        current_tokens = 0
        
        for msg in reversed(messages):
            msg_tokens = len(self.encoding.encode(msg["content"]))
            if current_tokens + msg_tokens > budget:
                break
            kept.insert(0, msg)
            current_tokens += msg_tokens
        
        return kept, current_tokens
    
    def should_summarize(self, messages: List[Dict], threshold=0.7):
        """Nên tóm tắt khi context dùng >70% budget"""
        _, used = self.fit_messages(messages)
        usage_ratio = used / self.available_tokens()
        return usage_ratio > threshold

# Sử dụng
manager = ContextManager(model="gpt-4", max_tokens=128000)
manager.set_system_prompt("Bạn là trợ lý AI chuyên nghiệp.")

conversation = [...]  # 50 tin nhắn
fitted_messages, tokens_used = manager.fit_messages(conversation)

if manager.should_summarize(conversation):
    print("Cảnh báo: Nên tóm tắt conversation!")
```

## Tương Lai: Context Window Vô Hạn?

Google Gemini 1.5 Pro đã đạt **2 triệu tokens** (≈1,500 trang văn bản). Một số mô hình nghiên cứu thử nghiệm 10 triệu tokens.

**Nhưng**:
1. **Chi phí vẫn tăng tuyến tính**: 2M tokens @ \$0.003/1K = \$6 mỗi lần gọi.
2. **Attention degradation**: Mô hình vẫn "lạc" trong context quá dài (hiện tượng "lost in the middle").
3. **Latency**: Xử lý 2M tokens mất 30-60 giây.

→ **Kết luận**: Context window lớn là công cụ, không phải phép màu. Vẫn cần quản lý thông minh.

## Checklist Tối Ưu Context Window

- [ ] Đo token thực tế bằng tokenizer chính thức (không đoán)
- [ ] Để buffer 10-20% cho response
- [ ] Dùng prompt caching cho phần tĩnh (tiết kiệm 90% chi phí)
- [ ] Implement sliding window cho chatbot dài hơi
- [ ] Chunk văn bản dài với overlap 10-15%
- [ ] Tóm tắt hội thoại cũ khi context >70% giới hạn
- [ ] Cân nhắc RAG nếu tài liệu >100K tokens
- [ ] Log token usage để tối ưu liên tục
- [ ] Test chất lượng sau khi nén context (accuracy ≥95%)

**Đọc thêm:**

- [RAG Là Gì? Cách Doanh Nghiệp Dùng AI Trả Lời Từ Dữ Liệu Riêng](/blog/rag-la-gi-ung-dung-doanh-nghiep/) — Khi nào dùng RAG thay vì nhồi hết vào context window, với ví dụ thực tế triển khai cho doanh nghiệp.
- [Prompt Optimization: Tối Ưu Chi Phí Và Hiệu Suất LLM](/blog/prompt-optimization-ky-thuat-toi-uu-llm/) — Các kỹ thuật viết prompt gọn hơn, giảm token waste mà vẫn giữ chất lượng đầu ra.
- [Semantic Search Với Embeddings: Hướng Dẫn Thực Tế](/blog/semantic-search-voi-embeddings-huong-dan/) — Nền tảng cho RAG: cách vector search giúp truy xuất đúng 5-10 đoạn liên quan nhất từ hàng ngàn tài liệu.
�ng ngàn tài liệu.
