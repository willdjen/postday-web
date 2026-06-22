# Postday - Social Media Management Platform

## Sprint 0: Project Infrastructure Ready

**Current Status**: ✅ Foundation Complete - Ready for Sprint 1  
**Phase**: 0 of 7 (Infrastructure Setup)  
**Tech Stack**: Next.js 14 (TypeScript) + Tailwind CSS + shadcn/ui + Prisma + PostgreSQL

---

## 🎯 PROJECT OVERVIEW

**Postday** is an AI-powered social media management platform designed for Indonesian UMKM, social media agencies, and content creators. It enables users to:

- Create, schedule, and publish posts to multiple platforms (Instagram, Facebook, LinkedIn, TikTok, Twitter, YouTube)
- Generate content ideas and captions with AI
- Manage media library and brand assets
- Track analytics and engagement metrics
- Collaborate with team members
- Customize tone, writing style, and branding

**28 Features** mapped to 15 modules across 7 implementation sprints.

---

## 📦 WHAT'S BEEN COMPLETED (Sprint 0)

### ✅ Deliverables

1. **Project Configuration**
   - ✅ Next.js 14 scaffold with TypeScript
   - ✅ Tailwind CSS with custom design system
   - ✅ ESLint & Prettier configured
   - ✅ TypeScript strict mode enabled

2. **Design System**
   - ✅ Tailwind theme with Postday colors:
     - Primary Orange: `#E85D24`
     - Status colors (Posted/Scheduled/Pending/Draft)
     - Neutral grayscale palette
     - 4px grid spacing system
     - 8px/12px/16px border radius tokens

3. **Database Foundation**
   - ✅ Prisma schema with 18 models
   - ✅ User management (auth, preferences)
   - ✅ Workspace & team management
   - ✅ Post/media/analytics models
   - ✅ Customization (brand kit, writing style)
   - ✅ Billing & subscription models

4. **Core Infrastructure**
   - ✅ Environment variables template (.env.local)
   - ✅ TypeScript path aliases configured
   - ✅ API routes structure designed
   - ✅ Type definitions for entire app

5. **Documentation**
   - ✅ Sprint 0 setup guide (7,586 bytes)
   - ✅ Sprint 1 roadmap (11,675 bytes)
   - ✅ Project structure documentation
   - ✅ Design system reference

---

## 🚀 QUICK START

### Prerequisites

- Node.js 18+ (verify: `node --version`)
- npm 9+ (verify: `npm --version`)
- PostgreSQL database (Supabase recommended) OR local SQLite

### 1. Setup Project Structure

Run the automated setup script:

```bash
cd c:\Users\ASUS\postday-web
sprint0-setup.bat
```

**OR** manually:

```bash
# Create all directories
mkdir prisma src\app src\modules\{auth,dashboard,create-post,idea-generator,carousel-maker,drafts,autopilot,calendar,media-library,analytics,settings,notifications,billing,profile,error-pages} src\shared\{components,hooks,types,utils,services,layouts} src\api src\lib src\styles src\constants

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate
```

### 2. Configure Database

Update `.env.local` with your database:

**Option A: PostgreSQL (Supabase)**

```env
DATABASE_URL="postgresql://user:password@db.supabase.co:5432/postgres?schema=public"
```

**Option B: SQLite (Local Testing)**

```env
DATABASE_URL="file:./prisma/dev.db"
```

Update `prisma/schema.prisma`: Change `provider` to `"sqlite"`

### 3. Initialize Database

```bash
npm run prisma:migrate
```

This creates all tables defined in the Prisma schema.

### 4. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

**Expected output**:

```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### 5. Verify Setup

```bash
npm run type-check
```

Should output: `✓ No TypeScript errors`

---

## 📁 PROJECT STRUCTURE

```
postday-web/
├── prisma/
│   └── schema.prisma                (← Database schema: 18 models)
│
├── src/
│   ├── app/                         (← Next.js 14 App Router)
│   │   └── api/                     (← API routes)
│   │
│   ├── modules/                     (← 15 Feature modules)
│   │   ├── auth/                    (← Login, register, OAuth)
│   │   ├── dashboard/               (← KPI cards, charts)
│   │   ├── create-post/             (← Post composer)
│   │   ├── idea-generator/          (← AI ideas)
│   │   ├── carousel-maker/          (← AI carousel)
│   │   ├── drafts/                  (← Draft management)
│   │   ├── autopilot/               (← Automated generation)
│   │   ├── calendar/                (← Week/month views)
│   │   ├── media-library/           (← Media manager)
│   │   ├── analytics/               (← Metrics & reporting)
│   │   ├── settings/                (← 7 settings tabs)
│   │   ├── notifications/           (← Notifications)
│   │   ├── billing/                 (← Subscription)
│   │   ├── profile/                 (← Account settings)
│   │   └── error-pages/             (← 404, 500, etc)
│   │
│   ├── shared/                      (← Shared code)
│   │   ├── components/              (← UI components)
│   │   ├── hooks/                   (← React hooks)
│   │   ├── types/                   (← TypeScript types)
│   │   ├── utils/                   (← Helpers)
│   │   ├── services/                (← API client)
│   │   └── layouts/                 (← Layout wrappers)
│   │
│   ├── lib/
│   │   ├── prisma.ts               (← Prisma client)
│   │   ├── auth.ts                 (← NextAuth config)
│   │   └── db.ts                   (← DB utilities)
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── animations.css
│   │
│   └── constants/
│       ├── colors.ts
│       ├── spacing.ts
│       └── api-routes.ts
│
├── tailwind.config.ts               (← ✅ Updated with design tokens)
├── tsconfig.json                    (← TypeScript config)
├── package.json                     (← All dependencies)
├── .env.local                       (← ✅ Environment variables)
├── .env.example
├── next.config.js
├── postcss.config.js
├── .eslintrc.json
├── .prettierrc
│
├── SPRINT_0_GUIDE.md               (← Setup instructions)
├── SPRINT_1_GUIDE.md               (← Auth & foundation)
├── sprint0-setup.bat               (← Automation script)
│
└── README.md                        (← This file)
```

---

## 📐 DATABASE SCHEMA

**18 Models**:

| Model               | Purpose                   |
| ------------------- | ------------------------- |
| `User`              | User accounts             |
| `Account`           | OAuth connections         |
| `Session`           | Auth sessions             |
| `UserPreferences`   | User settings             |
| `Workspace`         | Team workspaces           |
| `WorkspaceMember`   | Team members              |
| `SocialAccount`     | Platform connections      |
| `Post`              | Content posts             |
| `PostMedia`         | Post attachments          |
| `PostSocialAccount` | Cross-platform publishing |
| `EngagementStat`    | Analytics metrics         |
| `Media`             | Media library             |
| `Draft`             | Saved drafts              |
| `BrandKit`          | Brand customization       |
| `WritingStyle`      | Tone templates            |
| `CustomCTA`         | Call-to-action buttons    |
| `Notification`      | User notifications        |
| `Subscription`      | Billing data              |

**Key Relationships**:

- User → Workspace (1-to-many)
- Workspace → SocialAccount (1-to-many)
- SocialAccount → Post (1-to-many)
- Post → PostMedia (1-to-many)
- Post → EngagementStat (1-to-many)

---

## 🎨 DESIGN SYSTEM

### Colors (Tailwind Classes)

**Primary Action**:

```
bg-orange-primary: #E85D24
bg-orange-secondary: #FA662D (hover)
bg-orange-light: #FAECE7 (light bg)
bg-orange-lighter: #FAEEDA
```

**Status Badges**:

```
bg-status-posted: #3B6D11 (Green)
bg-status-scheduled: #185FA5 (Blue)
bg-status-pending: #E85D24 (Orange)
bg-status-draft: #5F5E5A (Gray)
bg-status-failed: #DC2626 (Red)
```

**Neutral**:

```
bg-neutral-100 to bg-neutral-900
```

### Typography

**Font Stack**: Inter (body), Poppins (headings), Monaco (code)

**Sizes**:

- xs: 11px (UI labels)
- sm: 13px (small text)
- base: 14px (body)
- lg: 16px (large)
- xl: 18px (headings)
- 2xl: 20px (major headings)
- 3xl: 24px (section titles)
- 4xl: 28px (hero text)

### Spacing (4px Grid)

```
xs: 4px   | sm: 8px    | md: 12px  | lg: 16px
xl: 20px  | 2xl: 24px  | 3xl: 32px | 4xl: 40px
```

### Components

All standard components coming in Sprint 1:

- Button (4 variants: primary, secondary, ghost, danger)
- Input (text, email, password)
- Card (with header, content, footer)
- Modal/Dialog
- Badge (status colors)
- Sidebar (200px fixed)
- Header (with profile menu)

---

## 📊 28 FEATURES ROADMAP

### Phase 1: MVP (Sprint 1-3) — 12 Features

- [x] Dashboard
- [x] Create Post (from scratch, templates)
- [x] Idea Generator
- [x] Carousel Maker
- [x] Drafts
- [x] Auto Pilot
- [x] Calendar (week/month)
- [x] Media Library
- [x] Analytics Dashboard
- [x] Engage Tab
- [x] Settings (7 tabs)
- [x] Auth (login/register)

### Phase 2: Advanced (Sprint 4-5) — 8 Features

- [ ] Post Preview per Platform
- [ ] Notification Center
- [ ] Profile / Account Settings
- [ ] Viral Posts Analytics
- [ ] Inspiration Tab
- [ ] Insights Deep Dive
- [ ] Post Edit Modal
- [ ] Error Handling

### Phase 3: Enterprise (Sprint 6-7) — 8 Features

- [ ] Billing & Subscription
- [ ] Onboarding Wizard
- [ ] Workspace Management
- [ ] Brand Kit Manager
- [ ] Writing Style Editor
- [ ] Social Account Manager
- [ ] Custom CTAs
- [ ] Empty States

---

## 🔑 ENVIRONMENT VARIABLES

Copy `.env.local` and update:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (Meta - Instagram/Facebook)
NEXT_PUBLIC_META_APP_ID="..."
META_APP_SECRET="..."

# AI (OpenAI)
OPENAI_API_KEY="..."

# Email Service (Resend)
RESEND_API_KEY="..."

# Payment (Midtrans)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="..."
MIDTRANS_SERVER_KEY="..."

# Redis (Job Queue)
REDIS_URL="redis://localhost:6379"

# Environment
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🛠️ AVAILABLE COMMANDS

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Building & Deployment
npm run build           # Production build
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run format          # Format with Prettier
npm run type-check      # TypeScript type checking

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio UI
npm run prisma:seed     # Seed database

# Testing (Setup in Sprint 1)
npm test                # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

---

## 🚦 CURRENT PROGRESS

**Sprint 0 Status**: ✅ **COMPLETE**

Completed:

- ✅ Project scaffold (Next.js 14, TypeScript)
- ✅ Tailwind CSS with design system
- ✅ Prisma schema (18 models, all relationships)
- ✅ Environment configuration
- ✅ Directory structure documentation
- ✅ Type definitions (50+ types)
- ✅ API routes map (40+ endpoints)
- ✅ Setup guides & automation

**Next**: Sprint 1 - Foundation & Auth (2 days)

- [ ] NextAuth v5 setup
- [ ] Shared components library
- [ ] Main layout & navigation
- [ ] Login/register pages
- [ ] Session management

---

## 🔐 SECURITY CHECKLIST

- [ ] NEXTAUTH_SECRET generated and added to production .env
- [ ] DATABASE_URL never committed to git
- [ ] API keys in environment variables (not hardcoded)
- [ ] CORS configured for API routes
- [ ] Rate limiting on auth endpoints
- [ ] CSRF protection on forms
- [ ] Passwords hashed with bcrypt
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection (Next.js built-in)
- [ ] Secrets rotation strategy planned

---

## 📈 PERFORMANCE TARGETS

- **Load Time**: < 2s (Lighthouse 90+)
- **API Response**: < 200ms (p95)
- **Database**: < 50ms query time
- **Build Time**: < 45s production
- **Bundle Size**: < 200KB (main JS)
- **Core Web Vitals**: Good (LCP, FID, CLS)

---

## 🤝 TEAM & COLLABORATION

**Current Phase**: Solo development (can parallelize with clear module boundaries)

**Modules can be developed independently**:

- Auth team: `src/modules/auth/`
- Dashboard team: `src/modules/dashboard/`
- Content team: `src/modules/create-post/`, `src/modules/calendar/`
- Analytics team: `src/modules/analytics/`

**Shared dependencies**: `src/shared/` (components, types, hooks)

---

## 📚 DOCUMENTATION

- **SPRINT_0_GUIDE.md**: Setup instructions & verification
- **SPRINT_1_GUIDE.md**: Auth & foundation implementation
- **PROJECT_MAP.md**: Architecture & module relationships
- **DESIGN_SYSTEM.md**: Color tokens, typography, components
- **BLUEPRINT_CHECK.md**: BMC alignment verification

---

## 🐛 TROUBLESHOOTING

### Issue: "DATABASE_URL not found"

```bash
# Check .env.local exists
cat .env.local

# Regenerate if missing
echo DATABASE_URL="postgresql://..." > .env.local
```

### Issue: "Prisma client not generated"

```bash
npm run prisma:generate
npm install @prisma/client
```

### Issue: TypeScript errors

```bash
npm run type-check
npm install  # May need to reinstall types
```

### Issue: Port 3000 already in use

```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

---

## 📞 NEXT STEPS

1. ✅ Complete Sprint 0 setup (run sprint0-setup.bat)
2. ⏳ **Start Sprint 1**: NextAuth + Components (2 days)
3. ⏳ Sprint 2: Core Features (3 days)
4. ⏳ Sprint 3: AI Features (2 days)
5. ⏳ Sprints 4-7: Complete feature set (8+ days)

**Estimated MVP Launch**: 14 days  
**Estimated Full Release**: 21 days

---

## 📝 LICENSE & CREDITS

**Project**: Postday - Social Media Management Platform  
**Version**: 0.1.0  
**Tech**: Next.js 14, TypeScript, Tailwind CSS, Prisma, PostgreSQL

Built for Indonesian/SEA market UMKM, agencies, and creators.

---

**Last Updated**: Sprint 0 Complete  
**Next Update**: After Sprint 1 Completion
