# SaaS Admin Dashboard & Customer Portal

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-SSR_%26_Postgres-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-grade, multi-tenant SaaS architecture engineered with **Next.js 15 (App Router)**, **TypeScript (Strict Mode)**, **Tailwind CSS v4**, and **Supabase (@supabase/ssr)** with PostgreSQL **Row Level Security (RLS)**.

---

## ⚡ Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js 15 Edge Middleware                   │
│         (Session Refresh & RBAC Route Guard: /admin vs /dashboard)     │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌────────────────────────────────────┐ ┌────────────────────────────────────┐
│      Customer Portal (Tenant)      │ │   Admin Control Center (Global)    │
│  - Isolated workspace              │ │  - Cross-tenant user directory     │
│  - Profile credentials & avatar    │ │  - Role elevation (Admin/Customer) │
│  - Scoped activity audit history   │ │  - System-wide security audit feed │
│  - Strict auth.uid() = id filter   │ │  - is_admin() bypass evaluated     │
└──────────────────┬─────────────────┘ └─────────────────┬──────────────────┘
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                      ┌─────────────────────────────────┐
                      │    PostgreSQL 15+ (Supabase)    │
                      │  - public.profiles              │
                      │  - public.activity_logs         │
                      │  - on_auth_user_created trigger │
                      │  - RLS Security Definer policies│
                      └─────────────────────────────────┘
```

---

## 📁 Repository Structure

```text
├── app/
│   ├── (admin)/                     # Admin Route Group
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   │   ├── [id]/page.tsx    # User inspection & role editor
│   │   │   │   └── page.tsx         # User directory with real-time search
│   │   │   ├── logs/page.tsx        # System-wide audit log stream
│   │   │   ├── settings/page.tsx    # System & database health status
│   │   │   ├── page.tsx             # Admin KPI overview & latest events
│   │   │   ├── loading.tsx          # Admin loading skeleton
│   │   │   └── error.tsx            # Admin error boundary
│   │   └── layout.tsx               # Admin shell layout with purple theme
│   ├── (auth)/                      # Authentication Route Group
│   │   ├── login/page.tsx           # Sign In form + quick demo fill buttons
│   │   ├── signup/page.tsx          # Registration with role selector
│   │   ├── forgot-password/page.tsx # Password reset request
│   │   ├── reset-password/page.tsx  # Password update form
│   │   └── layout.tsx               # Auth backdrop & ambient styling
│   ├── (customer)/                  # Customer Portal Route Group
│   │   ├── dashboard/
│   │   │   ├── profile/page.tsx     # Profile & password management
│   │   │   ├── activity/page.tsx    # Scoped activity audit table
│   │   │   ├── page.tsx             # Tenant dashboard overview
│   │   │   ├── loading.tsx          # Tenant loading skeleton
│   │   │   └── error.tsx            # Tenant error boundary
│   │   └── layout.tsx               # Customer shell with collapsible drawer
│   ├── actions/                     # Next.js Server Actions
│   │   ├── auth.ts                  # signIn, signUp, signOut, resetPassword
│   │   ├── customer.ts              # updateProfile, changePassword, getCustomerData
│   │   └── admin.ts                 # updateUserRole, getAdminStats, getLogs
│   ├── globals.css                  # Tailwind CSS tokens & glass styling
│   ├── layout.tsx                   # Global HTML/Body layout with Inter font
│   ├── page.tsx                     # Interactive system overview landing
│   ├── not-found.tsx                # Custom 404 error page
│   ├── error.tsx                    # Root 500 application error boundary
│   └── loading.tsx                  # Global page loader
├── components/
│   ├── admin/admin-shell.tsx        # Admin navigation & responsive drawer
│   ├── customer/customer-shell.tsx  # Customer navigation & sidebar
│   └── ui/                          # Reusable components (Button, Card, Badge)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser client (@supabase/ssr)
│   │   ├── server.ts                # Server Component client (@supabase/ssr)
│   │   └── middleware.ts            # Edge session & RBAC route guard
│   ├── validations/                 # Zod validation schemas
│   │   ├── auth.ts                  # Auth form schemas
│   │   ├── profile.ts               # Profile update & password schemas
│   │   └── admin.ts                 # Admin update schemas
│   └── utils.ts                     # Utility helpers & config check
├── supabase/
│   └── migrations/
│       └── 01_init.sql              # Database schema, triggers & RLS policies
├── types/
│   ├── database.ts                  # Generated Supabase PostgreSQL typings
│   └── index.ts                     # Application domain interfaces
├── middleware.ts                    # Root Edge Middleware matcher
├── .env.example                     # Annotated environment variables
└── README.md                        # Documentation & setup guide
```

---

## 🛠️ Step-by-Step Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Jabedhossain101/SaaS-Admin-Dashboard-Customer-Portal.git
cd SaaS-Admin-Dashboard-Customer-Portal
```

### 2. Install dependencies with `pnpm`
```bash
pnpm install
```

### 3. Configure Local Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://placeholder-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
> **Note on Zero-Crash Fallback**: If Supabase credentials are placeholder values, the app runs in **Development Mock Mode** with full interactive demo data and role switching.

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup (Production)

### 1. Create a Supabase Project
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and create a new project.
2. Note your **Project URL** and **anon public key** from `Settings > API`.

### 2. Apply the SQL Migration
Open the **SQL Editor** in your Supabase Dashboard, copy the contents of [`supabase/migrations/01_init.sql`](supabase/migrations/01_init.sql), and click **Run**.

#### What this migration executes:
- **`user_role` Enum**: Defines `'admin'` and `'customer'`.
- **`public.profiles` Table**: Extends `auth.users` with `id`, `email`, `full_name`, `role`, `avatar_url`, and timestamps.
- **`public.activity_logs` Table**: Tracks security and session events (`user_id`, `action`, `ip_address`, `created_at`).
- **`public.is_admin()` Security Definer**: Evaluates whether the calling requester holds the `admin` role without recursive RLS lookups.
- **Row Level Security (RLS)**:
  - Customers can read/update only their own rows (`auth.uid() = id`).
  - Admins have elevated read/update across all tenant rows (`is_admin() = true`).
- **Triggers**:
  - `on_auth_user_created`: Automatically inserts a profile and activity log when a user registers in Supabase Auth.
  - `on_profile_updated`: Automatically updates the `updated_at` timestamp.

---

## 🚀 Vercel Deployment Guide

### 1. Import Git Repository
1. Push your changes to GitHub.
2. Navigate to [Vercel](https://vercel.com/new) and import `SaaS-Admin-Dashboard-Customer-Portal`.

### 2. Configure Build Settings
- **Framework Preset**: Next.js
- **Package Manager**: `pnpm`
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install`

### 3. Add Environment Variables in Vercel
In **Project Settings > Environment Variables**, add:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project REST Endpoint | `https://xyzcompany.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anonymous API Key | `eyJhbGciOiJIUzI1NiIsInR5c...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged Backend Key (Server only) | `eyJhbGciOiJIUzI1NiIsInR5c...` |
| `NEXT_PUBLIC_SITE_URL` | Production Canonical URL | `https://your-domain.vercel.app` |

### 4. Supabase Redirect URLs
In Supabase Dashboard under **Authentication > URL Configuration**:
- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**:
  - `https://your-domain.vercel.app/**`
  - `http://localhost:3000/**`

---

## 🔒 Security Architecture (RBAC & RLS)

- **Client & Server SSR Separation**: Uses `@supabase/ssr` with Next.js 15 async cookie store handling (`createClient()`).
- **Edge Middleware Route Protection**:
  - Unauthenticated requests to `/dashboard/*` or `/admin/*` are redirected to `/login?next=...`.
  - Non-admin users navigating to `/admin/*` are automatically redirected to `/dashboard?error=unauthorized` with a 403 Forbidden alert.
  - Authenticated sessions attempting to view auth pages (`/login`, `/signup`) are redirected to their workspace.
- **Server Action Authorization**: Admin operations (`updateUserByAdminAction`) verify the caller's admin status before committing changes to PostgreSQL.

---

## 📜 License

MIT License — free for commercial and personal use.
