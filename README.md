# Pawra Frontend

A pet care management platform built with Next.js — helping pet owners track health, schedule appointments, manage medications, and stay connected with vets.

---

## Changelog

### v1.0.1 — 2026-03-06 *(Hotfix)*

> Hotfix on top of v1.0.0

#### Bug Fixes
- **Blog i18n:** All blog components (`FeaturedPost`, `ArticleCard`, `CategoryList`, `SearchBox`, `NewsletterBox`, `BlogTable`, `BlogSearchBar`, `BlogDetailPage`, `BlogPage`, `AdminBlogPage`) were using hardcoded English strings — now fully wired up to the shared translation context (`useTranslation`) with Vietnamese & English keys added to `en.ts` / `vi.ts`
- **Double `+` on Add Task button:** `taskSidebar.addTask` translation key contained a leading `+` character while the `TaskSidebar` component already renders a `+` icon separately, causing `++ Add Task` / `++ Thêm công việc` to appear — removed the redundant `+` from both locale files
- **Admin Blog delete calling wrong endpoint:** `AdminBlogPage` was calling `blogService.deleteBlogPost()` (public endpoint) instead of `blogService.deletePost()` (admin endpoint) — fixed to use the correct admin delete method

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
