# SPRINT 0 EXECUTION GUIDE

## Postday Platform - Project Setup & Foundation

**Status**: Ready to Execute  
**Duration**: 2-3 hours  
**Deliverables**: Project structure, Tailwind theme, Prisma schema, dependencies

---

## STEP-BY-STEP SETUP (Run on your local machine)

### 1. CREATE DIRECTORY STRUCTURE

Open Command Prompt/PowerShell and navigate to `c:\Users\ASUS\postday-web`, then run:

```batch
REM Create all required directories
mkdir prisma
mkdir src\app
mkdir src\modules\auth
mkdir src\modules\dashboard
mkdir src\modules\create-post
mkdir src\modules\idea-generator
mkdir src\modules\carousel-maker
mkdir src\modules\drafts
mkdir src\modules\autopilot
mkdir src\modules\calendar
mkdir src\modules\media-library
mkdir src\modules\analytics
mkdir src\modules\settings
mkdir src\modules\notifications
mkdir src\modules\billing
mkdir src\modules\profile
mkdir src\modules\error-pages
mkdir src\shared\components
mkdir src\shared\hooks
mkdir src\shared\types
mkdir src\shared\utils
mkdir src\shared\services
mkdir src\shared\layouts
mkdir src\api
mkdir src\lib
mkdir src\styles
mkdir src\constants
```

**OR** run the batch script:

```batch
sprint0-setup.bat
```

### 2. INSTALL DEPENDENCIES

```bash
npm install
```

**Expected output**: 200+ packages installed, 0 vulnerabilities

### 3. GENERATE PRISMA CLIENT

```bash
npm run prisma:generate
```

**Expected output**: Prisma client generated successfully

### 4. SETUP DATABASE

You have two options:

#### Option A: PostgreSQL (Recommended - Production Ready)

- Use Supabase (free tier: https://supabase.com/)
- Create new project
- Copy connection string to `.env.local` DATABASE_URL
- Run: `npm run prisma:migrate`

#### Option B: SQLite (Quick Local Testing)

- Update DATABASE_URL in `.env.local`:
  ```
  DATABASE_URL="file:./prisma/dev.db"
  ```
- Change provider in `prisma/schema.prisma` to `"sqlite"`
- Run: `npm run prisma:migrate`

### 5. VERIFY SETUP

```bash
npm run type-check
npm run dev
```

**Expected output**:

- ✓ No TypeScript errors
- ✓ App running at http://localhost:3000

---

## FILES CREATED

✅ `.env.local` - Environment variables template  
✅ `tailwind.config.ts` - Custom design system with Postday colors  
✅ `prisma/schema.prisma` - Complete database schema (13 models)  
✅ `sprint0-setup.bat` - Automated setup script

---

## FOLDER STRUCTURE AFTER SETUP

```
postday-web/
├── prisma/
│   └── schema.prisma          ← Database schema (created)
├── src/
│   ├── app/                   ← Next.js App Router pages (TBD)
│   ├── api/                   ← API routes (Sprint 1)
│   ├── lib/
│   │   ├── prisma.ts         ← Prisma client (TBD)
│   │   ├── auth.ts           ← NextAuth config (Sprint 1)
│   │   └── db.ts             ← Database utilities (Sprint 1)
│   ├── modules/               ← 15 feature modules
│   │   ├── auth/             ← Authentication (Sprint 1)
│   │   ├── dashboard/        ← Dashboard (Sprint 2)
│   │   ├── create-post/      ← Post creation (Sprint 2)
│   │   ├── calendar/         ← Calendar views (Sprint 2)
│   │   ├── analytics/        ← Analytics (Sprint 4)
│   │   └── ... (13 total)
│   ├── shared/
│   │   ├── components/        ← Shared UI components (Sprint 1)
│   │   ├── hooks/            ← Custom React hooks (Sprint 1)
│   │   ├── types/            ← TypeScript types (TBD)
│   │   ├── utils/            ← Helper functions (TBD)
│   │   ├── services/         ← API client functions (Sprint 1)
│   │   └── layouts/          ← Layout components (Sprint 1)
│   ├── styles/
│   │   ├── globals.css       ← Global styles (TBD)
│   │   └── animations.css    ← Custom animations (Sprint 2)
│   └── constants/
│       ├── colors.ts         ← Design tokens (TBD)
│       ├── spacing.ts        ← Spacing scale (TBD)
│       └── api-routes.ts     ← API endpoints (Sprint 1)
├── .env.local                ← Environment variables (created)
├── tailwind.config.ts        ← Tailwind config (updated ✓)
├── tsconfig.json            ← TypeScript config (verified)
├── package.json             ← Dependencies (verified)
└── sprint0-setup.bat        ← Setup automation (created)
```

---

## NEXT STEPS AFTER SETUP

### Immediate (After directories created + npm install):

1. ✅ Run `npm run prisma:generate`
2. ✅ Setup database connection (Supabase or local SQLite)
3. ✅ Run `npm run prisma:migrate` (creates tables)
4. ✅ Run `npm run dev` (verify project starts)

### Then Move to Sprint 1 (Foundation & Auth):

- [ ] Create shared components library (Button, Modal, Card, Form, Input)
- [ ] Setup NextAuth v5 configuration
- [ ] Create main layout & sidebar navigation
- [ ] Implement login/register flow
- [ ] Setup session persistence

---

## DESIGN SYSTEM SUMMARY (Configured in Tailwind)

**Primary Colors**:

- Orange Primary: `#E85D24` → `bg-orange-primary`
- Orange Secondary: `#FA662D` → `bg-orange-secondary`
- Light Accent: `#FAECE7` → `bg-orange-light`

**Status Colors**:

- Posted (Green): `#3B6D11` → `bg-status-posted`
- Scheduled (Blue): `#185FA5` → `bg-status-scheduled`
- Pending (Orange): `#E85D24` → `bg-status-pending`
- Draft (Gray): `#5F5E5A` → `bg-status-draft`

**Spacing System** (4px grid):

- xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 20px, 2xl: 24px, 3xl: 32px, 4xl: 40px

**Border Radius**:

- Default: 8px, SM: 4px, MD: 8px, LG: 12px, XL: 16px

---

## DATABASE SCHEMA OVERVIEW

**13 Core Models**:

1. `User` - User accounts
2. `Account` - OAuth accounts
3. `Session` - Auth sessions
4. `UserPreferences` - User settings
5. `Workspace` - Team workspaces
6. `WorkspaceMember` - Team members
7. `SocialAccount` - Connected platforms
8. `Post` - Content posts
9. `PostMedia` - Post attachments
10. `PostSocialAccount` - Platform publishing
11. `EngagementStat` - Analytics data
12. `Media` - Media library
13. `Draft` - Saved drafts
14. `BrandKit` - Brand customization
15. `WritingStyle` - Tone templates
16. `CustomCTA` - Call-to-action buttons
17. `Notification` - User notifications
18. `Subscription` - Billing data

All models include timestamps, indexes, and proper relationships.

---

## TROUBLESHOOTING

### Issue: "DATABASE_URL not found"

**Fix**: Update `.env.local` with your database connection string

### Issue: "Prisma client not generated"

**Fix**: Run `npm run prisma:generate`

### Issue: TypeScript errors on compile

**Fix**: Run `npm run type-check` to verify all types are correct

### Issue: App won't start on localhost:3000

**Fix**:

- Check port 3000 not in use: `netstat -ano | findstr :3000`
- Kill process: `taskkill /PID <PID> /F`
- Restart: `npm run dev`

---

## PERFORMANCE BASELINE

After successful setup, measure:

- Development server startup: < 3 seconds
- TypeScript compilation: < 2 seconds
- Tailwind CSS build: included in dev
- Prisma queries: tested in Sprint 1

---

## COMPLETION CHECKLIST

- [ ] Directories created (run sprint0-setup.bat or manual commands)
- [ ] npm install completed (200+ packages)
- [ ] prisma generate ran successfully
- [ ] Database connected (.env.local updated)
- [ ] prisma migrate ran (database populated)
- [ ] npm run dev started without errors
- [ ] http://localhost:3000 accessible
- [ ] TypeScript: npm run type-check passes
- [ ] Read Sprint 1 guide to begin auth module

✅ **SPRINT 0 COMPLETE** when all checklist items done.

---

**Next Review**: Sprint 1 (Foundation & Auth) - estimated 2 days
