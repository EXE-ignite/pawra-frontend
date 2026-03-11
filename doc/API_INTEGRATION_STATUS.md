# API Integration Status - Pawra Frontend

**Last Updated:** March 11, 2026

---

## Tổng Quan

Tài liệu này theo dõi trạng thái tích hợp API giữa Frontend và Backend.

### Chú thích:
- ✅ **Đã kết nối** - API đã được tích hợp và hoạt động
- 🔄 **Mock Data** - Đang dùng dữ liệu giả, cần chuyển sang API thật
- ❌ **Chưa có** - Chưa có service, cần tạo mới
- ⏳ **Đang phát triển** - Đang trong quá trình phát triển

### Cấu hình:
- `NEXT_PUBLIC_USE_MOCK=false` — **Đã chuyển sang real API**
- Mock data vẫn giữ lại trong services để fallback khi cần dev offline

---

## 1. Authentication & Account (Module: shared)

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------|
| `POST /api/Auth/login` | ✅ | `auth.service.ts` | Hoạt động |
| `POST /api/Auth/register` | ✅ | `auth.service.ts` | Hoạt động |
| `POST /api/Auth/logout` | ✅ | `auth.service.ts` | Hoạt động |
| `GET /api/Auth/profile` | ✅ | `auth.service.ts` | Hoạt động |
| `POST /api/Auth/google/callback` | ✅ | `auth.service.ts` | Google OAuth |
| `POST /api/Auth/facebook/callback` | ❌ | - | Cần thêm |
| `GET /api/Account` | ✅ | `user.service.ts` | Admin only - filter/paginate client-side; `roleName` trả đúng sau backend fix (11/03/2026) |
| `POST /api/Account` | ❌ | - | Admin only |
| `PUT /api/Account/{id}` | ✅ | `user.service.ts` | Update role/status |
| `DELETE /api/Account/{id}` | ✅ | `user.service.ts` | Admin only |
| `GET /api/AccountRole` | ✅ | `user.service.ts` | Lấy danh sách roles để map `roleId → roleName`; dùng `?pageSize=100` |

---

## 2. Blog (Module: blog)

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------|
| `GET /api/BlogPosts/published` | ✅ | `blog-post.service.ts` | Public |
| `GET /api/BlogPosts/slug/{slug}` | ✅ | `blog-post.service.ts` | Public |
| `GET /api/BlogPosts/featured` | ✅ | `blog-post.service.ts` | Public |
| `GET /api/BlogPosts/{slug}/related` | ✅ | `blog-post.service.ts` | Public |
| `GET /api/BlogCategories` | ✅ | `blog-category.service.ts` | Public |
| `GET /api/BlogCategories/{slug}` | ✅ | `blog-category.service.ts` | Public |
| `GET /api/BlogPosts/{postId}/reactions` | ✅ | `blog-reaction.service.ts` | |
| `GET /api/BlogPosts/{postId}/comments` | ✅ | `blog-comment.service.ts` | |
| `POST /api/BlogPosts/{postId}/comments` | ✅ | `blog-comment.service.ts` | Auth required |
| `DELETE /api/blog-comments/{commentId}` | ✅ | `blog-comment.service.ts` | Auth required |
| `PUT /api/blog-reactions` | ✅ | `blog-reaction.service.ts` | Toggle reaction |
| `POST /api/blog-posts/my-reactions` | ✅ | `blog-reaction.service.ts` | Batch get |
| `GET /api/BlogPosts` | ✅ | `blog-post.service.ts` | Admin |
| `POST /api/BlogPosts` | ✅ | `blog-post.service.ts` | Admin |
| `PUT /api/BlogPosts/{id}` | ✅ | `blog-post.service.ts` | Admin |
| `DELETE /api/BlogPosts/{id}` | ✅ | `blog-post.service.ts` | Admin |
| `PATCH /api/BlogPosts/{id}/publish` | ✅ | `blog-post.service.ts` | Admin |
| `PATCH /api/BlogPosts/{id}/unpublish` | ✅ | `blog-post.service.ts` | Admin |
| `GET /api/admin/blog/stats` | ✅ | `blog-admin.service.ts` | Admin |
| `GET /api/admin/blog/posts` | ✅ | `blog-admin.service.ts` | Admin filtered |

---

## 3. Pets (Module: pet-owner) - ✅ HOÀN THÀNH

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------||
| `POST /api/Pet/create` | ✅ | `pet.service.ts` | Đã tích hợp |
| `GET /api/Pet/{id}` | ✅ | `pet.service.ts` | Đã tích hợp |
| `PUT /api/Pet/update/{id}` | ✅ | `pet.service.ts` | Đã tích hợp |
| `DELETE /api/Pet/{id}` | ✅ | `pet.service.ts` | Đã tích hợp |
| `GET /api/Pet` | ✅ | `pet.service.ts` | Filter theo JWT token |

### Các function có sẵn trong `petService`:
- `getUserPets()` - Lấy danh sách thú cưng của user (BE filter theo JWT)
- `getPetById(id)` - Chi tiết thú cưng
- `getPetProfile(petId)` - Full profile (pet + vaccinations)
- `createPet(data)` - Thêm thú cưng mới
- `updatePet(id, data)` - Cập nhật thú cưng
- `deletePet(id)` - Xóa thú cưng

### PetDto mở rộng (BE đã bổ sung):
- `weight`, `imageUrl`, `color`, `microchipId`, `insurance`, `description`

**Config:** `NEXT_PUBLIC_USE_MOCK=true` để dùng mock data khi dev offline.

---

## 4. Appointments (Module: pet-owner) - ✅ HOÀN THÀNH

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------||
| `POST /api/Appointment/create` | ✅ | `appointment.service.ts` | Đã tích hợp |
| `GET /api/Appointment/{id}` | ✅ | `appointment.service.ts` | Đã tích hợp |
| `PUT /api/Appointment/update/{id}` | ✅ | `appointment.service.ts` | Đã tích hợp |
| `DELETE /api/Appointment/{id}` | ✅ | `appointment.service.ts` | Đã tích hợp |
| `GET /api/Appointment` | ✅ | `appointment.service.ts` | Filter theo JWT token |

### Các function có sẵn trong `appointmentService`:
- `getUpcomingAppointments()` - Lấy lịch hẹn sắp tới
- `getAllAppointments()` - Lấy tất cả lịch hẹn
- `getAppointmentById(id)` - Chi tiết lịch hẹn
- `createAppointment(data)` - Đặt lịch hẹn
- `updateAppointment(id, data)` - Cập nhật
- `cancelAppointment(id)` - Hủy lịch
- `deleteAppointment(id)` - Xóa lịch hẹn

---

## 5. Reminders (Module: pet-owner) - ✅ HOÀN THÀNH

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------|
| `GET /api/reminder` | ✅ | `reminder.service.ts` | Admin |
| `GET /api/reminder/{id}` | ✅ | `reminder.service.ts` | Đã tích hợp |
| `GET /api/reminder/pet/{petId}` | ✅ | `reminder.service.ts` | Đã tích hợp |
| `POST /api/reminder/create` | ✅ | `reminder.service.ts` | Đã tích hợp |
| `PUT /api/reminder/update/{id}` | ✅ | `reminder.service.ts` | Đã tích hợp |
| `DELETE /api/reminder/{id}` | ✅ | `reminder.service.ts` | Đã tích hợp |
| `GET /api/reminder/{reminderId}/logs` | ✅ | `reminder.service.ts` | Đã tích hợp |
| `POST /api/reminder/logs/add` | ✅ | `reminder.service.ts` | Đã tích hợp |

### Các function có sẵn trong `reminderService`:
- `getRemindersByPet(petId)` - Lấy reminders theo pet
- `getAllUserReminders(petIds)` - Lấy tất cả reminders của user
- `getReminderById(id)` - Chi tiết reminder
- `createReminder(data)` - Tạo reminder
- `updateReminder(id, data)` - Cập nhật
- `deleteReminder(id)` - Xóa
- `completeTask(taskId, occurrenceDate)` - Đánh dấu hoàn thành
- `toggleTask(taskId, occurrenceDate, completed)` - Toggle trạng thái
- `getReminderLogs(reminderId)` - Lấy logs

---

## 6. Vaccinations (Module: pet-owner) - ✅ HOÀN THÀNH

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------|
| `POST /api/VaccinationRecord/create` | ✅ | `vaccination.service.ts` | Đã tích hợp |
| `GET /api/VaccinationRecord/{id}` | ✅ | `vaccination.service.ts` | Đã tích hợp |
| `GET /api/VaccinationRecord/pet/{petId}` | ✅ | `vaccination.service.ts` | **MỚI** - BE đã bổ sung |
| `PUT /api/VaccinationRecord/update/{id}` | ✅ | `vaccination.service.ts` | Đã tích hợp |
| `DELETE /api/VaccinationRecord/{id}` | ✅ | `vaccination.service.ts` | Đã tích hợp |
| `GET /api/Vaccine` | ✅ | `vaccination.service.ts` | Danh sách vaccine |
| `GET /api/Vaccine/{id}` | ✅ | `vaccination.service.ts` | Chi tiết vaccine |

### Các function có sẵn trong `vaccinationService`:
- `getVaccines()` - Danh sách vaccine có sẵn
- `getVaccineById(id)` - Chi tiết vaccine
- `getPetVaccinations(petId)` - ✅ Đã kết nối `GET /api/VaccinationRecord/pet/{petId}`
- `getVaccinationById(id)` - Chi tiết vaccination record
- `createVaccinationRecord(data)` - Tạo vaccination record
- `updateVaccinationRecord(id, data)` - Cập nhật
- `deleteVaccinationRecord(id)` - Xóa

---

## 7. Clinics (Module: shared hoặc mới) - CHƯA CÓ

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------|
| `GET /api/Clinic` | ❌ | - | **CẦN TẠO** - Danh sách phòng khám |
| `GET /api/Clinic/{id}` | ❌ | - | **CẦN TẠO** |
| `POST /api/Clinic/create` | ❌ | - | Admin only |
| `PUT /api/Clinic/update/{id}` | ❌ | - | Admin only |

### Frontend cần:
- Tìm kiếm phòng khám gần
- Hiển thị thông tin phòng khám khi đặt lịch

---

## 8. Veterinarians (Module: vet) - CHƯA CÓ

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------|
| `GET /api/Veterinarian` | ❌ | - | **CẦN TẠO** |
| `GET /api/Veterinarian/{id}` | ❌ | - | **CẦN TẠO** |
| `POST /api/Veterinarian/create` | ❌ | - | Admin only |
| `PUT /api/Veterinarian/update/{id}` | ❌ | - | |

### Frontend cần:
- Hiển thị danh sách bác sĩ khi đặt lịch
- Profile bác sĩ

---

## 9. Customers (Module: customer) - CHƯA CÓ

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------|
| `POST /api/Customer/create` | ❌ | - | **CẦN TẠO** |
| `GET /api/Customer/{id}` | ❌ | - | **CẦN TẠO** |
| `PUT /api/Customer/update/{id}` | ❌ | - | **CẦN TẠO** |

---

## 10. Payments (Module: shared) - CHƯA CÓ

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------|
| `POST /api/Payment/create` | ❌ | - | **CẦN TẠO** |
| `GET /api/Payment/{id}` | ❌ | - | **CẦN TẠO** |
| `GET /api/Payment` | ❌ | - | **CẦN TẠO** - Lịch sử thanh toán |
| `GET /api/PaymentMethod` | ❌ | - | **CẦN TẠO** |

---

## 11. Subscriptions - CHƯA CÓ

| API Endpoint | Status | File Service | Ghi chú |
|-------------|--------|--------------|---------|
| `GET /api/SubscriptionPlan` | ❌ | - | Danh sách gói |
| `POST /api/SubscriptionAccount/create` | ❌ | - | Đăng ký gói |
| `GET /api/SubscriptionAccount/{id}` | ❌ | - | Gói hiện tại |

---

## Ưu Tiên Phát Triển

### ✅ Đã hoàn thành (March 3, 2026)
1. **Pet Service** - `pet.service.ts` ✅ — Real API, PetDto mở rộng
2. **Appointment Service** - `appointment.service.ts` ✅ — Real API, JWT filter
3. **Reminder Service** - `reminder.service.ts` ✅ — Real API
4. **Vaccination Service** - `vaccination.service.ts` ✅ — Real API + `GET /pet/{petId}`
5. **Dashboard Service** - `dashboard.service.ts` ✅ — Aggregates từ services trên
6. **Reminders Page** - `app/pet-owner/reminders/page.tsx` ✅ — Wired to real API
7. **Pet Profile Page** - `app/pet-owner/profile/[petId]/page.tsx` ✅ — Wired to real API

### 🟡 Trung bình (Cần làm tiếp)
1. **Clinic Service** - Cần cho đặt lịch, hiển thị phòng khám
2. **Customer Service** - Profile management
3. **Veterinarian Service** - Hiển thị danh sách bác sĩ

### 🟢 Thấp (Sau này)
4. **Payment Service** - Thanh toán
5. **Subscription Service** - Gói dịch vụ
6. **Veterinarian Service** (cho Vet Portal)

---

## Ghi Chú Cho Backend Team

### ✅ Đã giải quyết (March 3, 2026):

1. ~~Lấy Pets theo Customer/Account ID~~ → BE đã filter `GET /api/Pet` theo JWT
2. ~~Lấy Appointments theo Customer~~ → BE đã filter `GET /api/Appointment` theo JWT
3. ~~Lấy Vaccinations theo Pet~~ → BE đã thêm `GET /api/VaccinationRecord/pet/{petId}`
4. ~~PetDto thiếu fields~~ → BE đã thêm `weight`, `imageUrl`, `color`, `microchipId`, `insurance`, `description`

### Còn cần (ưu tiên thấp):

1. **Dashboard Stats cho Customer**
   - Cần endpoint aggregate:
   ```
   GET /api/Customer/{id}/dashboard-stats
   Response: {
     totalPets: number,
     upcomingAppointments: number,
     completedVisits: number,
     pendingPayments: number
   }
   ```

2. **Clinic Services by Clinic**
   - Cần: `GET /api/ClinicService/clinic/{clinicId}`

---

## Mapping Types - Frontend vs Backend

### Pet
```typescript
// Frontend
interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;       // tính từ birthDate
  weight?: number;
  imageUrl?: string;
}

// Backend DTO (PetDto)
{
  id: string;
  customerId: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;     // ISO date
  weight?: number;       // MỚI
  imageUrl?: string;     // MỚI
  color?: string;        // MỚI
  microchipId?: string;  // MỚI
  insurance?: string;    // MỚI
  description?: string;  // MỚI
}
```

### Appointment
```typescript
// Frontend
interface Appointment {
  id: string;
  petId: string;
  petName: string;
  veterinarian: string;
  date: string;
  time: string;
  type: 'checkup' | 'vaccination' | 'emergency' | 'surgery';
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Backend DTO (AppointmentDto)
{
  id: string;
  petId: string;
  pet?: { id, name };
  veterinarianId: string;
  veterinarian?: { id, account: { fullName } };
  appointmentTime: string; // ISO datetime
  status: 0|1|2|3;        // Scheduled|Completed|Cancelled|NoShow
}
```

### Reminder
```typescript
// Backend (ReminderDto)
{
  id: string;
  petId: string;
  pet?: { id, name };
  title: string;
  type: 'Vaccine' | 'Medication' | 'Grooming' | 'Vet' | 'Custom';
  startDate: string;
  isRecurring: boolean;
  recurringType: 'None' | 'Monthly' | 'Yearly';
  logs?: ReminderLogDto[];
}
```
