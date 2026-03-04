Good question — this is one of the places where **Next.js project structure can look confusing at first**.

Short answer:

* Your **repo root stays the repo root**
* `src/` is just where **application code lives**
* Your **docs folder stays at the repo root**

You **do not** need a second repo or a nested repo.

Below is the clean structure I recommend for **Quick Code Test Prep**.

---

# Recommended Repo Structure

```
quick-code-test-prep/
│
├── docs/                     # Internal planning docs (private)
│   ├── project-plan.md
│   ├── product-spec.md
│   ├── architecture.md
│   └── roadmap.md
│
├── src/                      # All application code
│   │
│   ├── app/                  # Next.js App Router pages
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx          # /
│   │   │
│   │   ├── sql/
│   │   │   └── page.tsx      # /sql landing
│   │   │
│   │   ├── python/
│   │   │   └── page.tsx      # /python landing
│   │   │
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   │
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   │
│   │   └── app/              # Authenticated area
│   │       │
│   │       ├── layout.tsx
│   │       ├── page.tsx      # /app dashboard
│   │       │
│   │       ├── sql/
│   │       │   ├── page.tsx
│   │       │   ├── crash-course/
│   │       │   │   └── page.tsx
│   │       │   ├── warmup/
│   │       │   │   └── page.tsx
│   │       │   └── timed/
│   │       │       └── page.tsx
│   │       │
│   │       └── python/
│   │           └── page.tsx
│   │
│   ├── components/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Navbar.tsx
│   │   └── ProblemCard.tsx
│   │
│   ├── lib/                  # API + utilities
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   └── problems.ts
│   │
│   ├── types/
│   │   └── index.ts
│
├── public/                   # Public assets
│   ├── logo.png
│   └── favicon.ico
│
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

# Key Idea: `src/` vs Repo Root

Think of it like this:

```
repo root = project container
src = application code
```

Example:

```
repo root
   ├── docs
   ├── src
   └── package.json
```

Next.js is simply configured to **look inside `src/` for code**.

---

# Why this structure is good

### 1️⃣ Docs are completely private

```
/docs
```

* not served by Next
* not bundled
* not exposed to users

Safe.

---

### 2️⃣ Clean separation

```
src/app → routes
src/components → UI
src/lib → backend helpers
src/types → TS types
```

This prevents the project from becoming messy as it grows.

---

### 3️⃣ Your route structure maps cleanly

Example:

```
src/app/page.tsx
```

becomes

```
/
```

```
src/app/sql/page.tsx
```

becomes

```
/sql
```

```
src/app/app/sql/warmup/page.tsx
```

becomes

```
/app/sql/warmup
```

---

# Auth Guard Structure (Important)

You will later protect everything under:

```
src/app/app/*
```

with middleware.

Example:

```
middleware.ts
```

```
if user not logged in:
    redirect to /login
```

That keeps:

```
/app/*
```

private.

---

# Optional (Nice Improvement)

Some teams rename the authenticated section to avoid `/app/app`.

Example:

```
src/app/dashboard
```

Then:

```
/dashboard
/dashboard/sql
/dashboard/python
```

Cleaner URLs.

I personally recommend this:

```
src/app/dashboard/*
```

instead of

```
src/app/app/*
```

---

# My Suggested Final Routes

Public:

```
/
/sql
/python
/pricing
/faq
/login
/signup
```

Private:

```
/dashboard
/dashboard/sql
/dashboard/sql/warmup
/dashboard/sql/timed
/dashboard/python
```

Cleaner and more professional.

---

# One small change I'd recommend before you start

Inside `docs/`, add:

```
docs/
  architecture.md
  database-schema.md
  project-plan.md
  roadmap.md
  monetization.md
```

It will help a lot once the project grows.

---

# If you'd like, I can also show you the **production-grade structure** that most SaaS apps eventually move to (used by Vercel / Stripe style apps).

It's slightly different and **much better for scaling**, but still simple enough for a solo project.
