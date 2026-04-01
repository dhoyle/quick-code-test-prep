Let me pull up your actual test file first so the draft uses your real code examples rather than made-up ones.Got all 26 tests. Now I have everything I need to write a draft that uses your real code. Here it is:

---

# How I Added Unit Tests to a Next.js Project Using Vitest (and Why It Matters for Portfolio Projects)

I recently built a SQL and Python interview prep app using Next.js, TypeScript, Supabase, and Vercel. The core of the app is a custom SQL answer checker — a function that evaluates whether a user's SQL query contains the right keywords, avoids forbidden patterns, and selects the right columns.

It worked, and I smoke tested it manually. But I didn't have any unit tests, so I couldn't *prove* it worked. That's where Vitest came in.

## Why test a portfolio project?

Portfolio projects often skip tests. That's understandable — you're moving fast, learning the stack, and trying to ship something real. But tests matter for two reasons that go beyond code quality:

First, they force you to think clearly about edge cases. Writing a test for "what if the user types `SELECT *` with extra whitespace?" reveals assumptions you didn't know you'd made.

Second, they're a conversation starter. Instead of saying "I wrote a SQL checker," you can say "I wrote a SQL checker with 26 unit tests covering correctness, scoring, forbidden patterns, and column validation." That's a different conversation entirely.

## Why Vitest for a Next.js project?

The most common testing framework you'll hear about is Jest. Vitest is the modern alternative — it's faster, natively supports TypeScript without extra configuration, and works seamlessly with Vite-based toolchains. Since Next.js plays well with Vitest out of the box, it was the natural choice here.

## Setting it up

I used Claude Code (Anthropic's agentic CLI tool) to scaffold the test setup. It created three things:

A `vitest.config.ts` file to handle path aliases:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

And two new scripts in `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

That's it. No Babel config, no transform setup, no fighting with Jest's TypeScript support. It just worked.

## What the tests actually look like

The function being tested is `checkSqlAttempt()` — it takes a user's SQL answer and a set of rules, and returns a score, a pass/fail result, and arrays of matched and missing fragments.

Here's a basic test:

```typescript
import { describe, it, expect } from "vitest";
import { checkSqlAttempt } from "./sql-checker";

describe("basic correctness", () => {
  it("returns correct when all expected fragments are present", () => {
    const result = checkSqlAttempt({
      userAnswer: "SELECT name FROM users",
      expectedIncludes: ["select", "from users"],
    });
    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
  });

  it("matching is case-insensitive", () => {
    const result = checkSqlAttempt({
      userAnswer: "select name from users",
      expectedIncludes: ["SELECT", "FROM users"],
    });
    expect(result.isCorrect).toBe(true);
  });
});
```

Clean, readable, and self-documenting. Anyone reading this immediately understands what the checker does and what "correct" means.

## What 26 tests actually cover

The tests are organized into seven describe blocks:

- **Basic correctness** — full match, missing fragments, case-insensitivity, semicolons, extra whitespace
- **Score calculation** — 100%, partial credit, 0%, empty rules
- **Forbidden includes** — detecting bad patterns like `SELECT *`, applying 25-point deductions per match, flooring at 0
- **Accepted patterns** — exact match overrides that bypass normal scoring
- **Expected columns** — catching unexpected columns, stripping table prefixes and `AS` aliases, deduplication
- **Deduplication** — ensuring duplicate rules count as one
- **Matched/missing arrays** — verifying the feedback arrays are populated correctly

One of the more interesting edge cases: if a user writes `SELECT customer_id, customer_id AS cid, orders.customer_id FROM orders`, all three references resolve to the same column after normalization. The test verifies that only one unexpected column is reported, not three.

## Where Claude Code helped — and where I still had to think

Claude Code generated the test scaffolding and all 26 tests in about two minutes. That's the kind of mechanical acceleration that's genuinely valuable.

But the tests are only as good as the logic they're testing. Understanding *why* forbidden fragments should deduct 25 points per match, *why* column aliases need stripping, *why* deduplication matters — that reasoning came from building and manually testing the checker first. Claude Code can write tests for logic it can see, but it can't define what correct behavior *should be* on your behalf.

That distinction matters. AI accelerates execution. Humans still define the rules.

## Run it yourself

If you want to try it locally:

```bash
git clone https://github.com/dhoyle/quick-code-test-prep.git
cd quick-code-test-prep
npm install
npm test
```

You should see 26 passing tests across 7 test suites.

## The takeaway for other portfolio builders

If your project has any pure logic — a function that takes input and returns output — it's testable. And tested code tells a better story than untested code, especially when you're trying to demonstrate engineering judgment alongside writing or product skills.

Vitest makes the setup cost low enough that there's no good reason not to.
