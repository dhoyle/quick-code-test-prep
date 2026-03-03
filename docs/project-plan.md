React/Next/Vercel/Supabase/Stripe is a strategic choice. It’s a steeper ramp than Django, but it gives me **transferable skills** (and it’s a very standard startup stack.

Below is a concrete, **12-week ship plan + architecture**, optimized for “new to JS ecosystem, but must launch.”

It reflects:

* Modern JS stack (Next.js + Supabase + Vercel + Stripe)
* Full SQL track
* Full Python track (parity)
* Realistic pacing for someone learning the stack
* Vertical-first execution discipline
* Not artificially constrained to 12 weeks

---


# Quick Code Test Prep
## Project Plan (SQL + Python v1)

---

# Vision

Ship a production-ready web app that helps users prepare quickly (under ~2 hours) for SQL and Python interview code tests.

Primary transformation:
Rusty and anxious → prepared and steady.

v1 includes:

- SQL Crash Course
- SQL Warmup
- SQL Timed Test
- Python Crash Course
- Python Warmup
- Python Timed Test
- 7-day free trial
- $29/month subscription

---

# Guiding Principles

1. Build vertically, not horizontally.
2. Finish SQL completely before starting Python.
3. Ship something usable before optimizing.
4. Keep UI simple and clean.
5. Favor clarity over cleverness.
6. Avoid premature complexity.

---

# Architecture (Locked)

Frontend:
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Backend:
- Next.js Route Handlers
- Supabase (Auth + Postgres)

Deployment:
- Vercel

Payments:
- Stripe subscription with 7-day trial

Evaluation:
- LLM calls via server routes
- Structured JSON validation
- Retry-on-invalid-output safeguard

---

# Phase 1 — Platform Foundation (Weeks 1–3)

Goal: Deployable, authenticated app skeleton.

Deliverables:

- Next.js project scaffolded
- GitHub repo
- Vercel deployment
- Supabase project
- Magic link authentication
- Protected `/app` route
- Basic dashboard
- Public marketing pages (`/`, `/sql`, `/python`, `/pricing`)
- Environment variables configured
- Initial database schema:
  - profiles
  - entitlements
  - attempts
  - attempt_answers
- Row Level Security policies
- Entitlement check middleware

Exit criteria:
User can sign up, log in, and access protected pages.

---

# Phase 2 — SQL Vertical Slice (Weeks 4–8)

## 2A — SQL Warmup (Core Product)

Deliverables:

- Warmup UI (5 questions)
- Text input with autosave
- Attempt creation on start
- Per-question submission
- Evaluation API route
- Structured JSON schema validation
- Feedback panel
- Summary screen
- Scores persisted to DB

Exit criteria:
SQL Warmup works end-to-end in production.

---

## 2B — SQL Crash Course

Deliverables:

- Lesson navigation UI
- Lesson content pages
- Mini exercises (graded)
- Completion flow → Warmup CTA

Exit criteria:
Crash Course → Warmup feels seamless.

---

## 2C — SQL Timed Test

Deliverables:

- 20-minute continuous timer
- Sequential question flow
- Server-backed timer logic
- End-of-test evaluation
- Readiness bands
- Attempt expiration handling

Exit criteria:
Timed test simulates realistic screen.

---

# Phase 3 — Billing & Paywall (Weeks 8–9)

Deliverables:

- Stripe Checkout integration
- 7-day free trial
- Webhook endpoint
- Entitlements table updates
- Subscription gating for `/app/*`
- Basic billing page

Exit criteria:
Trial + subscription gating works in production.

---

# Phase 4 — Python Track (Weeks 9–14)

Replicate SQL structure.

## 4A — Python Crash Course

Topics:

- Lists and loops
- Dictionaries
- Functions
- Basic data transformations
- JSON handling

Deliverables:
Same structure as SQL Crash Course.

---

## 4B — Python Warmup

5 progressive drills:

1. Basic list filtering
2. Dictionary transformation
3. Loop + condition logic
4. Function writing
5. Slightly multi-step transformation

Deliverables:
Full evaluation pipeline using structured JSON scoring.

---

## 4C — Python Timed Test

Single scenario with 2–3 related tasks.

Concepts tested:
- Data transformation
- Aggregation logic
- Clean function structure

Same timer and evaluation logic as SQL.

Exit criteria:
Python track reaches parity with SQL.

---

# Phase 5 — Beta & Launch

Deliverables:

- 20–50 beta testers
- Bug fixes
- UX polish
- Landing page refinement
- Clear messaging
- Trial conversion tracking
- Basic analytics (PostHog or Vercel Analytics)

Launch condition:
- SQL fully stable
- Python fully functional
- Stripe tested
- No critical evaluation bugs

---

# Risks

- Underestimating LLM evaluation edge cases
- Subscription gating bugs
- Overbuilding UI
- Getting stuck in frontend polish
- Scope creep into advanced topics

Mitigation:
- Schema validation
- Keep UI minimal
- Ship SQL before touching Python
- No v2 features before launch

---

# Definition of Done (v1)

The product is v1-complete when:

- User can sign up
- Start free trial
- Complete SQL crash course
- Complete SQL warmup
- Complete SQL timed test
- Complete Python crash course
- Complete Python warmup
- Complete Python timed test
- Receive structured feedback
- View past attempts
- Cancel subscription

---

# Non-Goals (v1)

- Resume upload
- Job description tailoring
- Company-specific test packs
- Advanced analytics
- Gamification
- Community features
- Mobile app

---

# Long-Term Vision (Post v1)

- Resume-aware prep
- Adaptive difficulty
- Skill decay reminders
- Company simulation packs
- Behavioral interview mode
- Additional languages

---

# Current Focus

Build SQL fully.
Then replicate for Python.

No parallel development.
No premature expansion.
Ship something real.


---

This gives you:

* Clear macro roadmap
* Clean phase breakdown
* Explicit exit criteria
* Risk awareness
* Scope guardrails





