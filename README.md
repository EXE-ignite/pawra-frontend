# Pawra Frontend

A pet care management platform built with Next.js — helping pet owners track health, schedule appointments, manage medications, and stay connected with vets.

---

## Changelog

### v1.0.5 — 2026-03-23

> Frontend subscription package update

#### New Features
- **Admin subscriptions page:** Thêm trang `/admin/subscriptions` với stats, search/filter, table, pagination và edit modal cho quản lý subscription account
- **Subscription plans management:** Thêm trang `/admin/subscription-plans` và bộ component `PlanTable`, `PlanSearchBar`, `PlanEditModal` để tạo/sửa/xem danh sách gói
- **Admin settings page:** Bổ sung trang `/admin/settings` và service/settings types tương ứng cho phần cấu hình admin
- **Pet-owner subscription page:** Thêm trang `/pet-owner/subscription` cùng các component `PlanCard`, `CurrentSubscription` để hiển thị gói hiện tại và lựa chọn gói
- **Services, types, i18n wiring:** Bổ sung service + types cho subscription ở cả `modules/admin` và `modules/pet-owner`, cập nhật text i18n (EN/VI), và cập nhật điều hướng liên quan trong layout

#### Notes
- **Backend API version:** Vẫn đang sử dụng `v1` (không nâng lên `v2`)
- **Data source:** Một phần luồng admin subscriptions hiện vẫn dùng mock service trong FE để hoàn thiện UI/flow

---

### v1.0.4 — 2026-03-11

> Blog sharing enhancements

#### New Features
- **Reusable BlogShare component:** Thêm `BlogShare` dùng chung trong `modules/blog/components/BlogShare/` với 2 chế độ hiển thị: icon action và full share panel
- **Native share + copy fallback:** Nút share ưu tiên Web Share API, fallback tự động sang copy link; hiển thị toast khi copy thành công hoặc khi không thể chia sẻ
- **Social share options:** Share panel hỗ trợ **Facebook**, **X**, và **Messenger** (đã bỏ LinkedIn theo cập nhật mới)
- **Blog UI integration:** Gắn share vào `BlogDetailPage`, `FeaturedPost`, và `ArticleCard`
- **i18n keys for share:** Bổ sung text VN/EN cho các action share (`share`, `copyLink`, `linkCopied`, `shareUnavailable`, `shareOnFacebook`, `shareOnX`, `shareOnMessenger`)

---

### v1.0.3 — 2026-03-07

> Auth & access control improvements

#### New Features
- **AuthGuard component:** Thêm component `AuthGuard` dùng chung trong `modules/shared/components/AuthGuard/` — kiểm tra trạng thái đăng nhập trước khi render trang, hiện spinner khi đang load, hiện màn hình "Bạn chưa đăng nhập" với nút mở `AuthModal` nếu chưa xác thực
- **Pet Owner route protection:** Bọc toàn bộ layout `/pet-owner` trong `AuthGuard` — các trang Dashboard, Profile, Reminders không còn gọi API rồi crash với "An error occurred" khi chưa đăng nhập
- **StaffLayout role guard:** `StaffLayout` (dùng cho `/admin/*`) thêm client-side guard — chưa đăng nhập hiện AuthModal, đăng nhập sai role hiện thông báo "Không có quyền truy cập"
- **Server-side role check cho admin pages:** Thêm `getServerAuthRole()` trong `server-auth.ts` — decode JWT trên server để extract role claim (hỗ trợ .NET standard claim format), dùng để guard `/admin/blog` trước khi gọi API — tránh 403 trên production

#### Bug Fixes
- **`/admin/blog` 403 on Vercel:** Trang admin blog gọi API mà không kiểm tra role — production backend trả về 403 với user không có quyền. Đã thêm role check server-side (`Admin`, `Staff`, `Vet`, `Receptionist`) trước khi fetch data
- **`CommentSection` alert khi chưa đăng nhập:** Thay `alert('Vui lòng đăng nhập...')` bằng mở `AuthModal` — áp dụng cho cả bình luận mới lẫn reply
- **`ReactionBar` inline hint khi chưa đăng nhập:** Thay text hint tạm thời bằng mở `AuthModal`

---

### v1.0.2 — 2026-03-06 *(Hotfix)*

> Hotfix on top of v1.0.1

#### Changes
- **Admin Sidebar:** Ẩn các mục điều hướng chưa hoàn thiện — **Users**, **Appointments**, **Pets**, **Reports**, **Settings** — khỏi sidebar admin; chỉ giữ lại **Dashboard** và **Blog Posts**

----

### v1.0.1 — 2026-03-06 *(Hotfix)*

> Hotfix on top of v1.0.0

#### Bug Fixes
- **Blog i18n:** All blog components (`FeaturedPost`, `ArticleCard`, `CategoryList`, `SearchBox`, `NewsletterBox`, `BlogTable`, `BlogSearchBar`, `BlogDetailPage`, `BlogPage`, `AdminBlogPage`) were using hardcoded English strings — now fully wired up to the shared translation context (`useTranslation`) with Vietnamese & English keys added to `en.ts` / `vi.ts`
- **Double `+` on Add Task button:** `taskSidebar.addTask` translation key contained a leading `+` character while the `TaskSidebar` component already renders a `+` icon separately, causing `++ Add Task` / `++ Thêm công việc` to appear — removed the redundant `+` from both locale files
- **Admin Blog delete calling wrong endpoint:** `AdminBlogPage` was calling `blogService.deleteBlogPost()` (public endpoint) instead of `blogService.deletePost()` (admin endpoint) — fixed to use the correct admin delete method.

---

### v1.0.0 — 2026-03-06

**Initial release.**

#### Pet Owner Module
- Pet dashboard with stat cards, daily routine, and task sidebar
- Pet profile page: header, health records, growth chart, vaccination tracking, document vault
- Pet switcher for managing multiple pets
- Add / Edit / Delete pet via modal
- Reminders page with calendar view and add reminder modal
- Appointment cards and medication tracking
- Add vaccination modal

#### Blog Module
- Public blog listing page with featured post, article cards, category filter, search, and newsletter box
- Blog detail page with comment section, reaction bar, and related posts
- Admin blog dashboard with data table and stat cards
- Create / Edit blog post with full rich text editor (TipTap) — bold, italic, underline, headings, lists, image insert
- Blog search bar and category management

#### Admin Module
- Admin dashboard page
- Blog management (create, edit, list) under `/admin/blog`

#### Shared Infrastructure
- Module-based architecture (`modules/`) with components, pages, services, types per feature
- SCSS Modules styling system with shared `_variables.scss` and `_mixins.scss`
- i18n (internationalization) support via shared translation context
- Main layout with shared navigation
- Google OAuth integration (`@react-oauth/google`)
- Firebase integration (storage for image uploads)
- Axios-based API service layer (mock-data ready, API-switchable)
- TypeScript throughout — strict types, separate `.types.ts` files

#### Stack
- **Framework:** Next.js 16 / React 19
- **Language:** TypeScript 5
- **Styling:** SCSS Modules
- **Editor:** TipTap 3
- **Auth:** Google OAuth + Firebase
- **HTTP:** Axios
- **Runtime:** Bun

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
