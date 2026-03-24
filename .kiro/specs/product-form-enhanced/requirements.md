# Requirements Document

## Introduction

Nâng cấp form đăng/sửa sản phẩm trong CMS thành một giao diện đầy đủ tính năng cho nhân viên quản lý kho vật liệu xây dựng B2B. Form cần hỗ trợ upload media (ảnh/video), gán link từ mạng xã hội, chọn danh mục theo cấu trúc MegaMenu, nhập giá cả, và bảng thông số kỹ thuật có cấu trúc theo loại sản phẩm.

## Glossary

- **Product_Form**: Giao diện CMS để tạo mới hoặc chỉnh sửa sản phẩm
- **Media_Uploader**: Component xử lý upload file ảnh/video lên S3 qua presigned URL
- **Social_Link**: URL từ mạng xã hội (Pinterest, Instagram, Houzz) gán vào sản phẩm như media tham chiếu
- **Category_Picker**: Component chọn danh mục theo cấu trúc phân cấp 2 cấp (nhóm → danh mục con)
- **Price_Section**: Phần nhập giá bán lẻ, giá đại lý, đơn vị tính
- **Spec_Table**: Bảng thông số kỹ thuật có template theo loại sản phẩm (gạch, thiết bị vệ sinh, v.v.)
- **CMS**: Content Management System tại port 3002
- **Backend**: NestJS API tại port 3001

## Requirements

### Requirement 1: Upload Media (Ảnh & Video)

**User Story:** Là nhân viên CMS, tôi muốn upload ảnh và video trực tiếp từ form, để sản phẩm có hình ảnh minh họa ngay khi đăng.

#### Acceptance Criteria

1. WHEN người dùng kéo thả hoặc chọn file, THE Media_Uploader SHALL chấp nhận các định dạng ảnh (jpg, png, webp) và video (mp4, mov) tối đa 50MB mỗi file
2. WHEN file được chọn, THE Media_Uploader SHALL hiển thị preview thumbnail trước khi upload
3. WHEN người dùng xác nhận upload, THE Media_Uploader SHALL gọi presigned URL endpoint rồi PUT file trực tiếp lên S3
4. WHEN upload hoàn tất, THE Media_Uploader SHALL tự động tạo bản ghi Media trong database với đúng `media_type` (lifestyle/cutout/video)
5. WHEN có nhiều ảnh, THE Media_Uploader SHALL cho phép kéo thả để sắp xếp thứ tự (sort_order)
6. WHEN người dùng chọn ảnh bìa, THE Media_Uploader SHALL đánh dấu `is_cover = true` và bỏ đánh dấu các ảnh khác
7. IF file vượt quá 50MB hoặc sai định dạng, THEN THE Media_Uploader SHALL hiển thị thông báo lỗi rõ ràng và không upload

### Requirement 2: Gán Link Mạng Xã Hội

**User Story:** Là nhân viên CMS, tôi muốn gán link Pinterest/Instagram/Houzz vào sản phẩm, để khách hàng thấy sản phẩm được dùng trong các dự án thực tế.

#### Acceptance Criteria

1. WHEN người dùng nhập URL mạng xã hội, THE Product_Form SHALL validate đây là URL hợp lệ từ các domain được phép (pinterest.com, instagram.com, houzz.com, facebook.com)
2. WHEN URL hợp lệ được thêm, THE Product_Form SHALL lưu vào bảng Media với `media_type = "social_link"` và `file_url = URL`
3. WHEN hiển thị danh sách social links, THE Product_Form SHALL show icon của từng platform tương ứng
4. IF URL không thuộc domain được phép, THEN THE Product_Form SHALL hiển thị lỗi validation

### Requirement 3: Chọn Danh Mục Theo Cấu Trúc MegaMenu

**User Story:** Là nhân viên CMS, tôi muốn chọn danh mục theo cấu trúc phân cấp giống MegaMenu frontend, để sản phẩm được phân loại đúng và hiển thị đúng chỗ.

#### Acceptance Criteria

1. THE Category_Picker SHALL hiển thị danh mục theo 2 cấp: nhóm lớn (parent) và danh mục con (children)
2. WHEN người dùng click vào nhóm lớn, THE Category_Picker SHALL mở rộng để hiển thị các danh mục con
3. WHEN người dùng chọn danh mục con, THE Category_Picker SHALL cập nhật `category_id` trong form và hiển thị breadcrumb "Nhóm > Danh mục"
4. THE Category_Picker SHALL ánh xạ đúng với cấu trúc MegaMenu: Gạch Tấm Lớn, Gạch Ốp Lát & Trang Trí, Hệ Thiết Bị Vệ Sinh & Bếp, Vật Liệu Phụ Trợ & Gia Công
5. IF danh mục chưa tồn tại trong database, THEN THE Category_Picker SHALL hiển thị tùy chọn tạo mới inline

### Requirement 4: Nhập Giá Cả

**User Story:** Là nhân viên CMS, tôi muốn nhập giá bán và đơn vị tính cho sản phẩm, để khách hàng và đại lý biết mức giá tham khảo.

#### Acceptance Criteria

1. THE Price_Section SHALL cung cấp các trường: giá bán lẻ (VNĐ), giá đại lý (VNĐ, optional), đơn vị tính (m², viên, bộ, cái)
2. WHEN người dùng nhập giá, THE Price_Section SHALL format số tự động với dấu phân cách hàng nghìn (1.500.000)
3. THE Price_Section SHALL lưu giá vào `technical_specs` dưới key chuẩn: `{ price_retail, price_dealer, unit }`
4. WHERE giá đại lý được nhập, THE Price_Section SHALL validate giá đại lý không cao hơn giá bán lẻ
5. THE Price_Section SHALL hỗ trợ trường "Ghi chú giá" (ví dụ: "Giá chưa bao gồm VAT", "Liên hệ để có giá tốt nhất")

### Requirement 5: Bảng Thông Số Kỹ Thuật Có Cấu Trúc

**User Story:** Là nhân viên CMS, tôi muốn nhập thông số kỹ thuật theo template có sẵn theo loại sản phẩm, để thông tin được chuẩn hóa và dễ so sánh.

#### Acceptance Criteria

1. WHEN người dùng chọn danh mục, THE Spec_Table SHALL tự động load template thông số phù hợp với loại sản phẩm đó
2. THE Spec_Table SHALL cung cấp template cho các nhóm: Gạch (kích thước, độ dày, độ hút nước, độ cứng bề mặt, xuất xứ), Thiết Bị Vệ Sinh (chất liệu, màu sắc, kích thước lắp đặt, công nghệ, xuất xứ), Vật Liệu Phụ Trợ (thành phần, đóng gói, thời gian đông cứng)
3. WHEN template được load, THE Spec_Table SHALL hiển thị các trường có label tiếng Việt, input phù hợp (text, number, select), và placeholder gợi ý
4. THE Spec_Table SHALL cho phép thêm thông số tùy chỉnh ngoài template (key-value tự do)
5. WHEN lưu form, THE Spec_Table SHALL merge template specs và custom specs vào `technical_specs` JSON
6. THE Spec_Table SHALL hiển thị các trường đã điền với visual rõ ràng, phân biệt trường bắt buộc và tùy chọn

### Requirement 6: Trải Nghiệm Form Tổng Thể

**User Story:** Là nhân viên CMS, tôi muốn form có layout rõ ràng theo từng section, để việc nhập liệu nhanh và không bỏ sót thông tin.

#### Acceptance Criteria

1. THE Product_Form SHALL tổ chức theo các tab hoặc section có tiêu đề: Thông tin cơ bản, Media & Hình ảnh, Giá cả, Thông số kỹ thuật, Tags & Phân loại
2. WHEN người dùng submit form với trường bắt buộc còn trống, THE Product_Form SHALL scroll đến trường lỗi đầu tiên và highlight nó
3. THE Product_Form SHALL hiển thị trạng thái "Đang lưu..." với spinner trong khi gọi API
4. WHEN lưu thành công, THE Product_Form SHALL hiển thị toast notification "Đã lưu sản phẩm" và redirect về danh sách
5. THE Product_Form SHALL hỗ trợ chế độ edit (load dữ liệu hiện có) và chế độ create (form trống)
