
# SQL Timed Test v1
## 20-Minute Interview Simulation

---

## Purpose

The SQL Timed Test simulates a realistic SQL interview screen with light time pressure.

It is designed to:

- Combine core SQL patterns in one scenario
- Surface hesitation under constraints
- Build confidence before a real interview
- Reinforce readiness without overwhelming the user

Estimated time: 20 minutes  
Format: 1 scenario, 3 questions  
Timer: Continuous countdown  
Feedback: Delivered at end (not per question)  

Tone: Calm but serious.

---

# Scenario

You are working with a simple e-commerce database.

## Table: customers

- id  
- name  
- country  
- signup_date  

## Table: orders

- id  
- customer_id  
- total  
- created_at  

---

# Question 1 — JOIN + Aggregation

**Prompt:**

Return each customer’s name and their total lifetime spending (SUM of order totals).  

Order results from highest total spending to lowest.

---

### Concepts Being Tested

- JOIN
- SUM()
- GROUP BY
- ORDER BY
- Basic alias usage (optional but encouraged)

---

### Typical Expected Pattern

```sql
SELECT c.name, SUM(o.total) AS total_spent
FROM customers c
JOIN orders o
  ON c.id = o.customer_id
GROUP BY c.name
ORDER BY total_spent DESC;
````

Alternate solutions are acceptable if logically correct.

---

# Question 2 — Filtering + Business Logic

**Prompt:**

Return customers who:

* Signed up after January 1, 2023
* Have placed at least one order

---

### Concepts Being Tested

* Date filtering
* JOIN
* DISTINCT or GROUP BY
* Logical filtering

---

### Typical Expected Pattern

```sql
SELECT DISTINCT c.name
FROM customers c
JOIN orders o
  ON c.id = o.customer_id
WHERE c.signup_date > '2023-01-01';
```

Alternate acceptable solution:

Using GROUP BY and HAVING COUNT(*) > 0.

---

# Question 3 — Window Function (Lite but Realistic)

**Prompt:**

Return each customer’s most recent order.

Include:

* customer name
* order id
* order total
* order date

Use a window function.

---

### Concepts Being Tested

* JOIN
* ROW_NUMBER()
* PARTITION BY
* ORDER BY
* Filtering by ranked result

---

### Typical Expected Pattern

```sql
SELECT *
FROM (
  SELECT
    c.name,
    o.id,
    o.total,
    o.created_at,
    ROW_NUMBER() OVER (
      PARTITION BY c.id
      ORDER BY o.created_at DESC
    ) AS rn
  FROM customers c
  JOIN orders o
    ON c.id = o.customer_id
) t
WHERE rn = 1;
```

---

### Alternate Acceptable Solution

Subquery using MAX(created_at).

If alternate is used:

* Accept correctness
* Encourage retry using window function
* Note that window functions are common in interviews

---

# UX Flow (Locked v1 Spec)

1. User clicks “Start Timed Test”
2. 20-minute timer begins immediately
3. Scenario is displayed at the top of the page
4. Questions are presented sequentially:

   * Q1 → Q2 → Q3
   * User can navigate back to earlier questions
5. No feedback is shown until final submission
6. Timer runs continuously (no pause)
7. Draft answers are autosaved
8. On submission or timeout:

   * Overall score
   * Per-question score
   * Strengths
   * Gaps
   * Readiness level
   * Suggested next step

---

# Evaluation Schema (Structured Output Required)

All evaluation responses must return structured JSON:

```json
{
  "overall_score": 0-100,
  "question_scores": {
    "q1": 0-100,
    "q2": 0-100,
    "q3": 0-100
  },
  "window_function_used": true,
  "strengths": ["string", "string"],
  "gaps": ["string", "string"],
  "readiness_level": "Needs Review",
  "next_step": "Warmup"
}
```

---

# Readiness Bands (v1 Heuristic)

* 85–100 → Ready
* 65–84 → Almost Ready
* Below 65 → Needs Review

Feedback tone:

* Calm
* Direct
* Specific
* Encouraging but honest
* No sarcasm
* No fluff

Example:

“You’re close. Your JOIN logic is solid, but the window function usage needs refinement. Review the Window Functions section and try again.”

---

# Scope Guardrails (v1)

This timed test does NOT include:

* CTE-heavy patterns
* Multi-table joins beyond two tables
* Advanced window functions (RANK, DENSE_RANK)
* Performance optimization questions
* Query plan analysis

Goal: simulate common real-world SQL screens — not stump users.

---

# Design Principle

This test should feel:

* Slightly challenging
* Realistic
* Fair
* Achievable

The purpose is readiness, not intimidation.

```


