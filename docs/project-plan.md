React/Next/Vercel/Supabase/Stripe is a strategic choice. It’s a steeper ramp than Django, but it gives me **transferable skills** (and it’s a very standard startup stack.

Below is a concrete, **12-week ship plan + architecture**, optimized for “new to JS ecosystem, but must launch.”

---

# Stack Locked

* **Frontend/App:** Next.js (App Router)
* **Auth/DB:** Supabase (Auth + Postgres)
* **Deploy:** Vercel
* **Payments:** Stripe (subscription + 7-day trial)
* **AI calls:** Server-side (Next.js Route Handlers) with secrets in Vercel env vars

Bluehost: use it later for marketing/WordPress if you want; for the app itself, Vercel is the path of least pain.

---

# V1 Product Pages

Public (no auth required):

* `/` (home)
* `/sql` (SQL landing: show crash course lesson titles + warmup/timed descriptions)
* `/python` (same)
* `/pricing`
* `/faq`

Authed:

* `/app` (dashboard)
* `/app/sql` (start crash course / warmup / timed)
* `/app/sql/crash-course`
* `/app/sql/warmup`
* `/app/sql/timed`
* `/app/python/...` (later)

Paywall logic:

* Public pages show everything.
* Clicking **Start** → login/signup → if no active trial/subscription → checkout.

---

# Repo Structure

```
/app
  /(marketing)
    page.tsx
    sql/page.tsx
    python/page.tsx
    pricing/page.tsx
    faq/page.tsx
  /(auth)
    login/page.tsx
    callback/route.ts
  /(app)
    app/page.tsx
    app/sql/page.tsx
    app/sql/crash-course/page.tsx
    app/sql/warmup/page.tsx
    app/sql/timed/page.tsx

/lib
  supabase/
    client.ts        (browser client)
    server.ts        (server client)
    middleware.ts    (session)
  billing/
    stripe.ts
  content/
    sql-crash-course.ts  (lesson titles + content later)
  eval/
    schemas.ts
    prompts.ts

/app/api
  /eval/sql-warmup/route.ts
  /eval/sql-timed/route.ts
  /stripe/checkout/route.ts
  /stripe/webhook/route.ts
```

---

# Supabase Data Model (Minimal but Real)

Tables:

### `profiles`

* `id` uuid (PK, same as auth user id)
* `email`
* `created_at`

### `entitlements`

* `user_id` uuid (PK)
* `status` text (`trialing` | `active` | `inactive`)
* `current_period_end` timestamp (nullable)
* `trial_end` timestamp (nullable)
* `stripe_customer_id` text (nullable)
* `stripe_subscription_id` text (nullable)
* `updated_at`

### `attempts`

* `id` uuid (PK)
* `user_id` uuid
* `skill` text (`sql` | `python`)
* `mode` text (`crash_course` | `warmup` | `timed`)
* `version` text (e.g. `v1`)
* `started_at`, `submitted_at`
* `status` text (`in_progress` | `submitted` | `expired`)
* `score_overall` int (nullable)
* `summary_json` jsonb (nullable)

### `attempt_answers`

* `id` uuid (PK)
* `attempt_id` uuid
* `question_key` text (e.g. `warmup_q1`, `timed_q2`)
* `answer_text` text
* `feedback_json` jsonb (nullable)
* `score` int (nullable)
* `created_at`

Row Level Security (RLS):

* user can only read/write their own rows.

This is enough for V1.

---

# Paywall + Trial (How it Works)

**Flow**

1. User clicks “Start Warmup”
2. If not logged in → login/signup
3. If logged in but not entitled → send to Stripe Checkout for $29/mo with 7-day trial
4. Stripe webhook updates `entitlements` table
5. App gates `/app/*` actions based on entitlements

**Important**: do not try to “guess” subscription status client-side. Always check entitlements server-side.

---

# Evaluation (LLM) Architecture

You already defined structured JSON for feedback. Implementation pattern:

* Client submits SQL text → `/api/eval/sql-warmup`
* Server route handler:

  * checks entitlement
  * calls model
  * validates JSON against a schema (Zod)
  * stores feedback_json + score
  * returns feedback to UI

Key reliability tactic:

* If model output fails schema validation: automatically retry once with “return valid JSON only” instruction.

This is the difference between toy and product.

---

# Autosave (Simple V1)

For warmup/timed text input:

* Use `localStorage` autosave every ~2–3 seconds
* On navigation/submit, persist to DB

Timed test timer:

* Server stores `started_at`
* Client computes remaining time = 20m – (now – started_at)
* If it hits zero → mark attempt expired, show results screen (or submit as-is)

This mimics real timers and survives refresh.

---

# Learning Ramp (So You Don’t Stall)

You’ll learn best by building thin vertical slices.

## Week 1 goal: Deployed skeleton

* Create Next.js app
* Deploy to Vercel
* Create Supabase project
* Implement auth
* Public SQL page + “Start” button → login → dashboard

If you can do that, you’re in business.

## Week 2 goal: SQL Warmup Q1 end-to-end (no AI yet)

* store attempt + answer
* show on screen
* basic scoring stub (hardcoded)

## Week 3 goal: AI evaluation working + JSON validation

* now warmup becomes real

Then replicate Q2–Q5.

Only after SQL warmup is solid:

* crash course content pages
* timed test page

Then Python.

---

# 12-Week Sprint Plan (Realistic)

### Weeks 1–2: Platform foundation

* Next.js + Vercel
* Supabase auth + RLS
* Entitlements table + gating middleware
* Public marketing pages

### Weeks 3–5: SQL Warmup

* Warmup UI + autosave
* Attempts + answers + feedback storage
* Evaluation API routes + schema validation
* Summary screen

### Weeks 6–7: SQL Crash Course

* Content pages + lesson navigation
* Mini exercises (optional in V1; you can ship lesson text first)

### Weeks 8–9: SQL Timed Test

* Timer + sequential questions
* End-of-test evaluation + readiness bands

### Weeks 10–11: Stripe

* Checkout + webhook
* Trial gating
* Account billing page (minimal)

### Week 12: Beta + launch

* 20–30 testers
* bug fixes + UX cleanup
* launch

---

# Your next action list (do these in order)

1. Install Node + VS Code tooling (if not already)
2. Create Next.js app (App Router)
3. Create Supabase project
4. Implement auth (Supabase SSR pattern)
5. Deploy to Vercel (first deployment)
6. Add `/sql` public landing page + lesson title list (static data file)
7. Add “Start” button that requires auth


