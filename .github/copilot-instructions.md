# GitHub Copilot Instructions for Pawra Frontend

## Project Rules

### Architecture
- Always use module-based architecture (features in `modules/`)
- Each module must have: components/, pages/, services/, types/
- Keep components small and focused

### Styling Rules
- **NEVER use Tailwind CSS or inline styles**
- Always use SCSS Modules for component styling
- Import variables: `@import '../../../../styles/variables';`
- Import mixins: `@import '../../../../styles/mixins';`
- Use existing color palette variables ($primary-500, $text-primary, etc.)

### Code Standards
- Prefer function declarations over arrow functions for components
- Use TypeScript for all files
- Create separate `.types.ts` files for complex types
- Use async/await for API calls
- Server Components by default, add 'use client' only when needed

### File Naming
- Components: PascalCase (e.g., `Button.tsx`)
- Styles: `ComponentName.module.scss`
- Types: `ComponentName.types.ts`
- Services: `feature.service.ts`

### Component Structure
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.module.scss
├── ComponentName.types.ts
└── index.ts
```

### When Creating Components
1. Create all 4 files (tsx, scss, types, index)
2. Import variables and mixins in SCSS
3. Export properly from index.ts
4. Add to parent module's index.ts

### What NOT to Do
- ❌ Don't use Tailwind or inline styles
- ❌ Don't use arrow functions for exported components
- ❌ Don't skip TypeScript types
- ❌ Don't use `@/` alias in SCSS imports (use relative paths)
- ❌ Don't create components in app/ directory (use modules/)

### Documentation Rules
- **ONLY create markdown documentation when explicitly requested**
- All documentation files must go in the `doc/` folder
- Do NOT create summary docs, guides, or README files unless asked

### Always Ask Before
- Changing the architecture
- Adding new dependencies
- Modifying global styles
- Changing color palette

## Color Palette (Must Use)
- Primary: $primary-500, $primary-400, $primary-300, $primary-100
- Text: $text-primary, $text-secondary
- Background: $bg-default

## Project URLs (Always Available via MCP Fetch)

### Backend API
- **Swagger UI:** https://api-pawra.purintech.id.vn/swagger/index.html
- **OpenAPI Spec (JSON):** https://api-pawra.purintech.id.vn/swagger/v1/swagger.json
- **API Base URL:** https://api-pawra.purintech.id.vn/api
- **Auth:** JWT Bearer Token — header `Authorization: Bearer {token}`
- **Database:** SQL Server (managed by backend team, frontend does NOT access DB directly)
- **Storage:** Firebase Storage (image upload via `modules/shared/services/firebase/`)

### Deployed Frontend
- **Production:** https://pawra.io.vn
- **Dev/Staging:** https://pawra.netlify.app

### How to Use Context
When asked about API endpoints, DB schema, or live behavior:
1. Use the `fetch` MCP tool to GET `https://api-pawra.purintech.id.vn/swagger/v1/swagger.json` to see all current endpoints
2. Check `doc/BACKEND_API.md` for detailed endpoint docs
3. Check `doc/API_INTEGRATION_STATUS.md` for which endpoints are already integrated
4. Use `fetch` MCP to check the deployed frontend at https://pawra.io.vn if needed
