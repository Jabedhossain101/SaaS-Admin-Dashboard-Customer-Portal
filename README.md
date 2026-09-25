# SaaS Admin Dashboard & Customer Portal

A modern, production-grade SaaS Admin Dashboard and Customer Portal architecture built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase SSR**.

---

## ⚡ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Auth & Database**: [Supabase](https://supabase.com/) (`@supabase/ssr` & PostgreSQL)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 🚀 Key Features & Architecture

1. **Dual Access Scopes (RBAC)**:
   - **Customer Portal** (`/dashboard`): Isolated tenant workspace, profile settings, usage metrics, and tenant-scoped activity logs.
   - **Admin Control Center** (`/admin`): Privileged system oversight, global tenant audit trail, and user management.
2. **PostgreSQL Row Level Security (RLS)**:
   - Strict data isolation enforcing `auth.uid() = id` for customers and elevated security policies for `is_admin()`.
3. **Fail-Safe SSR Integration**:
   - Zero-crash fallback in development mode if Supabase environment variables are missing or placeholders.
4. **Automated Auth Triggers**:
   - Database triggers automatically provision user profile records and initial activity logs upon registration in Supabase Auth.

---

## 📁 Project Structure

```text
├── app/
│   ├── admin/             # Admin Control Center
│   ├── dashboard/         # Customer Portal
│   ├── login/             # Authentication & Sign In
│   ├── globals.css        # Tailwind CSS theme & tokens
│   ├── layout.tsx         # Root layout with dark aesthetic
│   └── page.tsx           # Interactive landing dashboard
├── components/
│   └── ui/                # Reusable UI components (Button, Card, Badge)
├── lib/
│   ├── supabase/          # SSR Client, Server, and Middleware clients
│   └── utils.ts           # Utility helpers and config validators
├── supabase/
│   └── migrations/        # PostgreSQL SQL migrations (01_init.sql)
├── types/
│   ├── database.ts        # Database schema typings
│   └── index.ts           # App domain interfaces
└── middleware.ts          # Edge session refresh middleware
```

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Jabedhossain101/SaaS-Admin-Dashboard-Customer-Portal.git
cd SaaS-Admin-Dashboard-Customer-Portal
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Apply Database Migration
Run the SQL migration in `supabase/migrations/01_init.sql` inside your Supabase Dashboard SQL Editor or via Supabase CLI.

### 5. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License
MIT License.
