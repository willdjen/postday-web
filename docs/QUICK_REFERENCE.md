# POSTDAY QUICK REFERENCE CARD

## 🚀 SPRINT 0 QUICK START

```bash
# Step 1: Run automated setup
sprint0-setup.bat

# Step 2: Update database connection
# Edit .env.local and set DATABASE_URL

# Step 3: Create database tables
npm run prisma:migrate

# Step 4: Start development
npm run dev

# Visit: http://localhost:3000
```

---

## 🎨 DESIGN TOKENS (Tailwind Classes)

### Primary Action Colors

```
bg-orange-primary       #E85D24  (main CTA)
bg-orange-secondary     #FA662D  (hover)
bg-orange-light         #FAECE7  (light backgrounds)
```

### Status Badges

```
bg-status-posted        #3B6D11  (green)
bg-status-scheduled     #185FA5  (blue)
bg-status-pending       #E85D24  (orange)
bg-status-draft         #5F5E5A  (gray)
```

### Neutral Grays

```
bg-neutral-50 to bg-neutral-900
text-neutral-800 (primary)
text-neutral-600 (secondary)
```

---

## 📐 SPACING SYSTEM (4px Grid)

```
xs: 4px    | sm: 8px    | md: 12px  | lg: 16px
xl: 20px   | 2xl: 24px  | 3xl: 32px | 4xl: 40px
```

### Usage

```
p-md              (padding 12px)
px-lg             (horizontal 16px)
mt-xl             (margin-top 20px)
gap-sm            (flex gap 8px)
w-sidebar         (200px fixed width)
```

---

## 🗄️ DATABASE MODELS (18 Total)

```
User → Workspace → SocialAccount → Post → Media
  ↓                                   ↓
  Preferences                    EngagementStat
  Account
  Session

BrandKit, WritingStyle, CustomCTA (→ Workspace)
Notification (→ User)
Subscription (→ User)
```

---

## 📍 API ROUTE MAP

```
/api/auth/*                 (login, register, logout)
/api/user/*                 (profile, preferences)
/api/workspace/*            (CRUD, members)
/api/social-accounts/*      (connect, disconnect)
/api/posts/*                (CRUD, publish, schedule)
/api/drafts/*               (CRUD, publish)
/api/media/*                (upload, list, delete)
/api/ai/*                   (generate ideas, captions, images)
/api/analytics/*            (dashboard, stats, engagement)
/api/notifications/*        (list, mark, delete)
/api/settings/*             (brand kit, writing style, CTA)
/api/billing/*              (plans, subscribe, invoices)
```

---

## 🛠️ COMMON COMMANDS

```bash
npm run dev                    # Start dev server
npm run build                  # Production build
npm run lint                   # Check code quality
npm run type-check             # TypeScript check
npm run prisma:generate        # Update Prisma client
npm run prisma:migrate         # Run database migrations
npm run prisma:studio          # Open Prisma UI
npm test                       # Run tests
```

---

## 📁 KEY FILES & THEIR PURPOSE

```
tailwind.config.ts             → Design system colors
.env.local                     → Environment variables
prisma/schema.prisma           → Database schema
src/lib/auth.ts                → NextAuth config (Sprint 1)
src/lib/prisma.ts              → Prisma client (Sprint 1)
src/shared/components/         → Reusable UI components
src/modules/*/                 → Feature modules (15 total)
src/constants/colors.ts        → Color tokens
src/constants/api-routes.ts    → API endpoint definitions
src/shared/types/index.ts      → TypeScript type definitions
```

---

## 🔐 ENVIRONMENT VARIABLES (UPDATE THESE)

```env
DATABASE_URL                   ← Your database connection
NEXTAUTH_SECRET               ← Generate: openssl rand -base64 32
NEXTAUTH_URL                  ← http://localhost:3000 (dev)
OPENAI_API_KEY                ← For AI features
META_APP_ID / META_APP_SECRET ← For social login/posting
RESEND_API_KEY                ← For email verification
MIDTRANS_CLIENT_KEY           ← For payments
```

---

## 📊 28 FEATURES BY MODULE

| Module         | Features                               | Sprint | Status   |
| -------------- | -------------------------------------- | ------ | -------- |
| auth           | Login, Register, OAuth, Password Reset | 1      | Design ✓ |
| dashboard      | KPIs, Charts, Mini Calendar            | 2      | Design ✓ |
| create-post    | Post Composer, Multi-platform          | 2      | Design ✓ |
| calendar       | Week/Month Views, Scheduling           | 2      | Design ✓ |
| media-library  | Upload, Grid, Categories               | 2      | Design ✓ |
| idea-generator | AI Ideas, Topic Input                  | 3      | Design ✓ |
| carousel-maker | Template Picker, AI Gen                | 3      | Design ✓ |
| autopilot      | Full Auto-generation Flow              | 3      | Design ✓ |
| analytics      | Growth, Engagement, Followers          | 4      | Design ✓ |
| settings       | 7 Tabs: General, Social, AI, etc       | 5      | Design ✓ |
| notifications  | Bell, Notification Center              | 4      | Design ✓ |
| billing        | Plans, Subscription, Invoices          | 6      | Design ✓ |
| profile        | Account Settings, Preferences          | 5      | Design ✓ |
| error-pages    | 404, 500, Empty States                 | 6      | Design ✓ |
| shared         | Components, Hooks, Utilities           | 1      | Design ✓ |

---

## 🎯 SPRINT MILESTONES

| Sprint | Focus             | Duration | Status  |
| ------ | ----------------- | -------- | ------- |
| 0      | Infrastructure    | 1 day    | ✅ DONE |
| 1      | Auth + Components | 2 days   | ⏳ Next |
| 2      | Core Features     | 3 days   | Pending |
| 3      | AI Features       | 2 days   | Pending |
| 4      | Analytics         | 2 days   | Pending |
| 5      | Settings + Team   | 2 days   | Pending |
| 6      | Billing + Error   | 2 days   | Pending |
| 7      | Testing + Deploy  | 2+ days  | Pending |

**MVP (12 features)**: After Sprint 3  
**Full Release (28 features)**: After Sprint 7

---

## 🐛 QUICK TROUBLESHOOTING

### Port 3000 in use?

```bash
netstat -ano | findstr :3000    # Find process
taskkill /PID <PID> /F          # Kill process
npm run dev -- -p 3001          # Use different port
```

### TypeScript errors?

```bash
npm run type-check              # Show all errors
npm install                     # Reinstall types if needed
```

### Database connection issue?

```bash
# Verify DATABASE_URL in .env.local
cat .env.local | findstr DATABASE_URL

# Test connection with Prisma
npm run prisma:studio
```

### Prisma not generating?

```bash
npm run prisma:generate         # Regenerate client
npm install @prisma/client      # Reinstall if broken
```

---

## 🔗 USEFUL LINKS

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com
- **Prisma ORM**: https://prisma.io/docs
- **NextAuth v5**: https://authjs.dev
- **shadcn/ui**: https://ui.shadcn.com

---

## 📝 NEXT STEPS

1. ✅ **Sprint 0**: Run sprint0-setup.bat
2. ⏳ **Sprint 1**: Build auth + components
3. ⏳ **Sprint 2**: Build core features
4. ⏳ **Sprint 3**: Add AI features
5. ⏳ **Sprints 4-7**: Complete & deploy

---

## 🎓 DOCUMENTATION FILES

| File                   | Purpose                     |
| ---------------------- | --------------------------- |
| README.md              | Project overview & setup    |
| SPRINT_0_GUIDE.md      | Sprint 0 setup instructions |
| SPRINT_1_GUIDE.md      | Sprint 1 implementation     |
| SPRINT_0_COMPLETION.md | What's been done            |
| PROJECT_MAP.md         | Architecture overview       |
| DESIGN_SYSTEM.md       | UI/UX tokens                |

---

**Postday Project | Sprint 0 Complete ✅**  
**Ready for Sprint 1: Foundation & Auth**  
**Estimated Launch: 14 days from start**
