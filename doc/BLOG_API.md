# Tài Liệu API Blog

## Base URL (URL Cơ Bản)
```
https://api-pawra.purintech.id.vn/api
```

## Xác thực (Authentication)
- Hầu hết endpoints yêu cầu xác thực bằng Bearer token
- Token phải được gửi trong header `Authorization`: `Bearer <token>`

---

## 📚 Mục Lục
1. [Bài Viết Blog](#bài-viết-blog)
2. [Danh Mục Blog](#danh-mục-blog)
3. [Bình Luận Blog](#bình-luận-blog)
4. [Reactions Blog](#reactions-blog)
5. [Endpoints Admin](#endpoints-admin)
6. [Mapping Trạng Thái](#mapping-trạng-thái)
7. [Các Kiểu Dữ Liệu](#các-kiểu-dữ-liệu)

---

## Bài Viết Blog

### Lấy Danh Sách Bài Viết Đã Xuất Bản
```http
GET /api/BlogPosts/published?page={page}&pageSize={pageSize}&categorySlug={categorySlug}
```

**Query Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| page | number | Không | Số trang (mặc định: 1) |
| pageSize | number | Không | Số item mỗi trang (mặc định: 10) |
| categorySlug | string | Không | Lọc theo slug danh mục |

**Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách bài viết đã xuất bản thành công",
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Post Title",
        "slug": "post-slug",
        "content": "HTML content",
        "thumbnailUrl": "https://...",
        "authorAccountId": "uuid",
        "authorName": "Author Name",
        "authorEmail": "email@example.com",
        "status": 1,
        "statusText": "Published",
        "publishedDate": "2026-02-14T07:53:48.038",
        "createdDate": "2026-02-12T05:08:18.0174401",
        "updatedDate": "2026-02-14T07:53:41.7698872",
        "commentsCount": 0,
        "reactionsCount": 0,
        "viewCount": 0
      }
    ],
    "totalItems": 4,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

**Trạng thái:** ✅ **Đã triển khai**

---

### Lấy Bài Viết Theo ID
```http
GET /api/BlogPosts/{id}
```

**Path Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| id | string (UUID) | Có | ID của bài viết |

**Response:**
```json
{
  "success": true,
  "message": "Lấy thông tin bài viết thành công",
  "data": {
    "id": "uuid",
    "title": "Post Title",
    "slug": "post-slug",
    "content": "<p>HTML content...</p>",
    "thumbnailUrl": "https://...",
    "authorAccountId": "uuid",
    "authorName": "Author Name",
    "authorEmail": "email@example.com",
    "status": 1,
    "statusText": "Published",
    "publishedDate": "2026-02-14T07:53:48.038",
    "createdDate": "2026-02-12T05:08:18.0174401",
    "updatedDate": "2026-02-14T07:53:41.7698872",
    "commentsCount": 0,
    "reactionsCount": 0,
    "viewCount": 0
  }
}
```

**Trạng thái:** ✅ **Đã triển khai**

**Ghi chú:**
- Trả về cả bài viết published và draft
- Frontend chuyển đổi `thumbnailUrl` → `imageUrl`
- Frontend chuyển đổi `publishedDate` → `publishedAt`
- Frontend chuyển đổi `status` số → status string

---

### Lấy Bài Viết Theo Slug
```http
GET /api/BlogPosts/slug/{slug}
```

**Path Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| slug | string | Có | Slug của bài viết |

**Response:** Giống như Lấy Bài Viết Theo ID

**Trạng thái:** ✅ **Đã triển khai**

---

### Tạo Bài Viết Mới
```http
POST /api/BlogPosts
```

**Request Body (CreateBlogPostDto):**
```json
{
  "title": "Post Title",
  "slug": "post-slug",
  "content": "<p>HTML content...</p>",
  "thumbnailUrl": "https://..." | null,
  "status": 0 | 1,
  "publishedDate": "2026-02-14T07:53:48.038" | null
}
```

**Trường bắt buộc:**
- `title` (string, không được rỗng)
- `content` (string, không được rỗng)
- `status` (0 = Draft, 1 = Published)

**Trường tùy chọn:**
- `slug` (tự động tạo từ title nếu không cung cấp)
- `thumbnailUrl` (có thể null hoặc rỗng)
- `publishedDate` (chỉ cần khi status = 1)

**Response:**
```json
{
  "success": true,
  "message": "Tạo bài viết thành công",
  "data": {
    "id": "uuid",
    "title": "Post Title",
    // ... other fields
  }
}
```

**Trạng thái:** ✅ **Đã triển khai**

**Ghi chú:**
- Backend **CHƯA** hỗ trợ các trường `categoryId` hoặc `excerpt`
- Frontend đã disable các trường này trong UI

---

### Cập Nhật Bài Viết
```http
PUT /api/BlogPosts/{id}
```

**Path Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| id | string (UUID) | Có | ID của bài viết |

**Request Body (UpdateBlogPostDto):**
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "slug": "updated-slug",
  "content": "<p>Updated content...</p>",
  "thumbnailUrl": "https://..." | null,
  "status": 0 | 1,
  "publishedDate": "2026-02-14T07:53:48.038" | null
}
```

**⚠️ QUAN TRỌNG:**
- Backend **yêu cầu** trường `id` trong request body (ngoài URL path)
- Tất cả các trường từ CreateBlogPostDto cộng thêm `id`

**Trạng thái:** ✅ **Đã triển khai**

---

### Xóa Bài Viết
```http
DELETE /api/BlogPosts/{id}
```

**Path Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| id | string (UUID) | Có | ID của bài viết |

**Response:**
```json
{
  "success": true,
  "message": "Xóa bài viết thành công"
}
```

**Trạng thái:** ✅ **Đã triển khai**

---

### Xuất Bản Bài Viết
```http
PATCH /api/BlogPosts/{id}/publish
```

**Trạng thái:** ❓ **Chưa test** - Endpoint đã implement ở frontend nhưng chưa verify với backend

---

### Hủy Xuất Bản Bài Viết
```http
PATCH /api/BlogPosts/{id}/unpublish
```

**Trạng thái:** ❓ **Chưa test** - Endpoint đã implement ở frontend nhưng chưa verify với backend

---

### Lấy Bài Viết Nổi Bật
```http
GET /api/BlogPosts/featured
```

**Trạng thái:** ❓ **Chưa test**

---

### Lấy Bài Viết Theo Tác Giả
```http
GET /api/BlogPosts/author/{authorId}
```

**Path Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| authorId | string (UUID) | Có | ID tài khoản tác giả |

**Response:** Mảng các bài viết blog (cùng cấu trúc với Lấy Danh Sách Bài Viết Đã Xuất Bản)

**Trạng thái:** ✅ **Đã triển khai**

---

### Lấy Bài Viết Theo Trạng Thái
```http
GET /api/BlogPosts/status/{status}
```

**Path Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| status | number | Có | 0 = Draft, 1 = Published |

**Response:** Mảng các bài viết blog

**Trạng thái:** ✅ **Đã triển khai**

**Ghi chú:**
- Status phải là số (0 hoặc 1), không phải string

---

### Lấy Bài Viết Liên Quan
```http
GET /api/BlogPosts/{slug}/related?limit={limit}
```

**Path Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| slug | string | Có | Slug của bài viết hiện tại |

**Query Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| limit | number | Không | Số bài viết liên quan (mặc định: 3) |

**Response:** Mảng các bài viết liên quan

**Trạng thái:** ✅ **Đã triển khai**

**Ghi chú:**
- Sử dụng **slug** (không phải postId) trong path
- Trả về các bài viết có danh mục hoặc tags tương tự

---

## Danh Mục Blog

### Lấy Tất Cả Danh Mục
```http
GET /api/BlogCategories
```

**Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách danh mục thành công",
  "data": [
    {
      "id": "uuid",
      "name": "Health",
      "slug": "health"
    }
  ]
}
```

**Trạng thái:** ❓ **Endpoint tồn tại** nhưng không được sử dụng (tính năng danh mục đã tắt ở frontend)

---

### Lấy Danh Mục Theo Slug
```http
GET /api/BlogCategories/{slug}
```

**Trạng thái:** ❓ **Không được sử dụng

---

## Bình Luận Blog

### Lấy Bình Luận Của Bài Viết
```http
GET /api/BlogPosts/{postId}/comments
```

**Path Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| postId | string (UUID) | Có | ID của bài viết |

**Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách bình luận thành công",
  "data": [
    {
      "id": "uuid",
      "postId": "uuid",
      "content": "Comment text",
      "authorId": "uuid",
      "authorName": "User Name",
      "createdAt": "2026-02-14T07:53:48.038",
      "parentId": null
    }
  ]
}
```

**Trạng thái:** ✅ **Đã triển khai** (GET endpoint hoạt động)

**Ghi chú:**
- Trả về mảng rỗng nếu không có bình luận
- Frontend hiển thị empty state khi mảng rỗng

---

### Thêm Bình Luận Vào Bài Viết
```http
POST /api/BlogPosts/{postId}/comments
```

**Path Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| postId | string (UUID) | Có | ID của bài viết |

**Request Body (CreateBlogCommentDto):**
```json
{
  "content": "Nội dung bình luận",
  "parentId": "uuid"
}
```

**Trường bắt buộc:**
- `content` (string)

**Trường tùy chọn:**
- `parentId` (uuid) — nếu là reply cho comment khác

**Trạng thái:** ✅ **Đã triển khai** (xác nhận từ Swagger spec)

**Ghi chú:**
- `postId` là **path param**, không để trong body
- Yêu cầu Bearer token (user phải đăng nhập)

---

### Xóa Bình Luận
```http
DELETE /api/blog-comments/{commentId}
```

**Path Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| commentId | string (UUID) | Có | ID bình luận |

**Trạng thái:** ❓ **Chưa test**

---

## Phản Ứng Blog

### Lấy Phản Ứng Của Tôi (Batch)
```http
POST /api/blog-posts/my-reactions
```

**Request Body:**
```json
{
  "postIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uuid1": "like",
    "uuid2": null,
    "uuid3": "love"
  }
}
```

**Trạng thái:** ✅ **Đã triển khai** (batch endpoint hoạt động)

**⚠️ QUAN TRỌNG — Giá trị trả về là reaction TYPE NAME, không phải UUID:**
- `"like"`, `"love"`, `"haha"`, `"wow"`, `"sad"`, `"angry"`
- `null` = user chưa react bài đó
- Frontend phải so sánh giá trị này với reaction type NAME (không phải so với `reactionTypeId`)

---

### Lấy Phản Ứng Của Bài Viết (Một Bài)
```http
GET /api/BlogPosts/{postId}/reactions
```

**Trạng thái:** ✅ **Đã triển khai** (xác nhận từ Swagger spec)

**Response trả về `RawReactionStat[]`:**
```json
[
  { "reactionTypeId": "9D34726A-...", "reactionTypeName": "Like", "count": 5 },
  { "reactionTypeId": "6F3BD810-...", "reactionTypeName": "Love", "count": 2 }
]
```

**Ghi chú:**
- Chỉ trả về các loại reaction có count > 0
- Endpoint trước đó dùng sai path `/blog-reactions/{postId}` đã được sửa

---

### Toggle Phản Ứng
```http
PUT /api/blog-reactions
```

**Request Body (ToggleBlogReactionDto):**
```json
{
  "targetType": "Post",
  "targetId": "uuid",
  "reactionTypeId": "uuid"
}
```

**Trạng thái:** ✅ **Đã triển khai**

**Mapping reactionTypeId (đã xác nhận):**
| Reaction | reactionTypeId |
|----------|----------------|
| like  | `9D34726A-4D87-4154-A01C-C94D09B3A450` |
| love  | `6F3BD810-6C62-4328-8730-26C496FA4EFB` |
| haha  | `C89B5834-F16A-4AF4-86C6-2E9796296124` |
| angry | `FBC01CBB-2836-48CE-B6DD-E43C05399751` |
| sad   | `37931634-3641-4160-9A8D-3729D273108C` |
| wow   | `0C04BB1B-3862-4D51-BEDC-DFCC4AC516C2` |

**Logic toggle:**
- Chưa react → Thêm mới
- Đã react giống → Xóa (toggle off)
- Đã react khác → Cập nhật sang loại mới

---

## Endpoints Quản Trị

### Lấy Thống Kê Quản Trị
```http
GET /api/admin/blog/stats
```

**Xác thực:** Yêu cầu (Bearer token)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalViews": 128430,
    "viewsChange": "+12%",
    "totalPosts": 156,
    "totalComments": 2842,
    "commentsTimeRange": "Last 30 days"
  }
}
```

**Trạng thái:** ❓ **Chưa test** với backend thật

---

### Lấy Danh Sách Bài Viết Quản Trị
```http
GET /api/admin/blog/posts?page={page}&limit={limit}&search={search}&status={status}
```

**Xác thực:** Yêu cầu (Bearer token)

**Query Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| page | number | Không | Số trang (mặc định: 1) |
| limit | number | Không | Số mục mỗi trang (mặc định: 10) |
| search | string | Không | Từ khóa tìm kiếm |
| status | string | Không | Lọc theo trạng thái: "Published", "Draft", hoặc "Scheduled" |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Post Title",
        "slug": "post-slug",
        "thumbnailUrl": "https://...",
        "author": {
          "id": "uuid",
          "name": "Author Name",
          "avatarUrl": "https://..."
        },
        "category": "Category Name",
        "status": 1,
        "statusText": "Published",
        "date": "2023-10-24"
      }
    ],
    "totalItems": 156,
    "page": 1,
    "pageSize": 10,
    "totalPages": 16
  }
}
```

**Trạng thái:** ❓ **Chưa test** với backend thật

**Ghi chú:**
- Backend sử dụng status số (0/1)
- Frontend chuyển đổi sang string ("Draft"/"Published")

---

## Ánh Xạ Trạng Thái

Backend sử dụng **mã trạng thái số**, frontend sử dụng **chuỗi**.

| Số | Chuỗi | Mô tả |
|---------|--------|-------------|
| 0 | Draft | Bài viết chưa xuất bản |
| 1 | Published | Bài viết đã xuất bản |
| 2? | Scheduled | Bài viết đã lẽch (chưa xác nhận) |

**Chuyển Đổi Frontend:**
```typescript
// Backend → Frontend
status === 1 ? 'Published' : 'Draft'

// Frontend → Backend
status === 'Published' ? 1 : 0
```

---

## Các Kiểu Dữ Liệu

### BlogPost (Frontend)
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;              // Chưa lưu trong backend
  content: string;
  imageUrl: string;            // Chuyển đổi từ thumbnailUrl
  thumbnailUrl?: string;       // Trường backend
  author: {
    name: string;
    avatar: string;
    id?: string;
  };
  authorName?: string;         // Trường backend
  authorEmail?: string;        // Trường backend
  authorAccountId?: string;    // Trường backend
  category: string;            // Chưa lưu trong backend
  publishedAt: string;         // Chuyển đổi từ publishedDate
  publishedDate?: string;      // Trường backend
  readTime: number;            // Được frontend tính toán
  status: 'Published' | 'Draft' | 'Scheduled';
  statusText?: string;         // Trường backend
  commentsCount?: number;
  reactionsCount?: number;
  viewCount?: number;
  createdDate?: string;
  updatedDate?: string;
}
```

### BlogCategory
```typescript
type BlogCategory = 'health' | 'nutrition' | 'training' | 'behavior' | 'grooming';
```

**Ghi chú:** Tính năng Category **đã tắt** ở frontend vì backend chưa hỗ trợ `categoryId` trong blog posts.

### BlogComment
```typescript
interface BlogComment {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  parentId?: string | null;
  replies?: BlogComment[];
}
```

### BlogReaction
```typescript
interface BlogReaction {
  postId: string;
  reaction: 'like' | 'love' | 'celebrate' | 'insightful' | 'curious';
  count: number;
  reacted: boolean;
}
```

---

## Các Vấn Đề Thường Gặp & Giải Pháp

### 1. Error Object Rỗng `{}`
**Vấn đề:** API trả về 400/500 nhưng error object rỗng trong logs.

**Giải pháp:** Sử dụng enhanced error handler:
```typescript
catch (error: any) {
  console.error('Error message:', error?.message);
  console.error('Error status:', error?.status);
  console.error('Response data:', error?.response?.data);
  console.error('Response status:', error?.response?.status);
}
```

### 2. Lỗi 404 trên `/BlogPosts/published/{id}`
**Vấn đề:** Frontend thử dùng endpoint không tồn tại.

**Giải pháp:** Sử dụng `/BlogPosts/{id}` thay thế (hoạt động cho cả published và draft posts).

### 3. Cập Nhật Bài Viết Thất Bại Với Hình Ảnh
**Vấn đề:** Backend yêu cầu mapping trường cụ thể.

**Giải pháp:** Đảm bảo UpdateBlogPostDto bao gồm:
- `id` trong request body (ngoài URL)
- `thumbnailUrl` (không phải `imageUrl`)
- `publishedDate` (không phải `publishedAt`)

### 4. Categories Không Hoạt Động
**Vấn đề:** Backend chưa hỗ trợ `categoryId` hoặc `excerpt` trong blog posts.

**Giải pháp:** Frontend tắt các trường này với ghi chú UI. Chờ backend triển khai.

### 5. Reactions Không Hoạt Động
**Vấn đề:** Thiếu mapping reaction type ID.

**Giải pháp:** Cần backend cung cấp danh sách reaction types với UUIDs của chúng.

---

## Danh Sách Kiểm Tra

- [x] GET published blog posts
- [x] GET blog post by ID
- [x] GET blog post by slug
- [x] POST create blog post
- [x] PUT update blog post
- [x] DELETE blog post
- [x] GET post comments
- [x] POST add comment - **✅ Đã triển khai (`POST /api/BlogPosts/{postId}/comments`)**
- [ ] DELETE comment - **Chưa test**
- [x] POST get my reactions (batch)
- [x] GET post reactions (single) - **✅ Đã triển khai (`GET /api/BlogPosts/{postId}/reactions`)**
- [x] PUT toggle reaction
- [ ] GET admin stats - **Chưa test**
- [ ] GET admin posts - **Chưa test**
- [x] PATCH publish post
- [x] PATCH unpublish post
- [x] GET featured posts
- [x] GET related posts (by slug)
- [x] GET posts by author
- [x] GET posts by status

**Chú thích:**
- [x] = Đã test và hoảt động
- [ ] = Chưa test
- ❌ = Xác nhận chưa triển khai trong backend

---

## Lịch Sử Thay Đổi

### 2026-02-14 (Mới nhất)
**Cập Nhật Tài Liệu:**
- ✅ Thêm 2 endpoints thiếu: GET by author, GET by status
- ✅ Sửa Related Posts endpoint: dùng `{slug}` không phải `{postId}`
- ✅ Xác nhận endpoint POST comment KHÔNG tồn tại trong backend (405 trên endpoint chỉ GET)
- ✅ Cập nhật danh sách kiểm tra với trạng thái triển khai hiện tại

**Sửa Lỗi Code (Trước đó):**
- Sửa cập nhật blog post để bao gồm `id` trong request body
- Thay đổi từ `imageUrl` sang `thumbnailUrl` trong các API calls
- Thêm trường `publishedDate` cho các thao tác create/update
- Sửa GET comments endpoint từ `/blog-comments/post/{id}` sang `/BlogPosts/{id}/comments`
- Xóa logic fallback cho `/BlogPosts/published/{id}` (endpoint không tồn tại)
- Sửa getPostById để dùng direct endpoint (không còn lỗi 404)
- Tắt các trường category và excerpt (backend chưa hỗ trợ)
- Cải thiện error logging trong tất cả các blog service methods
- Triển khai multi-endpoint fallback cho POST comment (sẵn sàng khi backend implement)

---

## Liên Hệ Backend Team

**✅ Đã Triển Khai & Hoạt Động:**
1. Blog post CRUD (create, read, update, delete)
2. GET comments cho posts
3. Publish/Unpublish posts
4. Featured posts & Related posts (by slug)
5. Posts by author & by status
6. Batch get user reactions

**❌ Thiếu / Cần:**
1. **POST comment endpoint** - Quan trọng cho user engagement
   - Đề xuất: `POST /api/BlogPosts/{postId}/comments`
   - Frontend sẵn sàng hỗ trợ nhiều patterns
   
2. ~~**GET single post reactions**~~ - ✅ Đã có `GET /api/BlogPosts/{postId}/reactions`

3. ~~**Danh sách Reaction type IDs**~~ - ✅ UUIDs đã được hardcode trong FE

4. **Hỗ trợ Category trong blog posts** - Để tổ chức tốt hơn
   - Thêm trường `categoryId` vào CreateBlogPostDto & UpdateBlogPostDto
   - Frontend đã có category UI sẵn sàng (hiện tại tắt)
   
5. **Trường Excerpt trong blog posts** - Để preview tốt hơn
   - Thêm trường `excerpt` vào blog post DTOs
   - Frontend đã có excerpt field sẵn sàng (hiện tại tắt)

**API Base:** `https://api-pawra.purintech.id.vn/api`
