# Yêu Cầu Backend - Pawra Frontend

**Last Updated:** April 8, 2026

> Tài liệu này chỉ liệt kê những vấn đề **Frontend đang chờ Backend** giải quyết.
> Trạng thái tích hợp FE xem tại `doc/BACKEND_API.md`.

---

## 🔴 Endpoint còn thiếu — cần BE bổ sung

### 1. `POST /api/v1/Auth/change-password`
- **KHÔNG có trong Swagger.**
- FE đã tạm disable flow đổi mật khẩu ở tab account.
- Đề xuất body: `{ currentPassword: string, newPassword: string }`

---

### 2. `GET /api/v1/Auth/profile` — cần confirm response schema
- Swagger không định nghĩa response body rõ ràng.
- FE cần các field sau để hoạt động đúng:

```json
{
  "id": "uuid",
  "customerId": "uuid",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "avatarUrl": "string",
  "roleName": "string"
}
```

---

### 3. Notification Preferences API
- FE hiện dùng `localStorage` làm fallback tạm thời — mất khi đổi thiết bị.
- Đề xuất thêm 2 endpoint:
  - `GET /api/v1/Account/{id}/notifications`
  - `PUT /api/v1/Account/{id}/notifications`
- Body PUT: `{ appointmentReminders, vaccinationAlerts, medicationReminders, promotionalEmails }` (all boolean)

---

### 4. `GET /api/v1/SubscriptionAccount` — cần filter `?accountId=`
- Hiện không có query param → FE phải fetch toàn bộ danh sách rồi filter client-side.
- Đề xuất thêm: `GET /api/v1/SubscriptionAccount?accountId={uuid}`

---

### 5. Flow tạo Customer sau register
- Khi user đăng ký xong, BE có **tự động tạo Customer record** gắn với Account không?
- Nếu **không**, FE cần gọi thủ công `POST /api/v1/Customer/create` ngay sau register — cần xác nhận flow để tránh bug.

---

### 6. `WeightGrowthChartDto` — cần confirm response schema
- Endpoint `GET /api/v1/weight-record/pet/{petId}/chart` có trong Swagger nhưng **không có schema response**.
- FE cần biết shape của data để build chart component.
- Đề xuất response:

```json
{
  "petId": "uuid",
  "petName": "string",
  "unit": "kg | lbs",
  "dataPoints": [
    { "recordedDate": "YYYY-MM-DD", "weight": 4.5, "source": "Owner" }
  ]
}
```
