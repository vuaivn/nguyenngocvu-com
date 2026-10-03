---
title: "Neural Architecture Search: Tự Động Thiết Kế Mô Hình AI Tối Ưu"
description: "NAS tự động tìm kiếm kiến trúc mạng neural tốt nhất thay vì thiết kế thủ công. Phương pháp RL, gradient-based, evolutionary và ứng dụng thực tế."
pubDate: 2026-10-03
category: "cong-nghe"
tags: ["neural-architecture-search", "nas", "automl", "deep-learning", "model-optimization"]
heroImage: "/images/posts/hero-neural-architecture-search-tu-dong-thiet-ke-mo-hinh-ai.webp"
heroAlt: "Biểu đồ minh họa quá trình Neural Architecture Search tự động tìm kiếm kiến trúc mạng neural tối ưu"
draft: false
faq:
  - q: "Neural Architecture Search (NAS) khác gì với thiết kế mạng neural thủ công?"
    a: "NAS tự động tìm kiếm kiến trúc tối ưu trong không gian thiết kế khổng lồ (hàng tỷ cấu hình), trong khi thiết kế thủ công phụ thuộc kinh nghiệm chuyên gia và thử-sai. NAS có thể khám phá các kiến trúc mới mà con người chưa nghĩ tới, nhưng cần nhiều tài nguyên tính toán hơn."
  - q: "Phương pháp NAS nào phù hợp cho dự án startup với ngân sách hạn chế?"
    a: "One-Shot NAS (DARTS, ENAS) hoặc NAS dựa trên gradient là lựa chọn tốt — chỉ cần 1 GPU và vài giờ thay vì hàng trăm GPU-ngày. Hoặc dùng pretrained search space (NASNet, EfficientNet) rồi fine-tune, tiết kiệm 90% chi phí so với search từ đầu."
  - q: "NAS có thực sự cần thiết hay chỉ là hype trong nghiên cứu?"
    a: "NAS đã chứng minh giá trị thực tế: EfficientNet (tìm bằng NAS) đạt SOTA ImageNet với ít tham số hơn 8.4x so với GPipe; MobileNetV3 (NAS) chạy nhanh hơn 20% trên điện thoại. Doanh nghiệp như Google, Facebook đang dùng NAS cho production models. Không phải hype — là công cụ tối ưu có chi phí rõ ràng."
---

**Neural Architecture Search (NAS) là kỹ thuật tự động tìm kiếm kiến trúc mạng neural tối ưu cho một bài toán cụ thể, thay thế quy trình thiết kế thủ công tốn thời gian. NAS duyệt không gian thiết kế khổng lồ (hàng tỷ cấu hình) bằng thuật toán tối ưu — reinforcement learning, gradient-based, hay evolutionary — để khám phá kiến trúc đạt độ chính xác cao nhất với ràng buộc về tốc độ, kích thước hay năng lượng. Công nghệ này đã tạo ra các model SOTA như EfficientNet, MobileNetV3, giúp triển khai AI trên thiết bị edge hiệu quả hơn.**

## Neural Architecture Search giải quyết vấn đề gì?

Thiết kế mạng neural truyền thống phụ thuộc vào kinh nghiệm chuyên gia và thử-sai: chọn số lớp, loại activation, kết nối skip, rồi train-đánh giá-điều chỉnh trong vòng lặp dài. Với không gian thiết kế có hàng tỷ cấu hình khả thi (số lớp từ 10-100, mỗi lớp có 5-10 loại operation, kết nối đa dạng), thử thủ công chỉ phủ được một phần tỷ lệ nhỏ.

NAS tự động hóa quy trình này bằng cách:
- **Định nghĩa search space**: tập hợp các thành phần có thể (convolution, pooling, skip connection, attention) và cách ghép chúng (cell-based, chain-based).
- **Chiến lược search**: thuật toán duyệt không gian này thông minh — không phải brute-force.
- **Đánh giá hiệu năng**: train mỗi kiến trúc ứng viên (hoặc proxy của nó) rồi đo accuracy/latency/size.
- **Tối ưu mục tiêu**: tìm kiến trúc đạt accuracy cao nhất trong ràng buộc (ví dụ: <5M parameters, <100ms inference trên mobile).

Kết quả: model tốt hơn thiết kế thủ công (EfficientNet-B7 đạt 84.4% top-1 ImageNet, vượt ResNet-152 mà nhỏ hơn) hoặc phù hợp hơn với hardware cụ thể (MobileNetV3 tối ưu cho ARM chip).

## Ba phương pháp NAS chính: RL, Gradient-Based, Evolutionary

### 1. Reinforcement Learning-based NAS (NASNet, ENAS)

**Cơ chế**: Coi việc thiết kế kiến trúc là bài toán quyết định tuần tự. Controller (RNN) sinh ra chuỗi token mô tả kiến trúc (ví dụ: "conv3x3 → batchnorm → relu → maxpool"), train kiến trúc đó rồi dùng validation accuracy làm reward signal. Controller học policy để sinh kiến trúc tốt hơn qua thuật toán REINFORCE.

**Ưu điểm**: Linh hoạt, có thể khám phá kiến trúc hoàn toàn mới (không bị giới hạn bởi gradient của search space).

**Nhược điểm**: Cực kỳ tốn kém — NASNet gốc dùng 500 GPU trong 4 ngày. ENAS cải thiện bằng weight sharing (các kiến trúc ứng viên dùng chung trọng số), giảm xuống 1 GPU trong 16 giờ.

**Khi nào dùng**: Khi bạn cần khám phá kiến trúc đột phá, có ngân sách GPU lớn, và bài toán đủ quan trọng để đầu tư (ví dụ: model nền tảng cho cả công ty).

### 2. Gradient-Based NAS (DARTS, PC-DARTS)

**Cơ chế**: Biến search space rời rạc thành liên tục bằng cách gán trọng số α cho mỗi operation. Mỗi edge trong kiến trúc là tổng có trọng số của tất cả operations khả thi: `output = Σ(α_i * operation_i(input))`. Tối ưu đồng thời α (architecture parameters) và w (network weights) bằng gradient descent. Sau khi hội tụ, giữ lại operation có α lớn nhất ở mỗi edge.

**Ưu điểm**: Nhanh (vài giờ trên 1 GPU), hiệu quả bộ nhớ, dễ implement.

**Nhược điểm**: Search space bị giới hạn (chỉ các operation khả vi), có thể bị overfitting vào validation set (PC-DARTS khắc phục bằng partial channel connections).

**Khi nào dùng**: Startup hoặc nhóm nhỏ với GPU hạn chế, cần model tốt nhanh, hoặc khi search space đã được định nghĩa sẵn (cell-based như trong [MLOps](/blog/mlops-van-hanh-mo-hinh-machine-learning-production/) pipeline).

### 3. Evolutionary Algorithms (AmoebaNet, RegNet)

**Cơ chế**: Duy trì population các kiến trúc, mỗi thế hệ chọn parent tốt nhất (dựa trên accuracy), tạo offspring bằng mutation (thêm/xóa lớp, đổi operation) và crossover (kết hợp hai kiến trúc), loại bỏ individual yếu nhất. Lặp lại đến khi hội tụ.

**Ưu điểm**: Robust, dễ song song hóa (mỗi individual train độc lập), không cần gradient (phù hợp với discrete search space phức tạp).

**Nhược điểm**: Cần đánh giá nhiều kiến trúc (hàng nghìn), tốn tài nguyên nếu không có weight sharing hay predictor.

**Khi nào dùng**: Khi search space rất lớn và phức tạp, bạn có cụm GPU để chạy song song, hoặc kết hợp với surrogate model dự đoán accuracy (không train đầy đủ mỗi ứng viên).

## Ứng dụng thực tế của NAS

### Tối ưu model cho mobile và edge devices

[Edge AI](/blog/edge-ai-trien-khai-thiet-bi-dau-cuoi/) đặt ra ràng buộc nghiêm ngặt: latency <100ms, <10MB model size, năng lượng thấp. NAS với multi-objective optimization (accuracy + latency + size) tự động tìm trade-off tốt nhất:

- **MobileNetV3**: Google dùng platform-aware NAS (đo latency thật trên Pixel phone) để tìm kiến trúc nhanh hơn MobileNetV2 20% với cùng accuracy. Các operation được chọn dựa trên profiling hardware (h-swish activation nhanh hơn swish trên ARM).
- **EfficientNet**: Compound scaling (đồng thời scale depth, width, resolution) được tìm bằng NAS, sau đó scale từ B0 → B7. EfficientNet-B0 đạt 77.1% top-1 ImageNet với 5.3M params, nhỏ hơn ResNet-50 gấp 5 lần.

Quy trình: định nghĩa search space với operations ARM-friendly (depthwise conv, inverted residual) → NAS với latency predictor (học từ profiling data, không cần train full mỗi model) → tìm kiến trúc Pareto-optimal (không có model nào khác tốt hơn cả accuracy lẫn latency).

### Tăng tốc research và transfer learning

Thay vì thiết kế kiến trúc từ đầu cho mỗi domain, NAS tìm kiếm cell (khối building block) trên dataset lớn (ImageNet), sau đó stack cell đó cho các bài toán khác:

- **NASNet cell** (tìm trên CIFAR-10): stack lên thành NASNet-A cho ImageNet, đạt 82.7% top-1 (SOTA năm 2017).
- **Transfer to object detection**: Dùng backbone tìm bằng NAS (EfficientNet) cho Faster R-CNN, tăng mAP lên 3-5 điểm so với ResNet backbone mà inference nhanh hơn.

Lợi ích: một lần search tốn kém, tái sử dụng cho nhiều task. Đây chính là lý do các pretrained NAS models (EfficientNet, MobileNetV3) phổ biến trên HuggingFace và TensorFlow Hub.

### Kết hợp với [AI Model Compression](/blog/ai-model-compression-nen-mo-hinh-ai-hieu-qua/)

NAS và compression (quantization, pruning) bổ trợ nhau:
- **NAS-aware quantization**: Thay vì quantize model thiết kế thủ công (có thể drop accuracy mạnh), NAS tìm kiến trúc robust với quantization INT8 ngay từ đầu. Ví dụ: MobileNetV3 INT8 chỉ giảm 0.3% accuracy nhờ search space đã tối ưu cho hardware quantized ops.
- **Joint search**: Một số phương pháp NAS tìm đồng thời kiến trúc và pruning mask (APQ, HAQ) — output là model đã nén sẵn, không cần bước compression riêng.

Kết quả: model vừa tối ưu kiến trúc vừa tối ưu kích thước/tốc độ, triển khai trực tiếp lên production.

## Thách thức và xu hướng mới

**Chi phí tính toán** từng là rào cản lớn. NAS ban đầu cần hàng trăm GPU-ngày — xa xỉ với hầu hết đội nhóm. Nhưng các cải tiến đã thay đổi cuộc chơi:

- **Weight sharing** (ENAS, DARTS): Kiến trúc ứng viên dùng chung supernet thay vì train riêng. Kết quả? Giảm 100x thời gian.
- **Early stopping predictor**: Dự đoán accuracy cuối từ vài epoch đầu, loại kiến trúc kém ngay từ sớm. Không lãng phí GPU cho ứng viên tệ.
- **Zero-cost proxies**: Đánh giá kiến trúc bằng gradient metrics (NWOT, Synflow) mà không cần train. Tăng tốc 10,000x — đột phá cho nghiên cứu nhanh.

**Overfitting vào search space**: Kiến trúc tìm được chỉ tốt nếu search space định nghĩa đúng. Xu hướng: **search space meta-learning** — học search space tốt từ nhiều task trước, sau đó NAS trên space đó cho task mới.

**Fairness và reproducibility**: Các nghiên cứu so sánh NAS trên search space khác nhau, khó đánh giá. NAS-Bench-101/201/301 cung cấp tabular data (kiến trúc → accuracy) để benchmark công bằng mà không tốn GPU.

**AutoML end-to-end**: NAS mở rộng thành AutoML — tự động data augmentation, hyperparameter tuning, NAS architecture cùng lúc (Google AutoML, H2O Driverless AI).

## Công cụ và framework NAS

- **NNI (Neural Network Intelligence)**: Microsoft open-source, hỗ trợ NAS (ENAS, DARTS, ProxylessNAS) + HPO + model compression. Dễ integrate với PyTorch/TensorFlow.
- **AutoKeras**: Keras-style API, NAS tự động cho image/text/tabular data — người dùng chỉ gọi `clf.fit(X, y)`.
- **NATS-Bench**: Benchmark suite với 15,625 kiến trúc đã train sẵn trên CIFAR-10/100/ImageNet-16, dùng để test thuật toán NAS mà không tốn GPU.
- **TorchVision NAS models**: EfficientNet, MobileNetV3, RegNet pretrained — dùng trực tiếp cho transfer learning.

Lời khuyên thực tế: nhóm nhỏ đừng mơ search từ đầu. Bắt đầu với **pretrained NAS models** (EfficientNet, MobileNetV3) để transfer learning — đã có sẵn, đã tối ưu, zero GPU cost. Hoặc thử **DARTS trên NNI** nếu muốn tự search — chỉ 1 GPU, vài giờ, đủ để học.

Công ty lớn hơn? Lúc đó mới đầu tư platform-aware NAS — đo latency thật trên hardware mục tiêu (Pixel phone, Tesla chip), tìm model production tối ưu cho chính xác nền tảng bạn dùng. Đắt, nhưng đáng.

**Đọc thêm:**

- [AI Model Compression: Nén Mô Hình AI Hiệu Quả](/blog/ai-model-compression-nen-mo-hinh-ai-hieu-qua/) — NAS kết hợp quantization/pruning để model vừa tối ưu kiến trúc vừa giảm kích thước, triển khai trực tiếp lên thiết bị nhúng mà không cần bước nén riêng.
- [Edge AI: Triển Khai AI Trên Thiết Bị Đầu Cuối](/blog/edge-ai-trien-khai-thiet-bi-dau-cuoi/) — NAS với ràng buộc latency/năng lượng giúp tìm model phù hợp cho điện thoại, IoT, camera, nơi tài nguyên hạn chế nhưng yêu cầu realtime cao.
- [MLOps: Vận Hành Mô Hình Machine Learning Trong Production](/blog/mlops-van-hanh-mo-hinh-machine-learning-production/) — Tích hợp NAS vào pipeline MLOps để tự động tái tìm kiếm kiến trúc khi dữ liệu thay đổi, giữ model luôn tối ưu mà không cần can thiệp thủ công.
