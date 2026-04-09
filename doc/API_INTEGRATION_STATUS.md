# Yêu Cầu Backend - Pawra Frontend

**Last Updated:** April 9, 2026

> Tài liệu này chỉ liệt kê những vấn đề **Frontend đang chờ Backend** giải quyết.
> Trạng thái tích hợp FE xem tại `doc/BACKEND_API.md`.

---

## ✅ Đã được BE giải quyết (cập nhật April 9, 2026)

### ~~1. `POST /api/v1/Auth/change-password`~~
- ✅ **ĐÃ CÓ** — endpoint tồn tại với `ChangePasswordDto { currentPassword, newPassword, confirmPassword }`
- FE có thể re-enable flow đổi mật khẩu.

---

### ~~2. `GET /api/v1/Auth/profile` — cần confirm response schema~~
- ✅ **ĐÃ DOCUMENT** — Swagger có schema đầy đủ, khớp với yêu cầu FE:
  ```json
  {
    "id": "uuid",
    "customerId": "uuid (chỉ có cho role Customer)",
    "phone": "string (chỉ có cho role Customer)",
    "fullName": "string",
    "email": "string",
    "avatarUrl": "string | null",
    "roleName": "string"
  }
  ```

---

### ~~3. Notification Preferences API~~
- ✅ **ĐÃ CÓ** — 2 endpoint đã tồn tại:
  - `GET /api/v1/Account/{id}/notifications`
  - `PUT /api/v1/Account/{id}/notifications`
- ⚠️ **Lưu ý:** Field names BE implement **khác** với FE đề xuất:
  - BE dùng: `{ emailNotifications, pushNotifications, smsNotifications, appointmentReminders, marketingEmails, systemUpdates }` (all boolean)
  - FE cần cập nhật service để dùng đúng field names này

---

### ~~4. `GET /api/v1/SubscriptionAccount` — cần filter `?accountId=`~~
- ✅ **ĐÃ CÓ** — endpoint mới: `GET /api/v1/SubscriptionAccount/account/{accountId}`
- Trả về danh sách subscriptions theo accountId kèm đầy đủ schema.

---

### ~~6. `WeightGrowthChartDto` — cần confirm response schema~~
- ✅ **ĐÃ DOCUMENT** — Swagger có schema đầy đủ:
  ```json
  {
    "petId": "uuid",
    "petName": "string",
    "species": "string",
    "unit": "kg | lbs",
    "currentWeight": 25.5,
    "minWeight": 20.0,
    "maxWeight": 28.0,
    "dataPoints": [
      {
        "id": "uuid",
        "recordedDate": "YYYY-MM-DD",
        "weight": 22.5,
        "source": "Owner | Vet | Clinic",
        "notes": "string | null"
      }
    ]
  }
  ```

---

### ~~5. Flow tạo Customer sau register~~
- ✅ **ĐÃ CONFIRM** — BE tự động gán role **Customer** và tạo Customer record ngay sau khi đăng ký.
- FE **không cần** gọi thêm `POST /api/v1/Customer/create` sau register.
- Flow đăng ký: `POST /api/Auth/register` → BE tự xử lý tất cả.

---

## ✅ Tất cả yêu cầu đã được BE giải quyết

---

## ⚠️ Mismatch cần FE điều chỉnh

### Notification field names
- FE đề xuất: `{ appointmentReminders, vaccinationAlerts, medicationReminders, promotionalEmails }`
- BE thực tế: `{ emailNotifications, pushNotifications, smsNotifications, appointmentReminders, marketingEmails, systemUpdates }`
- FE cần update `NotificationSettingsDto` và service calls cho phù hợp.
