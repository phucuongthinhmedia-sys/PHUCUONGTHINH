# Requirements Document

## Introduction

Tính năng import hàng loạt sản phẩm từ file PDF catalogue của nhà cung cấp. Hệ thống sử dụng AI (GPT-4 Vision hoặc Claude 3.5 Sonnet) để tự động trích xuất thông tin sản phẩm, sau đó cho phép nhân viên CMS review và chỉnh sửa trước khi tạo sản phẩm vào database. Mục tiêu tiết kiệm 70-80% thời gian so với nhập tay từng sản phẩm.

## Glossary

- **Catalogue_Import**: Module CMS cho phép upload và xử lý file PDF catalogue
- **AI_Extractor**: Service backend gọi AI API để trích xuất thông tin từ PDF
- **Extraction_Job**: Background job xử lý catalogue, chạy async để không block UI
- **Product_Preview**: Giao diện hiển thị danh sách sản phẩm đã trích xuất, cho phép edit trước khi lưu
- **Draft_Product**: Sản phẩm được tạo với trạng thái `is_published = false`, chờ review
- **AI_Provider**: OpenAI GPT-4 Vision hoặc Anthropic Claude 3.5 Sonnet
- **Structured_Output**: JSON schema định nghĩa format output từ AI

## Requirements

### Requirement 1: Upload và Validate Catalogue PDF

**User Story:** Là nhân viên CMS, tôi muốn upload file PDF catalogue, để hệ thống có thể trích xuất thông tin sản phẩm tự động.

#### Acceptance Criteria

1. THE Catalogue_Import SHALL chấp nhận file PDF với kích thước tối đa 50MB
2. WHEN file được upload, THE System SHALL validate định dạng file là PDF hợp lệ
3. WHEN file hợp lệ, THE System SHALL lưu file vào storage (S3 hoặc local) và tạo bản ghi Import Job
4. THE System SHALL hiển thị thông tin file: tên, kích thước, số trang
5. IF file không phải PDF hoặc vượt quá 50MB, THEN THE System SHALL hiển thị lỗi rõ ràng và không xử lý

### Requirement 2: Trích Xuất Thông Tin Bằng AI

**User Story:** Là nhân viên CMS, tôi muốn hệ thống tự động trích xuất thông tin sản phẩm từ catalogue, để không phải nhập tay từng sản phẩm.

#### Acceptance Criteria

1. WHEN Import Job được tạo, THE AI_Extractor SHALL chuyển đổi mỗi trang PDF thành ảnh (PNG/JPEG)
2. WHEN ảnh được tạo, THE AI_Extractor SHALL gọi AI_Provider API với prompt có cấu trúc để trích xuất thông tin
3. THE AI_Extractor SHALL yêu cầu AI trả về JSON theo schema chuẩn: `{ products: [{ name, sku, description, category, specs, price, images }] }`
4. WHEN AI trả về kết quả, THE System SHALL parse JSON và lưu vào bảng tạm (staging table)
5. THE System SHALL xử lý từng trang tuần tự và cập nhật progress (0-100%)
6. IF AI API trả về lỗi hoặc timeout, THEN THE System SHALL retry tối đa 3 lần, sau đó đánh dấu trang đó là failed

### Requirement 3: Hiển Thị Preview Grid Sản Phẩm

**User Story:** Là nhân viên CMS, tôi muốn xem danh sách sản phẩm đã trích xuất dưới dạng grid, để có thể review nhanh trước khi lưu.

#### Acceptance Criteria

1. WHEN extraction hoàn tất, THE Product_Preview SHALL hiển thị grid các sản phẩm với thumbnail, tên, SKU, giá
2. THE Product_Preview SHALL hiển thị trạng thái của mỗi sản phẩm: valid (xanh), warning (vàng - thiếu thông tin), error (đỏ - lỗi validation)
3. THE Product_Preview SHALL cho phép click vào từng sản phẩm để xem chi tiết và chỉnh sửa
4. THE Product_Preview SHALL hiển thị tổng số sản phẩm trích xuất được và số sản phẩm có vấn đề
5. THE Product_Preview SHALL có nút "Select All" và checkbox từng sản phẩm để chọn sản phẩm nào sẽ import

### Requirement 4: Chỉnh Sửa Sản Phẩm Trước Khi Import

**User Story:** Là nhân viên CMS, tôi muốn chỉnh sửa thông tin sản phẩm ngay trong preview, để sửa lỗi AI trước khi tạo sản phẩm.

#### Acceptance Criteria

1. WHEN click vào sản phẩm trong grid, THE System SHALL mở modal hoặc side panel với form edit
2. THE Edit Form SHALL hiển thị tất cả trường: tên, SKU, mô tả, danh mục, thông số kỹ thuật, giá
3. THE Edit Form SHALL validate dữ liệu real-time (tên bắt buộc, SKU unique, giá > 0)
4. WHEN user lưu thay đổi, THE System SHALL cập nhật dữ liệu trong staging table
5. THE System SHALL highlight các trường đã được chỉnh sửa bởi user (khác với AI output)

### Requirement 5: Ánh Xạ Danh Mục Tự Động

**User Story:** Là nhân viên CMS, tôi muốn hệ thống tự động gợi ý danh mục phù hợp cho sản phẩm, để không phải chọn thủ công từng sản phẩm.

#### Acceptance Criteria

1. WHEN AI trích xuất tên sản phẩm, THE System SHALL tự động match với danh mục hiện có dựa trên keywords
2. THE System SHALL sử dụng mapping rules: "gạch" → Gạch Ốp Lát, "lavabo" → Thiết Bị Vệ Sinh, "keo" → Vật Liệu Phụ Trợ
3. WHERE không match được danh mục, THE System SHALL để trống và đánh dấu warning
4. THE Edit Form SHALL cho phép user chọn lại danh mục từ dropdown
5. THE System SHALL học từ user corrections để cải thiện mapping cho lần sau (optional - có thể bỏ trong MVP)

### Requirement 6: Bulk Create Products

**User Story:** Là nhân viên CMS, tôi muốn tạo hàng loạt sản phẩm đã review vào database, để chúng xuất hiện trong hệ thống.

#### Acceptance Criteria

1. WHEN user click "Import Selected", THE System SHALL tạo sản phẩm cho tất cả items được chọn
2. THE System SHALL tạo sản phẩm ở trạng thái draft (`is_published = false`)
3. WHEN tạo sản phẩm, THE System SHALL validate SKU không trùng với sản phẩm hiện có
4. THE System SHALL hiển thị progress bar trong quá trình tạo (X/Y products created)
5. WHEN hoàn tất, THE System SHALL hiển thị summary: số sản phẩm thành công, số sản phẩm lỗi (với lý do)
6. THE System SHALL redirect về trang danh sách sản phẩm với filter "Draft" để user có thể review và publish từng sản phẩm
7. IF có sản phẩm lỗi (SKU trùng, validation fail), THEN THE System SHALL giữ lại trong preview để user sửa và retry

### Requirement 7: Theo Dõi Trạng Thái Job

**User Story:** Là nhân viên CMS, tôi muốn theo dõi tiến trình xử lý catalogue, để biết khi nào có thể review sản phẩm.

#### Acceptance Criteria

1. THE System SHALL hiển thị danh sách Import Jobs với trạng thái: pending, processing, completed, failed
2. WHEN job đang chạy, THE System SHALL hiển thị progress bar và số trang đã xử lý
3. THE System SHALL ước tính thời gian còn lại dựa trên tốc độ xử lý trung bình
4. WHEN job hoàn tất, THE System SHALL gửi notification (toast hoặc browser notification)
5. THE System SHALL lưu lịch sử các job đã chạy với thông tin: file name, số sản phẩm trích xuất, thời gian, user

### Requirement 8: Xử Lý Lỗi và Retry

**User Story:** Là nhân viên CMS, tôi muốn hệ thống xử lý lỗi một cách graceful, để không mất dữ liệu khi có sự cố.

#### Acceptance Criteria

1. IF AI API timeout hoặc rate limit, THEN THE System SHALL retry với exponential backoff (1s, 2s, 4s)
2. IF job fail sau 3 retries, THEN THE System SHALL lưu lại trang bị lỗi và cho phép user retry thủ công
3. THE System SHALL lưu raw AI response vào database để debug khi cần
4. IF user đóng browser trong khi job đang chạy, THEN THE System SHALL tiếp tục xử lý ở background
5. WHEN user quay lại, THE System SHALL hiển thị đúng trạng thái job hiện tại
