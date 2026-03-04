Here’s the **production-grade SaaS structure** I’d use for Quick Code Test Prep. It keeps your app clean as you add: auth, billing, Python execution, question banks, attempts, analytics, admin tools, etc.

I’m going to show you a structure that is:

* **Next.js App Router friendly**
* **Supabase-first**
* **Python execution ready**
* Clean separation between **routes**, **domain logic**, **UI**, and **server-only code**
* Easy to enforce: “this never ships to the browser”

---

# Production-Grade Folder Structure (Recommended)

```text
quick-code-test-prep/
├── docs/                          # internal docs (private)
│   ├── architecture.md
│   ├── database-schema.md
│   ├── project-plan.md
│   └── roadmap.md
│
├── src/
│   ├── app/                       # routes only (thin)
│   │   ├── (marketing)/           # public routes group (doesn't affect URL)
│   │   │   ├── page.tsx           # /
│   │   │   ├── sql/page.tsx       # /sql
│   │   │   ├── python/page.tsx    # /python
│   │   │   ├── pricing/page.tsx   # /pricing
│   │   │   └── faq/page.tsx       # /faq
│   │   │
│   │   ├── (auth)/                # auth routes
│   │   │   ├── login/page.tsx     # /login
│   │   │   ├── signup/page.tsx    # /signup
│   │   │   └── callback/route.ts  # /callback (supabase oauth magic link etc)
│   │   │
│   │   ├── (app)/                 # authed routes group
│   │   │   ├── dashboard/page.tsx         # /dashboard
│   │   │   ├── sql/page.tsx               # /sql (optional: show authed variant)
│   │   │   ├── app/sql/crash-course/page.tsx   # (if you want /dashboard/sql/..)
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx
│   │   │       ├── sql/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── crash-course/page.tsx
│   │   │       │   ├── warmup/page.tsx
│   │   │       │   └── timed/page.tsx
│   │   │       └── python/
│   │   │           ├── page.tsx
│   │   │           ├── warmup/page.tsx
│   │   │           └── timed/page.tsx
│   │   │
│   │   ├── api/                   # Next.js route handlers (server-only)
│   │   │   ├── execute/
│   │   │   │   ├── python/route.ts  # POST /api/execute/python
│   │   │   │   └── sql/route.ts     # POST /api/execute/sql
│   │   │   ├── billing/
│   │   │   │   ├── checkout/route.ts # Stripe checkout session
│   │   │   │   └── webhook/route.ts  # Stripe webhook
│   │   │   └── health/route.ts
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/                # UI components (mostly client)
│   │   ├── ui/                    # shadcn/ui style components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── problems/
│   │   │   ├── ProblemCard.tsx
│   │   │   └── ProblemList.tsx
│   │   └── editor/
│   │       ├── CodeEditor.tsx
│   │       └── ResultsPanel.tsx
│   │
│   ├── server/                    # server-only code (never import into client)
│   │   ├── supabase/
│   │   │   ├── client.ts          # browser client (safe)
│   │   │   ├── server.ts          # server client (cookies/session)
│   │   │   └── admin.ts           # service role client (danger)
│   │   ├── auth/
│   │   │   ├── requireUser.ts
│   │   │   └── getUser.ts
│   │   ├── billing/
│   │   │   ├── stripe.ts
│   │   │   └── entitlements.ts
│   │   └── execution/
│   │       ├── pythonRunner.ts
│   │       └── sqlRunner.ts
│   │
│   ├── lib/                       # shared utilities (safe for client)
│   │   ├── env.ts                 # runtime-safe env parsing
│   │   ├── routes.ts              # route constants
│   │   ├── format.ts
│   │   └── validators.ts
│   │
│   ├── db/                        # data access layer (server)
│   │   ├── problems.ts
│   │   ├── attempts.ts
│   │   └── subscriptions.ts
│   │
│   ├── domain/                    # business logic (pure-ish)
│   │   ├── scoring/
│   │   │   ├── compareOutputs.ts
│   │   │   └── normalize.ts
│   │   ├── curriculum/
│   │   │   ├── sql.ts
│   │   │   └── python.ts
│   │   └── paywall/
│   │       └── canAccessMode.ts
│   │
│   ├── types/
│   │   ├── problem.ts
│   │   ├── attempt.ts
│   │   └── billing.ts
│   │
│   └── middleware.ts              # auth guard + paywall routing
│
├── public/
│   ├── logo.svg
│   └── favicon.ico
│
├── supabase/                      # optional: local supabase + migrations
│   ├── migrations/
│   └── seed.sql
│
├── .env.local
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
└── tsconfig.json
```

---

# Why this structure scales

## 1) Routes stay thin

Everything in `src/app/**` should be mostly composition:

* fetch data
* render components
* call domain/db functions

Not “business logic soup”.

## 2) You get a clean “server-only” wall

Everything under:

```text
src/server/**
src/db/**
```

…should only be imported from server components / route handlers.

A good rule:

* `components/` can be client
* `server/` and `db/` should never be imported by client components

## 3) You can add Python execution without chaos

You’ll likely evolve from:

* `/api/execute/python` (simple)
  to
* worker + queue (BullMQ) or Supabase Edge Functions or separate service

This structure won’t need rework.

---

# The “Route Groups” trick (important)

Folders like:

```text
src/app/(marketing)
src/app/(auth)
src/app/(app)
```

do NOT appear in URLs. They are purely organizational.

So you get:

* `src/app/(marketing)/pricing/page.tsx` → `/pricing`
* `src/app/(auth)/login/page.tsx` → `/login`
* `src/app/(app)/dashboard/page.tsx` → `/dashboard`

It keeps you sane.

---

# Clean URL recommendation

I’d do:

Public:

* `/`
* `/sql`
* `/python`
* `/pricing`
* `/faq`

Authed:

* `/dashboard`
* `/dashboard/sql/crash-course`
* `/dashboard/sql/warmup`
* `/dashboard/sql/timed`
* `/dashboard/python/...`

That’s what users expect.

---

# Where your internal docs go

Exactly where you already have them:

```text
/docs
```

They’re safe.

(Again: never put docs in `/public` and never create a `/docs` route.)

---

# Practical next steps (since you said “Yes to Python + Auth early”)

If you want the “best order of operations” for this structure:

1. Generate Next.js app using `src/` directory ✅
2. Add Supabase Auth (cookie-based server session) ✅
3. Add `middleware.ts` to protect `/dashboard/**` ✅
4. Create DB schema: users, problems, attempts ✅
5. Implement `/api/execute/python` ✅
6. Add paywall gating (trial/subscription) ✅

If you want, I’ll give you the exact build steps for **Auth-first with Supabase** in App Router (the right way — server session + middleware), and then we’ll wire the Python runner next.
