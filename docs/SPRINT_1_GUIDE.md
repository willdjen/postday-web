# SPRINT 1 ROADMAP: Foundation & Authentication

## After Sprint 0: Project Structure Complete

**Duration**: 2 days  
**Blockers**: Sprint 0 must complete (project structure, dependencies, database)  
**Deliverables**:

- NextAuth v5 configuration
- Shared components library (Button, Modal, Card, Form, Input, Badge)
- Main layout & sidebar navigation
- Login/register pages & flows
- Session management & auth middleware

---

## PHASE 1A: NEXTAUTH V5 SETUP (Day 1, Morning)

### 1. Create NextAuth Configuration

**File**: `src/lib/auth.ts`

```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';
import { compare } from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    // Add OAuth providers later
  ],
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### 2. Create Prisma Client

**File**: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

### 3. API Route for NextAuth

**File**: `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

---

## PHASE 1B: SHARED COMPONENTS LIBRARY (Day 1, Afternoon)

### Components to Create

All in `src/shared/components/`

#### 1. **Button Component**

```typescript
// src/shared/components/Button.tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-orange-primary text-white hover:bg-orange-secondary active:bg-orange-primary",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-300",
        ghost:
          "bg-transparent text-orange-primary hover:bg-orange-light border-0",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "px-3 py-2 text-sm h-8",
        md: "px-4 py-2 text-base h-10",
        lg: "px-6 py-3 text-lg h-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = "Button";
```

#### 2. **Input Component**

```typescript
// src/shared/components/Input.tsx
import React from "react";
import { cn } from "@/shared/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-primary focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = "Input";
```

#### 3. **Card Component**

```typescript
// src/shared/components/Card.tsx
import React from "react";
import { cn } from "@/shared/utils/cn";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border border-neutral-200 bg-white", className)}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b border-neutral-200 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-semibold text-neutral-900", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
```

#### 4. **Form Components**

Create `src/shared/components/Form.tsx` with:

- Form wrapper
- FormField
- FormLabel
- FormError

#### 5. **Modal Component**

Create `src/shared/components/Modal.tsx` with:

- Dialog/modal overlay
- Modal header
- Modal content
- Modal footer

#### 6. **Badge Component**

```typescript
// src/shared/components/Badge.tsx
export const Badge = ({
  status,
}: {
  status: "posted" | "scheduled" | "pending" | "draft" | "failed";
}) => {
  const colors = {
    posted: "bg-green-50 text-status-posted",
    scheduled: "bg-blue-50 text-status-scheduled",
    pending: "bg-orange-light text-orange-primary",
    draft: "bg-neutral-100 text-neutral-600",
    failed: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${colors[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
```

### 4. Utility Functions

**File**: `src/shared/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## PHASE 1C: MAIN LAYOUT & NAVIGATION (Day 2, Morning)

### 1. Main Layout Component

**File**: `src/shared/layouts/MainLayout.tsx`

- Sidebar (200px fixed width)
- Header with workspace selector & user menu
- Main content area
- Mobile responsive (hamburger menu)

### 2. Sidebar Navigation

**File**: `src/shared/components/Sidebar.tsx`

Navigation items:

- Dashboard
- Create Post
- Calendar
- Media Library
- Analytics
- Settings

### 3. Header Component

**File**: `src/shared/components/Header.tsx`

- Logo
- Workspace selector dropdown
- Notification bell icon
- User profile dropdown (Settings, Logout)

---

## PHASE 1D: AUTH PAGES (Day 2, Afternoon)

### 1. Login Page

**File**: `src/app/auth/login/page.tsx`

- Email & password inputs
- "Remember me" checkbox
- "Forgot password?" link
- Link to register
- Form validation with Zod

### 2. Register Page

**File**: `src/app/auth/register/page.tsx`

- Name, email, password inputs
- Password confirmation
- Terms acceptance checkbox
- Link to login
- Verification email flow (setup only)

### 3. Middleware

**File**: `src/middleware.ts`

- Redirect to login if not authenticated
- Redirect to dashboard if already authenticated on auth pages
- Attach user context to requests

---

## TESTING CHECKLIST

After Sprint 1:

- [ ] Can login with valid credentials
- [ ] Can register new account
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Cannot access protected routes without auth
- [ ] All Tailwind colors load correctly
- [ ] Button/Input/Card components render
- [ ] Sidebar navigation shows all items
- [ ] Mobile responsive (hamburger on <768px)
- [ ] No TypeScript errors

---

## BLOCKERS TO NEXT SPRINT

Sprint 2 (Core Features) requires:

- ✅ Auth working end-to-end
- ✅ Database migrations complete
- ✅ Layout & navigation stable
- ✅ API error handling middleware setup

---

## FILES TO CREATE (Sprint 1)

```
src/
├── app/
│   ├── page.tsx                 (landing/redirect)
│   ├── layout.tsx               (root layout)
│   └── api/auth/[...nextauth]/route.ts
├── lib/
│   ├── auth.ts                  (NextAuth config)
│   ├── prisma.ts                (Prisma client)
│   └── db.ts                    (DB utilities - optional)
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Form.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useUser.ts
│   └── utils/
│       ├── cn.ts
│       ├── validators.ts
│       └── api-client.ts
└── modules/
    └── auth/
        ├── pages/
        │   ├── login.tsx
        │   └── register.tsx
        └── components/
            ├── LoginForm.tsx
            └── RegisterForm.tsx
```

---

## ESTIMATED TIMELINE

**Day 1 (8 hours)**:

- 2h: NextAuth setup + database
- 2h: Components library (Button, Input, Card)
- 2h: Layout & navigation
- 2h: Testing & debugging

**Day 2 (8 hours)**:

- 2h: Auth pages (login, register)
- 2h: Session management & middleware
- 2h: Mobile responsiveness
- 2h: Testing & bug fixes

**Ready for Sprint 2**: Core features (Dashboard, Create Post, Calendar)

---

## NEXT: SPRINT 2 GUIDE

Will cover:

- Dashboard module (KPI cards, charts)
- Create Post module (form, platform selection)
- Calendar module (week & month views)
- Media Library (upload, grid view)
- Post publishing flow

Estimated: 3 days
