# Quick Code Test Prep

A lightweight interview prep platform for SQL and Python built with Next.js, Supabase, and deployed on Vercel.

## 🌐 Live Demo
[Add your Vercel URL here]

## 🧠 Why This Project Exists

This project started as an attempt to build a fast, focused interview-prep tool that helps candidates prepare for SQL and Python code tests in under 2 hours.

The core idea:
- Skip bloated platforms
- Focus on *signal* (what interviewers actually look for)
- Provide structured practice: Crash Course → Warmups → Timed Tests

After building and testing the concept, I concluded the market is already well-served by platforms such as DataLemur and W3Schools. 

However, the project became a valuable way to:

- Learn modern frontend architecture (Next.js + Vercel)
- Implement a real auth + data backend (Supabase)
- Explore AI-assisted development workflows
- Practice shipping and iterating quickly

## ⚙️ Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Backend**: Supabase (Postgres + Auth)
- **Deployment**: Vercel
- **Styling**: Tailwind
- **AI Assistance**: ChatGPT + Gemini (implementation + iteration)

## 🏗️ Architecture Overview

- Public marketing pages (no auth)
- Auth-gated app dashboard
- Learning tracks:
  - Crash Course (guided concepts)
  - Warmup Tests (untimed)
  - Timed Tests (interview simulation)
- Supabase handles:
  - User auth
  - Session storage
  - Test history

## ✨ Key Features

- Structured learning flow (not random question dumping)
- Warmups vs. timed modes (reduces anxiety vs. simulates pressure)
- Simple evaluation logic for SQL answers
- Session tracking for timed tests

## 🤖 AI-Assisted Development

AI tools were used to:
- Scaffold components and routes
- Generate and refine SQL and Python question sets
- Debug issues (React keys, state handling, etc.)
- Accelerate iteration

AI was *not* used blindly:
- Architecture decisions were human-driven
- Edge cases required manual reasoning
- UI/UX required iterative judgment

## 📉 Why I Didn’t Pursue This Further

After building an MVP, I evaluated competitors and realized:
- The space is already saturated
- Existing platforms offer deeper question banks and brand trust
- Differentiation would require significantly more time and scope

Rather than continue, I chose to:
- Treat this as a learning + portfolio project
- Focus on communicating the build and decisions clearly

## 🚀 What I Learned

- How to structure a modern Next.js app (App Router, layouts, routing)
- How to integrate Supabase for auth + persistence
- How Vercel simplifies deployment and iteration
- Where AI accelerates development—and where it doesn’t
- The importance of validating product ideas early

## 🛠️ Local Setup

```bash
git clone https://github.com/your-username/quick-code-test-prep.git
cd quick-code-test-prep
npm install
npm run dev
```
Create a .env.local file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## License

[MIT](https://mit-license.org/)