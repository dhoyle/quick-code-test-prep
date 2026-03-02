
# SQL Crash Course (30-Minute Version)
## Interview-Focused Foundations

---

## Overview

The SQL Crash Course is a fast, interview-focused refresher covering the most common topics that appear in SQL code tests.

It is not a full SQL course.

It is designed to:

- Refresh core syntax quickly  
- Reinforce high-probability interview patterns  
- Build enough confidence to complete Warmup and Timed Tests  

Estimated total time: ~30 minutes  
(If it takes a little longer, that’s fine — the goal is readiness, not speed.)

Structure: 4 short lessons.

---

## Lesson Structure Template

Each lesson includes:

1. Why This Matters (1–2 sentences)
2. Core Concept Explanation
3. One Guided Example
4. One Mini Exercise (graded with structured feedback)

No branching.  
No deep theory.  
No performance tuning.  

This is about interview readiness.

---

# Lesson 1: SELECT + WHERE

## Why This Matters

Basic filtering shows up constantly in code tests.  
If you can confidently write clean SELECT queries, you won’t freeze on fundamentals.

## Core Concepts

- SELECT columns
- FROM table
- WHERE filtering
- Operators: =, >, <, >=, <=, IN, LIKE

### Example

```sql
SELECT name, age
FROM users
WHERE age > 18;
````

What’s happening:

* SELECT chooses columns
* FROM chooses the table
* WHERE filters rows

### Guided Example

```sql
SELECT id, total
FROM orders
WHERE status = 'shipped';
```

### Mini Exercise

Select all columns from `customers` where `country = 'USA'`.

---

# Lesson 2: GROUP BY + Aggregation

## Why This Matters

Aggregation questions are extremely common in interview screens.

## Core Concepts

* COUNT()
* SUM()
* AVG()
* GROUP BY
* HAVING

### Example

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id;
```

### Guided Example

```sql
SELECT customer_id, SUM(total) AS total_sales
FROM orders
GROUP BY customer_id;
```

### Mini Exercise

Count how many orders each `status` has.

---

## Window Functions (Lite)

### Why This Matters

Window functions often appear in SQL screens for ranking and “top per group” problems.

You don’t need mastery — just recognition and one common pattern.

### Core Idea

Window functions compute values across related rows **without collapsing them** like GROUP BY does.

Most common pattern: ranking within a group.

### Example

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

* `PARTITION BY` defines the group
* `ORDER BY` defines ranking order
* `ROW_NUMBER()` assigns 1, 2, 3… within each group

### Micro Exercise

Return each customer’s highest total order using `ROW_NUMBER()`.

---

# Lesson 3: JOINs

## Why This Matters

JOINs are among the most common SQL interview tasks.

If you can join tables confidently, you’re ahead of most candidates.

## Core Concepts

* INNER JOIN
* LEFT JOIN
* ON condition
* Matching primary and foreign keys

### Example

```sql
SELECT customers.name, orders.total
FROM customers
JOIN orders
  ON customers.id = orders.customer_id;
```

---

## Table Aliases (Quick Note)

In interview SQL, you’ll often see table aliases used to shorten table names.

### Example

```sql
SELECT c.name, o.total
FROM customers c
JOIN orders o
  ON c.id = o.customer_id;
```

Here:

* `customers` is aliased as `c`
* `orders` is aliased as `o`

So:

* `c.name` means `customers.name`
* `o.total` means `orders.total`

Aliases:

* Make queries shorter
* Avoid ambiguity
* Are standard practice in interviews

---

### Mini Exercise

Return each customer’s name and their order total.

---

# Lesson 4: Subqueries + NULL Handling

## Why This Matters

Subqueries and NULL logic commonly cause simple mistakes under pressure.

Understanding them prevents avoidable errors.

## Core Concepts

* Subquery inside WHERE
* IN (subquery)
* IS NULL
* IS NOT NULL

### Subquery Example

```sql
SELECT name
FROM customers
WHERE id IN (
  SELECT customer_id
  FROM orders
);
```

### NULL Handling Example

```sql
SELECT *
FROM products
WHERE price IS NOT NULL;
```

Important:

* NULL is not compared using `=`
* Use `IS NULL` / `IS NOT NULL`

---

### Mini Exercise

Select products where `price IS NOT NULL`.

---

# Completion Flow

After Lesson 4:

> “You’ve covered the most common SQL topics that show up in code tests.
> Now try the Warmup to activate your skills.”

Button:
→ Start Warmup

---

# Scope Guardrails (v1)

This crash course intentionally does NOT include:

* Deep window function variations
* CTE deep dives
* Indexing and performance tuning
* Query optimization strategies
* Advanced nested queries
* Database design theory

Goal: fast functional readiness — not mastery.


