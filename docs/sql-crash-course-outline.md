# SQL Crash Course (30-Minute Version)

## Interview-Focused Foundations

---

## Overview

The SQL Crash Course is a fast, interview-focused refresher covering the most common topics that appear in SQL code tests.

It is not a full SQL course.

It is designed to:

* Refresh core syntax quickly
* Reinforce high-probability interview patterns
* Build enough confidence to complete Warmup and Timed Tests

Estimated total time: ~30 minutes
(If it takes a little longer, that’s fine — the goal is readiness, not speed.)

Structure: 4 short lessons

---

# Lesson Structure Template (Applies to All Lessons)

Each lesson includes:

1. Why This Matters (1–2 sentences)
2. Core Concept Explanation (short and direct)
3. One Guided Example
4. One Mini Exercise (graded with structured feedback)

No branching.
No long theory.
No deep performance optimization.

This is about interview readiness.

---

# Lesson 1: SELECT + WHERE

## Why This Matters

Basic filtering shows up constantly in code tests.
If you can confidently write clean SELECT queries, you won’t freeze on the fundamentals.

---

## Core Concepts

* SELECT columns
* FROM table
* WHERE filtering
* Basic operators (=, >, <, >=, <=, IN, LIKE)

Example:

```sql
SELECT name, age
FROM users
WHERE age > 18;
```

What’s happening:

* SELECT chooses columns
* FROM chooses the table
* WHERE filters rows

---

## Guided Example

Table: `orders`

Columns:

* id
* customer_id
* total
* status

Example:

```sql
SELECT id, total
FROM orders
WHERE status = 'shipped';
```

Short explanation:

* We are retrieving only shipped orders.
* We are selecting only relevant columns (cleaner than `SELECT *`).

---

## Mini Exercise

Prompt:

“Select all columns from the `customers` table where country = 'USA'.”

User writes query.
System evaluates syntax + filtering logic.

---

# Lesson 2: GROUP BY + Aggregation

## Why This Matters

Many interview questions involve counting, summing, or grouping data.
If you understand GROUP BY, you can solve most aggregation problems.

---

## Core Concepts

* COUNT()
* SUM()
* AVG()
* GROUP BY
* HAVING

Example:

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id;
```

What’s happening:

* Rows are grouped by customer_id.
* COUNT(*) counts rows within each group.
* Each group produces one result row.

---

## Guided Example

“Find total sales per customer.”

```sql
SELECT customer_id, SUM(total) AS total_sales
FROM orders
GROUP BY customer_id;
```

---

## Mini Exercise

“Count how many orders each status has.”

Expected pattern:

```sql
SELECT status, COUNT(*) 
FROM orders
GROUP BY status;
```

---

## Window Functions (Lite)

### Why This Matters

Window functions often appear in SQL screens because they solve ranking and “top per group” problems cleanly.

You don’t need to master them — just recognize and use one common pattern.

---

### Core Idea

A window function computes values across related rows **without collapsing them** like GROUP BY does.

Most common interview pattern:
Ranking within a group.

---

### Example: Rank Orders Per Customer

```sql
SELECT
  customer_id,
  order_id,
  total,
  ROW_NUMBER() OVER (
    PARTITION BY customer_id 
    ORDER BY total DESC
  ) AS rn
FROM orders;
```

What’s happening:

* PARTITION BY defines the group.
* ORDER BY defines ranking order.
* ROW_NUMBER() assigns 1, 2, 3… within each group.

---

### Micro Exercise

“Return each customer’s highest total order using `ROW_NUMBER()`.”

Hint for user:
Filter where `rn = 1`.

We are not teaching advanced window patterns in v1.

---

# Lesson 3: JOINs (Most Important Lesson)

## Why This Matters

JOINs are extremely common in code tests.
If you can connect two tables confidently, you’re ahead of most candidates.

---

## Core Concepts

* INNER JOIN
* LEFT JOIN
* ON condition
* Matching primary and foreign keys

Example:

```sql
SELECT customers.name, orders.total
FROM customers
JOIN orders
ON customers.id = orders.customer_id;
```

What’s happening:

* We connect two tables.
* The ON clause defines how rows match.
* Only matching rows are returned (INNER JOIN).

---

## Guided Example

Tables:

* users(id, name)
* subscriptions(user_id, plan)

Example:

```sql
SELECT users.name, subscriptions.plan
FROM users
LEFT JOIN subscriptions
ON users.id = subscriptions.user_id;
```

Short explanation:

* LEFT JOIN keeps all users.
* Users without subscriptions will have NULL plan values.

---

## Mini Exercise

“Write a query to show each customer's name and their order total.”

Expected pattern:
JOIN customers and orders using matching IDs.

---

# Lesson 4: Subqueries + NULL Handling

## Why This Matters

Subqueries and NULL logic often trip people up under pressure.

Understanding them prevents simple mistakes.

---

## Core Concepts

* Subquery inside WHERE
* IN (subquery)
* IS NULL
* IS NOT NULL

---

## Example: Subquery

```sql
SELECT name
FROM customers
WHERE id IN (
  SELECT customer_id
  FROM orders
);
```

What’s happening:

* The inner query returns customer IDs.
* The outer query filters customers to those IDs.

---

## NULL Handling Example

```sql
SELECT *
FROM products
WHERE price IS NOT NULL;
```

Important:

* NULL is not compared using `=`.
* Use IS NULL / IS NOT NULL.

---

## Guided Example

“Find customers who have not placed orders.”

Pattern:
LEFT JOIN + WHERE orders.id IS NULL
or
NOT IN (subquery)

---

## Mini Exercise

“Select products where price IS NOT NULL.”

---

# Completion Flow

After Lesson 4:

Display:

“You’ve covered the most common SQL topics that show up in code tests.

Now try the Warmup to activate your skills.”

Button:
→ Start SQL Warmup

---

# Scope Guardrails (v1)

This crash course intentionally does NOT include:

* Deep window function variations
* CTE deep dives
* Indexing and performance tuning
* Query optimization strategies
* Advanced nested queries
* Database design theory

Goal:
Fast functional readiness — not mastery.


