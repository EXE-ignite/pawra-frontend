# Pawra Backend API Documentation

**API Version:** v1  
**Base URL:** `/api`

## Overview

Pawra Backend is a RESTful API for a Pet Healthcare Management System. It provides comprehensive endpoints for managing pets, appointments, clinics, veterinarians, vaccinations, medications, reminders, weight tracking, blog posts, and more.

---

## Authentication

- **Type:** JWT Bearer Token
- **Authorization Header:** `Authorization: Bearer {token}`
- **Required for:** Most authenticated endpoints (except public blog endpoints)

---

## API Endpoints Summary

### 1. Account Management

#### Get All Accounts
- **GET** `/api/Account`
- **Auth:** Required (Admin)
- **Response:** List of accounts

#### Create Account
- **POST** `/api/Account`
- **Auth:** Required (Admin)
- **Request:** `CreateAccountDto`
- **Response:** `200` - Account created

#### Get Account by ID
- **GET** `/api/Account/{id}`
- **Auth:** Required
- **Response:** Account details

#### Update Account
- **PUT** `/api/Account/{id}`
- **Auth:** Required
- **Request:** `UpdateAccountDto` (all fields optional)
- **Response:** `200` - Updated successfully

#### Delete Account
- **DELETE** `/api/Account/{id}`
- **Auth:** Required (Admin)
- **Response:** `200` - Deleted successfully

#### Bulk Create Accounts
- **POST** `/api/Account/bulk`
- **Auth:** Required (Admin)
- **Request:** `CreateAccountListDto` (max 100 accounts)
- **Response:** `200` - Accounts created

---

### 2. Account Roles

#### Get Role by ID
- **GET** `/api/AccountRole/{id}`
- **Auth:** Required (Admin)
- **Response:** `AccountRoleDto`

#### Create Role
- **POST** `/api/AccountRole/create`
- **Auth:** Required (Admin)
- **Request:** `CreateAccountRoleDto { name }`
- **Response:** `201` - Role created

#### Update Role
- **PUT** `/api/AccountRole/update/{id}`
- **Auth:** Required (Admin)
- **Request:** `UpdateAccountRoleDto { name }`
- **Response:** `200` - Updated

#### Delete Role
- **DELETE** `/api/AccountRole/{id}`
- **Auth:** Required (Admin)
- **Response:** `200` - Deleted

#### Get All Roles (Paginated)
- **GET** `/api/AccountRole`
- **Query Parameters:** `pageSize` (default: 100), `pageNumber` (default: 1)
- **Response:** List of `AccountRoleDto`

---

### 3. Authentication

#### Login
- **POST** `/api/Auth/login`
- **Request:** `LoginRequestDto { email, password }`
- **Response:** `{ accessToken, refreshToken, user }`

#### Register
- **POST** `/api/Auth/register`
- **Request:** `RegisterRequestDto { email, password, fullName }`
- **Response:** `{ accessToken, user }`

#### Get Profile
- **GET** `/api/Auth/profile`
- **Auth:** Required
- **Response:** User profile details

#### Google OAuth Callback
- **POST** `/api/Auth/google/callback`
- **Request:** `GoogleLoginRequestDto { idToken }`
- **Response:** `{ accessToken, user }`

#### Facebook OAuth Callback
- **POST** `/api/Auth/facebook/callback`
- **Request:** `FacebookLoginRequestDto { accessToken }`
- **Response:** `{ accessToken, user }`

#### Logout
- **POST** `/api/Auth/logout`
- **Auth:** Required
- **Response:** `200` - Logged out

---

### 4. Blog Management

#### Public Endpoints

##### Get Published Blog Posts
- **GET** `/api/BlogPosts/published`
- **Query Parameters:**
  - `page` (default: 1)
  - `pageSize` (default: 10, max: 100)
  - `categorySlug` (optional)
- **Response:** Paginated list of published posts

##### Get Blog Post by Slug
- **GET** `/api/BlogPosts/slug/{slug}`
- **Response:** Blog post details

##### Get Blog Categories
- **GET** `/api/BlogCategories`
- **Response:** List of categories

##### Get Category by Slug
- **GET** `/api/BlogCategories/{slug}`
- **Response:** Category details

##### Get Featured Posts
- **GET** `/api/BlogPosts/featured`
- **Query Parameters:** `limit` (default: 1)
- **Response:** Featured blog posts

##### Get Related Posts
- **GET** `/api/BlogPosts/{slug}/related`
- **Query Parameters:** `limit` (default: 3)
- **Response:** Related blog posts

##### Get Post Reactions Stats
- **GET** `/api/BlogPosts/{postId}/reactions`
- **Response:** Reaction statistics

##### Get Post Comments
- **GET** `/api/BlogPosts/{postId}/comments`
- **Response:** Comment tree structure

#### Admin/Veterinarian Endpoints

##### Get All Blog Posts
- **GET** `/api/BlogPosts`
- **Auth:** Required (Admin/Veterinarian)
- **Response:** List of blog posts

##### Create Blog Post
- **POST** `/api/BlogPosts`
- **Auth:** Required
- **Request:** `CreateBlogPostDto`
- **Response:** `200` - Created

##### Get Post by ID
- **GET** `/api/BlogPosts/{id}`
- **Auth:** Required
- **Response:** Blog post details

##### Update Blog Post
- **PUT** `/api/BlogPosts/{id}`
- **Auth:** Required
- **Request:** `UpdateBlogPostDto`
- **Response:** `200` - Updated

##### Delete Blog Post (Soft Delete)
- **DELETE** `/api/BlogPosts/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

##### Publish Blog Post
- **PATCH** `/api/BlogPosts/{id}/publish`
- **Auth:** Required
- **Response:** `200` - Published

##### Unpublish Blog Post
- **PATCH** `/api/BlogPosts/{id}/unpublish`
- **Auth:** Required
- **Response:** `200` - Unpublished to draft

##### Get Posts by Author
- **GET** `/api/BlogPosts/author/{authorId}`
- **Response:** Posts by author

##### Get Posts by Status
- **GET** `/api/BlogPosts/status/{status}`
- **Response:** Posts filtered by status

##### Get Admin Blog Stats
- **GET** `/api/admin/blog/stats`
- **Auth:** Required (Admin)
- **Response:** Blog statistics

##### Get Admin Blog Posts (Filtered)
- **GET** `/api/admin/blog/posts`
- **Auth:** Required (Admin)
- **Query Parameters:**
  - `Search` (optional)
  - `Status` (optional) — `BlogPostStatus` enum
  - `AuthorId` (optional, uuid)
  - `CategorySlug` (optional)
  - `IncludeDeleted` (optional, boolean)
  - `Page`, `PageSize`
- **Response:** Filtered blog posts

---

### 5. Blog Comments & Reactions

#### Create Comment
- **POST** `/api/BlogPosts/{postId}/comments`
- **Auth:** Required
- **Request:** `CreateBlogCommentDto { content, parentCommentId? }`
- **Response:** `200` - Comment created

#### Delete Comment (Soft Delete)
- **DELETE** `/api/blog-comments/{commentId}`
- **Auth:** Required
- **Response:** `200` - Deleted

#### Toggle Reaction
- **PUT** `/api/blog-reactions`
- **Auth:** Required
- **Request:** `ToggleBlogReactionDto { targetType, targetId, reactionTypeId }`
- **Logic:**
  - No reaction → Add new
  - Same reaction → Remove (toggle off)
  - Different reaction → Update
- **`targetType`:** `"Post"` | `"Comment"`
- **Response:** `200`

#### Get My Reactions (Batch)
- **POST** `/api/blog-posts/my-reactions`
- **Auth:** Required
- **Request:** `BatchGetMyReactionsDto { postIds[] }` (min 1 item)
- **Response:** User's reactions for multiple posts

---

### 6. Appointments

#### Create Appointment
- **POST** `/api/Appointment/create`
- **Auth:** Required
- **Request:** `CreateAppointmentDto`
- **Response:** `201` - Created

#### Get Appointment by ID
- **GET** `/api/Appointment/{id}`
- **Auth:** Required
- **Response:** `AppointmentDto`

#### Update Appointment
- **PUT** `/api/Appointment/update/{id}`
- **Auth:** Required
- **Request:** `UpdateAppointmentDto { appointmentTime, status }`
- **Response:** `200` - Updated

#### Delete Appointment
- **DELETE** `/api/Appointment/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

#### Get All Appointments (Paginated)
- **GET** `/api/Appointment`
- **Auth:** Required (filters by authenticated user's JWT token)
- **Query Parameters:** `pageSize` (default: 100), `pageNumber` (default: 1)
- **Response:** Paginated list of user's appointments
- **Note:** Returns only appointments belonging to the authenticated user

---

### 7. Clinics

#### Create Clinic
- **POST** `/api/Clinic/create`
- **Auth:** Required
- **Request:** `CreateClinicDto { name, address, phone, clinicManagerId }`
- **Response:** `201` - Created

#### Get Clinic by ID
- **GET** `/api/Clinic/{id}`
- **Auth:** Required
- **Response:** `ClinicDto`

#### Update Clinic
- **PUT** `/api/Clinic/update/{id}`
- **Auth:** Required
- **Request:** `UpdateClinicDto { name, address, phone, clinicManagerId }`
- **Response:** `200` - Updated

#### Delete Clinic
- **DELETE** `/api/Clinic/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

#### Get All Clinics (Paginated)
- **GET** `/api/Clinic`
- **Query Parameters:** `pageSize` (default: 100), `pageNumber` (default: 1)
- **Response:** Paginated list

#### Search Clinics by Name
- **GET** `/api/Clinic/search`
- **Auth:** Required
- **Query Parameters:** `name`
- **Response:** Matching clinics

#### Search Clinics by Service
- **GET** `/api/Clinic/search-by-service`
- **Auth:** Required
- **Query Parameters:** `serviceName`
- **Response:** Clinics that provide the specified service

---

### 8. Clinic Managers

#### Create Clinic Manager
- **POST** `/api/ClinicManager/create`
- **Auth:** Required
- **Request:** `CreateClinicManagerDto { accountId }`
- **Response:** `201` - Created

#### Get Clinic Manager by ID
- **GET** `/api/ClinicManager/{id}`
- **Response:** `ClinicManagerDto`

#### Update Clinic Manager
- **PUT** `/api/ClinicManager/update/{id}`
- **Auth:** Required
- **Request:** `UpdateClinicManagerDto { accountId }`
- **Response:** `200` - Updated

#### Delete Clinic Manager
- **DELETE** `/api/ClinicManager/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

---

### 9. Clinic Services

#### Create Clinic Service
- **POST** `/api/ClinicService/create`
- **Auth:** Required
- **Request:** `CreateClinicServiceDto { clinicId, serviceId, price, isAvailable }`
- **Response:** `201` - Created

#### Get Clinic Service by ID
- **GET** `/api/ClinicService/{id}`
- **Response:** `ClinicServiceDto`

#### Update Clinic Service
- **PUT** `/api/ClinicService/update/{id}`
- **Auth:** Required
- **Request:** `UpdateClinicServiceDto { price, isAvailable }`
- **Response:** `200` - Updated

#### Delete Clinic Service
- **DELETE** `/api/ClinicService/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

---

### 10. Clinic Vaccines

#### Create Clinic Vaccine
- **POST** `/api/ClinicVaccine/create`
- **Auth:** Required
- **Request:** `CreateClinicVaccineDto { clinicId, vaccineId, price, isAvailable }`
- **Response:** `201` - Created

#### Get Clinic Vaccine by ID
- **GET** `/api/ClinicVaccine/{id}`
- **Response:** `ClinicVaccineDto`

#### Update Clinic Vaccine
- **PUT** `/api/ClinicVaccine/update/{id}`
- **Auth:** Required
- **Request:** `UpdateClinicVaccineDto { price, isAvailable }`
- **Response:** `200` - Updated

#### Delete Clinic Vaccine
- **DELETE** `/api/ClinicVaccine/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

---

### 11. Customers

#### Create Customer
- **POST** `/api/Customer/create`
- **Auth:** Required
- **Request:** `CreateCustomerDto { accountId, phone }`
- **Response:** `201` - Created

#### Get Customer by ID
- **GET** `/api/Customer/{id}`
- **Response:** `CustomerDto`

#### Update Customer
- **PUT** `/api/Customer/update/{id}`
- **Auth:** Required
- **Request:** `UpdateCustomerDto { phone }`
- **Response:** `200` - Updated

#### Delete Customer
- **DELETE** `/api/Customer/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

---

### 12. Medications

#### Get All Medications
- **GET** `/api/medication`
- **Auth:** Required (Admin)
- **Response:** `MedicationDto[]`

#### Get Medication by ID
- **GET** `/api/medication/{id}`
- **Auth:** Required
- **Response:** `MedicationDto` (includes medication logs)

#### Get Medications by Pet
- **GET** `/api/medication/pet/{petId}`
- **Auth:** Required
- **Response:** `MedicationDto[]`

#### Create Medication
- **POST** `/api/medication/create`
- **Auth:** Required
- **Request:** `CreateMedicationDto`
- **Fields:**
  - `petId` (uuid, required)
  - `medicationName` (string, required, max 255)
  - `dosage` (number, required, 0.001–99999.999)
  - `unit` (string, required): `mg` | `ml` | `tablets` | `drops` | `other`
  - `frequency` (string, required): `Once` | `Daily` | `TwiceDaily` | `Weekly` | `BiWeekly` | `Monthly` | `AsNeeded`
  - `startDate` (date, required): `YYYY-MM-DD`
  - `endDate` (date, optional): `YYYY-MM-DD`
  - `notes` (string, optional, max 1000)
  - `status` (string, optional): `Active` | `Completed` | `Paused` | `Discontinued`
- **Response:** `201` - `MedicationDto`

#### Update Medication
- **PUT** `/api/medication/update/{id}`
- **Auth:** Required
- **Request:** `UpdateMedicationDto` (same as create minus `petId`, `status` required)
- **Response:** `200` - `MedicationDto`

#### Delete Medication (Soft Delete)
- **DELETE** `/api/medication/{id}`
- **Auth:** Required
- **Response:** `204` - No Content

#### Get Medication Logs
- **GET** `/api/medication/{medicationId}/logs`
- **Auth:** Required
- **Response:** `MedicationLogDto[]`

#### Add Medication Log
- **POST** `/api/medication/logs/add`
- **Auth:** Required
- **Request:** `CreateMedicationLogDto`
- **Fields:**
  - `medicationId` (uuid, required)
  - `administeredDate` (date, required): `YYYY-MM-DD`
  - `administeredTime` (time, optional): `HH:mm:ss`
  - `status` (string, required): `Given` | `Missed` | `Skipped`
  - `notes` (string, optional, max 500)
- **Response:** `201` - `MedicationLogDto`

---

### 13. Payments

#### Create Payment
- **POST** `/api/Payment/create`
- **Auth:** Required
- **Request:** `CreatePaymentDto { accountId, paymentMethodId, amount, paymentDate, status }`
- **Response:** `201` - Created

#### Get Payment by ID
- **GET** `/api/Payment/{id}`
- **Response:** `PaymentDto`

#### Update Payment
- **PUT** `/api/Payment/update/{id}`
- **Auth:** Required
- **Request:** `UpdatePaymentDto { status }`
- **Response:** `200` - Updated

#### Delete Payment
- **DELETE** `/api/Payment/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

#### Get All Payments (Paginated)
- **GET** `/api/Payment`
- **Query Parameters:** `pageSize` (default: 100), `pageNumber` (default: 1)
- **Response:** Paginated list

---

### 14. Payment Methods

#### Create Payment Method
- **POST** `/api/PaymentMethod/create`
- **Auth:** Required
- **Request:** `CreatePaymentMethodDto { name }`
- **Response:** `201` - Created

#### Get Payment Method by ID
- **GET** `/api/PaymentMethod/{id}`
- **Response:** `PaymentMethodDto`

#### Update Payment Method
- **PUT** `/api/PaymentMethod/update/{id}`
- **Auth:** Required
- **Request:** `UpdatePaymentMethodDto { name }`
- **Response:** `200` - Updated

#### Delete Payment Method
- **DELETE** `/api/PaymentMethod/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

---

### 15. Pets

#### Create Pet
- **POST** `/api/Pet/create`
- **Auth:** Required
- **Request:** `CreatePetDto { customerId, name, species, breed, birthDate, weight?, imageUrl?, color?, microchipId? }`
- **Response:** `201` - Created

#### Get Pet by ID
- **GET** `/api/Pet/{id}`
- **Response:** Pet details

#### Update Pet
- **PUT** `/api/Pet/update/{id}`
- **Auth:** Required
- **Request:** `UpdatePetDto { name, species, breed, birthDate, weight?, imageUrl?, color?, microchipId? }`
- **Response:** `200` - Updated

#### Delete Pet
- **DELETE** `/api/Pet/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

#### Get All Pets (Paginated)
- **GET** `/api/Pet`
- **Auth:** Required (filters by authenticated user's JWT token)
- **Query Parameters:** `pageSize` (default: 100), `pageNumber` (default: 1)
- **Response:** Paginated list of user's pets
- **Note:** Returns only pets belonging to the authenticated user

---

### 16. Prescriptions

#### Create Prescription
- **POST** `/api/Prescription/create`
- **Auth:** Required
- **Request:** `CreatePrescriptionDto { appointmentId, notes }`
- **Response:** `201` - Created

#### Get Prescription by ID
- **GET** `/api/Prescription/{id}`
- **Response:** `PrescriptionDto`

#### Update Prescription
- **PUT** `/api/Prescription/update/{id}`
- **Auth:** Required
- **Request:** `UpdatePrescriptionDto { notes }`
- **Response:** `200` - Updated

#### Delete Prescription
- **DELETE** `/api/Prescription/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

---

### 17. Reminders

#### Get All Reminders
- **GET** `/api/reminder`
- **Auth:** Required (Admin)
- **Response:** `ReminderDto[]`

#### Get Reminder by ID
- **GET** `/api/reminder/{id}`
- **Auth:** Required
- **Response:** `ReminderDto` (includes logs)

#### Get Pet Reminders
- **GET** `/api/reminder/pet/{petId}`
- **Auth:** Required
- **Response:** `ReminderDto[]`

#### Create Reminder
- **POST** `/api/reminder/create`
- **Auth:** Required
- **Request:** `CreateReminderDto`
- **Fields:**
  - `petId` (uuid, required)
  - `title` (string, required, max 255)
  - `description` (string, optional)
  - `type` (string, required): `Vaccine` | `Medication` | `Grooming` | `Vet` | `Custom`
  - `startDate` (date, required): `YYYY-MM-DD`
  - `time` (time, optional): `HH:mm:ss`
  - `isRecurring` (boolean, required)
  - `recurringType` (string, required): `None` | `Monthly` | `Yearly`
  - `endDate` (date, optional): `YYYY-MM-DD`
- **Response:** `201` - `ReminderDto`

#### Update Reminder
- **PUT** `/api/reminder/update/{id}`
- **Auth:** Required
- **Request:** `UpdateReminderDto` (same fields as create minus `petId`)
- **Response:** `200` - `ReminderDto`

#### Delete Reminder (Soft Delete)
- **DELETE** `/api/reminder/{id}`
- **Auth:** Required
- **Response:** `204` - No Content

#### Get Reminder Logs
- **GET** `/api/reminder/{reminderId}/logs`
- **Auth:** Required
- **Response:** `ReminderLogDto[]`

#### Add Reminder Log
- **POST** `/api/reminder/logs/add`
- **Auth:** Required
- **Request:** `CreateReminderLogDto { reminderId, occurrenceDate, status, completedAt }`
- **`status`:** `Completed`
- **Response:** `201` - `ReminderLogDto`

---

### 18. Services

#### Create Service
- **POST** `/api/Service/create`
- **Auth:** Required
- **Request:** `CreateServiceDto { name, description }`
- **Response:** `201` - Created

#### Get Service by ID
- **GET** `/api/Service/{id}`
- **Response:** `ServiceDto`

#### Update Service
- **PUT** `/api/Service/update/{id}`
- **Auth:** Required
- **Request:** `UpdateServiceDto { name, description }`
- **Response:** `200` - Updated

#### Delete Service
- **DELETE** `/api/Service/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

---

### 19. Subscriptions

#### Account Subscriptions

##### Create Subscription
- **POST** `/api/SubscriptionAccount/create`
- **Auth:** Required
- **Request:** `CreateSubscriptionAccountDto { accountId, subscriptionPlanId, startDate, endDate, status }`
- **Response:** `201` - Created

##### Get Subscription by ID
- **GET** `/api/SubscriptionAccount/{id}`
- **Response:** `SubscriptionAccountDto`

##### Update Subscription
- **PUT** `/api/SubscriptionAccount/update/{id}`
- **Auth:** Required
- **Request:** `UpdateSubscriptionAccountDto { status }`
- **Response:** `200` - Updated

##### Delete Subscription
- **DELETE** `/api/SubscriptionAccount/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

#### Subscription Plans

##### Create Plan
- **POST** `/api/SubscriptionPlan/create`
- **Auth:** Required
- **Request:** `CreateSubscriptionPlanDto { name, price, durationInDays, description, isActive? }`
- **Response:** `201` - Created

##### Get Plan by ID
- **GET** `/api/SubscriptionPlan/{id}`
- **Response:** `SubscriptionPlanDto`

##### Update Plan
- **PUT** `/api/SubscriptionPlan/update/{id}`
- **Auth:** Required
- **Request:** `UpdateSubscriptionPlanDto { name, price, durationInDays, description, isActive? }`
- **Response:** `200` - Updated

##### Delete Plan
- **DELETE** `/api/SubscriptionPlan/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

---

### 20. Vaccinations

#### Create Vaccination Record
- **POST** `/api/VaccinationRecord/create`
- **Auth:** Required
- **Request:** `CreateVaccinationRecordDto`
- **Fields:**
  - `petId` (uuid, required)
  - `vaccineName` (string, required, max 255)
  - `clinicName` (string, required, max 255)
  - `vaccinationDate` (datetime, required)
  - `nextDueDate` (datetime, optional)
  - `note` (string, optional)
- **Response:** `201` - Created

#### Get Vaccination Record by ID
- **GET** `/api/VaccinationRecord/{id}`
- **Response:** `VaccinationRecordDto`

#### Get Vaccination Records by Pet
- **GET** `/api/VaccinationRecord/pet/{petId}`
- **Auth:** Required
- **Response:** `VaccinationRecordDto[]`

#### Update Vaccination Record
- **PUT** `/api/VaccinationRecord/update/{id}`
- **Auth:** Required
- **Request:** `UpdateVaccinationRecordDto { vaccineName, clinicName, vaccinationDate, nextDueDate?, note? }`
- **Response:** `200` - Updated

#### Delete Vaccination Record
- **DELETE** `/api/VaccinationRecord/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

---

### 21. Vaccines

#### Create Vaccine
- **POST** `/api/Vaccine/create`
- **Auth:** Required
- **Request:** `CreateVaccineDto { name, manufacturer }`
- **Response:** `201` - Created

#### Get Vaccine by ID
- **GET** `/api/Vaccine/{id}`
- **Response:** `VaccineDto`

#### Update Vaccine
- **PUT** `/api/Vaccine/update/{id}`
- **Auth:** Required
- **Request:** `UpdateVaccineDto { name, manufacturer }`
- **Response:** `200` - Updated

#### Delete Vaccine
- **DELETE** `/api/Vaccine/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

#### Get All Vaccines (Paginated)
- **GET** `/api/Vaccine`
- **Query Parameters:** `pageSize` (default: 100), `pageNumber` (default: 1)
- **Response:** Paginated list

---

### 22. Veterinarians

#### Create Veterinarian
- **POST** `/api/Veterinarian/create`
- **Auth:** Required
- **Request:** `CreateVeterinarianDto { accountId, clinicId, licenseNumber }`
- **Response:** `201` - Created

#### Get Veterinarian by ID
- **GET** `/api/Veterinarian/{id}`
- **Response:** `VeterinarianDto`

#### Update Veterinarian
- **PUT** `/api/Veterinarian/update/{id}`
- **Auth:** Required
- **Request:** `UpdateVeterinarianDto { clinicId, licenseNumber }`
- **Response:** `200` - Updated

#### Delete Veterinarian
- **DELETE** `/api/Veterinarian/{id}`
- **Auth:** Required
- **Response:** `200` - Deleted

#### Get All Veterinarians (Paginated)
- **GET** `/api/Veterinarian`
- **Query Parameters:** `pageSize` (default: 100), `pageNumber` (default: 1)
- **Response:** Paginated list

---

### 23. Weight Records

#### Get Weight Records by Pet
- **GET** `/api/weight-record/pet/{petId}`
- **Auth:** Required
- **Response:** `WeightRecordDto[]` (sorted by date ascending)

#### Get Weight Record by ID
- **GET** `/api/weight-record/{id}`
- **Auth:** Required
- **Response:** `WeightRecordDto`

#### Get Growth Chart Data
- **GET** `/api/weight-record/pet/{petId}/chart`
- **Auth:** Required
- **Query Parameters:**
  - `from` (date, optional): `YYYY-MM-DD`
  - `to` (date, optional): `YYYY-MM-DD`
- **Response:** `WeightGrowthChartDto`

#### Create Weight Record
- **POST** `/api/weight-record/create`
- **Auth:** Required
- **Request:** `CreateWeightRecordDto`
- **Fields:**
  - `petId` (uuid, required)
  - `weight` (number, required, 0.01–9999.99)
  - `unit` (string, required): `kg` | `lbs`
  - `recordedDate` (date, required): `YYYY-MM-DD`
  - `source` (string, required): `Owner` | `Vet` | `Clinic`
  - `notes` (string, optional, max 500)
- **Response:** `201` - `WeightRecordDto`

#### Update Weight Record
- **PUT** `/api/weight-record/update/{id}`
- **Auth:** Required
- **Request:** `UpdateWeightRecordDto { weight, unit, recordedDate, source, notes? }`
- **Response:** `200` - `WeightRecordDto`

#### Delete Weight Record (Soft Delete)
- **DELETE** `/api/weight-record/{id}`
- **Auth:** Required
- **Response:** `204` - No Content

---

## Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `204` | No Content - Successful but no content |
| `400` | Bad Request - Validation error |
| `401` | Unauthorized - JWT token required or invalid |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource not found |

---

## Important DTOs

### Authentication

- **LoginRequestDto**: `{ email, password }`
- **RegisterRequestDto**: `{ email, password, fullName }`
- **GoogleLoginRequestDto**: `{ idToken }`
- **FacebookLoginRequestDto**: `{ accessToken }`

### PetDto
```
{
  id: string,              // UUID
  customerId: string,      // UUID
  name: string,
  species: string,
  breed: string,
  birthDate: string,       // ISO datetime
  weight?: number,
  imageUrl?: string,
  color?: string,
  microchipId?: string,
  createdDate: string,
  updatedDate?: string
}
```

### MedicationDto
```
{
  id: string,
  petId: string,
  petName?: string,
  medicationName: string,
  dosage: number,
  unit: string,            // mg | ml | tablets | drops | other
  frequency: string,       // Once | Daily | TwiceDaily | Weekly | BiWeekly | Monthly | AsNeeded
  startDate: string,       // YYYY-MM-DD
  endDate?: string,
  notes?: string,
  status?: string,         // Active | Completed | Paused | Discontinued
  createdDate: string,
  updatedDate?: string,
  medicationLogs?: MedicationLogDto[]
}
```

### MedicationLogDto
```
{
  id: string,
  medicationId: string,
  administeredDate: string, // YYYY-MM-DD
  administeredTime?: string,
  status?: string,          // Given | Missed | Skipped
  notes?: string,
  createdDate: string
}
```

### WeightRecordDto
```
{
  id: string,
  petId: string,
  petName?: string,
  weight: number,
  unit?: string,           // kg | lbs
  recordedDate: string,    // YYYY-MM-DD
  source?: string,         // Owner | Vet | Clinic
  notes?: string,
  createdDate: string,
  updatedDate?: string
}
```

### WeightGrowthChartDto
```
{
  petId: string,
  petName?: string,
  species?: string,
  unit?: string,
  currentWeight?: number,
  minWeight?: number,
  maxWeight?: number,
  dataPoints?: WeightDataPointDto[]
}
```

### VaccinationRecordDto
```
{
  id: string,
  petId: string,
  vaccineName?: string,
  clinicName?: string,
  vaccinationDate: string,  // ISO datetime
  nextDueDate?: string,
  note?: string,
  createdDate: string,
  updatedDate?: string
}
```

### Blog Post Status
- `0` - Draft
- `1` - Published
- `2` - Archived
- `3` - Deleted

### Payment Status
- `0` - Pending
- `1` - Completed
- `2` - Failed
- `3` - Refunded

### Subscription Status (`SubcriptionStatus`)
- `0` - Active
- `1` - Cancelled
- `2` - Expired

### Paginated Responses
Most list endpoints support pagination with:
- `pageSize` (default: 100)
- `pageNumber` (default: 1)

---

## Notes

- All timestamps are in ISO 8601 format
- All IDs are UUIDs
- Empty/null optional fields are allowed in DTOs
- Soft deletes are used for most resources (Reminder, Medication, WeightRecord use `204` response)
- Blog posts are publicly accessible without authentication
- Admin-only endpoints require Admin role
- Most endpoints requiring update use PUT with the full DTO
- `RegisterRequestDto` does **not** include `phoneNumber` — phone is set separately via the Customer profile
