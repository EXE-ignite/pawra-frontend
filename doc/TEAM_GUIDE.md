# Hướng Dẫn Làm Việc - Pawra Frontend Project

## 📋 Thông Tin Dự Án

**Tech Stack:**
- Next.js 15 (App Router)
- Bun (Package Manager)
- TypeScript
- SCSS Modules (KHÔNG dùng Tailwind)
- React 19

**Kiến trúc:** Module-based Architecture

---

## 🏗️ Cấu Trúc Thư Mục

```
pawra-frontend/
├── app/              # Next.js routes (chỉ chứa pages)
├── modules/          # Feature modules (components, logic, styles)
│   ├── shared/      # Components dùng chung
│   ├── pet-owner/   # Module chủ sở hữu thú cưng
│   ├── vet/         # Module bác sĩ thú y
│   ├── admin/       # Module quản trị
│   └── auth/        # Module xác thực
├── styles/          # SCSS global (variables, mixins)
└── doc/             # Tài liệu dự án
```

---

## 🎯 Quy Tắc Bắt Buộc

### 1. **SCSS - KHÔNG DÙNG TAILWIND**
```scss
// ✅ ĐÚNG - Dùng SCSS Module
@import '../../../../styles/variables';
@import '../../../../styles/mixins';

.container {
  background: $primary-500;
  padding: $spacing-lg;
}

// ❌ SAI - Không dùng Tailwind
<div className="bg-blue-500 p-4">
```

### 2. **Component Structure - 4 Files Bắt Buộc**
```
ComponentName/
├── ComponentName.tsx           # Logic component
├── ComponentName.module.scss   # Styles
├── ComponentName.types.ts      # TypeScript types
└── index.ts                    # Exports
```

### 3. **Function Declarations (Không dùng Arrow Functions)**
```tsx
// ✅ ĐÚNG
export function Button({ children }: ButtonProps) {
  return <button>{children}</button>;
}

// ❌ SAI cho exported components
export const Button = ({ children }: ButtonProps) => {
  return <button>{children}</button>;
};
```

### 4. **SCSS Imports - Dùng Relative Paths**
```scss
// ✅ ĐÚNG
@import '../../../../styles/variables';

// ❌ SAI - SCSS không hiểu alias @/
@import '@/styles/variables';
```

---

## 🎨 Bảng Màu (Bắt Buộc Sử Dụng)

```scss
// Primary Colors
$primary-500: #B1B2FF;  // Màu chính
$primary-400: #AAC4FF;  // Nhạt hơn
$primary-300: #D2DAFF;  
$primary-100: #EEF1FF;  // Background

// Text
$text-primary: #1f2937;    // Text chính
$text-secondary: #6b7280;  // Text phụ

// Background
$bg-default: #ffffff;
```

**Không tự ý thay đổi hoặc thêm màu mới!**

---

## 📝 Cách Tạo Component Mới

### Bước 1: Tạo Thư Mục
```bash
modules/[module-name]/components/YourComponent/
```

### Bước 2: Tạo 4 Files

**1. YourComponent.tsx**
```tsx
import React from 'react';
import styles from './YourComponent.module.scss';
import { YourComponentProps } from './YourComponent.types';

export function YourComponent({ title }: YourComponentProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
```

**2. YourComponent.module.scss**
```scss
@import '../../../../styles/variables';
@import '../../../../styles/mixins';

.container {
  @include card;
  padding: $spacing-lg;
}

.title {
  @include heading-2;
  color: $primary-500;
}
```

**3. YourComponent.types.ts**
```tsx
export interface YourComponentProps {
  title: string;
  description?: string;
}
```

**4. index.ts**
```tsx
export { YourComponent } from './YourComponent';
export type { YourComponentProps } from './YourComponent.types';
```

### Bước 3: Export từ Module
Thêm vào `modules/[module-name]/components/index.ts`:
```tsx
export { YourComponent } from './YourComponent';
```

---

## 🚀 Tạo Module Mới

### Bước 1: Tạo Cấu Trúc
```bash
modules/your-module/
├── components/     # UI components
├── pages/         # Page components
├── services/      # API calls, business logic
├── types/         # TypeScript types
└── index.ts       # Module exports
```

### Bước 2: Tạo Route
Tạo file `app/your-route/page.tsx`:
```tsx
import { YourPage } from '@/modules/your-module/pages/YourPage';

export default async function YourRoute() {
  // Fetch data nếu cần
  return <YourPage />;
}
```

---

## 🛠️ Commands

```bash
# Development
bun dev              # Chạy dev server

# Build
bun run build        # Build production
bun start            # Chạy production

# Install packages
bun add [package]    # Thêm package mới
```

---

## 🎯 Checklist Trước Khi Commit

- [ ] Component có đủ 4 files (tsx, scss, types, index)?
- [ ] SCSS import dùng relative path (không dùng @/)?
- [ ] Dùng function declaration (không dùng arrow function)?
- [ ] Dùng biến màu từ `$primary-500`, không hardcode màu?
- [ ] Import variables và mixins trong SCSS file?
- [ ] TypeScript types đã define đầy đủ?
- [ ] Component nằm trong `modules/`, không nằm trong `app/`?

---

## 🤖 Hướng Dẫn Cho AI Assistant

### Khi Tạo Component
1. **Luôn tạo đủ 4 files**: tsx, scss, types, index
2. **SCSS phải import variables và mixins** ở đầu file
3. **Dùng relative path** cho SCSS imports
4. **Không suggest Tailwind** - chỉ dùng SCSS Modules
5. **Export từ index.ts** của module

### Khi Styling
- Dùng `$primary-500`, `$text-primary`, `$spacing-lg`, etc.
- Dùng mixins: `@include card;`, `@include flex-center;`
- Responsive: `@include mobile { ... }`
- Không dùng inline styles

### Khi Tạo Page
- Page route trong `app/`
- Page component trong `modules/[module]/pages/`
- Server Component by default
- Thêm `'use client'` chỉ khi cần state/events

### Documentation
- **Chỉ tạo docs khi được yêu cầu rõ ràng**
- Tất cả docs phải nằm trong `doc/` folder
- Không tự động tạo summary hoặc README

---

## 📚 Tài Liệu Tham Khảo

- **PROJECT_GUIDE.md** - Hướng dẫn chi tiết
- **FOLDER_STRUCTURE.md** - Cấu trúc thư mục
- **modules/pet-owner/** - Ví dụ module hoàn chỉnh

---

## ⚠️ Điều KHÔNG Được Làm

❌ Dùng Tailwind CSS hoặc inline styles  
❌ Dùng arrow function cho exported components  
❌ Bỏ qua TypeScript types  
❌ Dùng `@/` trong SCSS imports  
❌ Tạo component trong `app/` directory  
❌ Hardcode màu sắc (phải dùng variables)  
❌ Thay đổi kiến trúc mà không hỏi  
❌ Thêm dependency mới mà không hỏi  

---

## 🎓 Ví Dụ Hoàn Chỉnh

Xem module **pet-owner** để học:
- `modules/pet-owner/components/` - Các components mẫu
- `modules/pet-owner/pages/Dashboard/` - Page mẫu hoàn chỉnh
- `modules/pet-owner/services/` - Service layer
- `modules/pet-owner/types/` - TypeScript types

---

## 📞 Liên Hệ & Hỗ Trợ

- Đọc **PROJECT_GUIDE.md** trước khi bắt đầu
- Follow các quy tắc trong **.github/copilot-instructions.md**
- Xem code example trong **modules/pet-owner/**

**Chúc các bạn code vui vẻ! 🚀**
