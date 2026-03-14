# Aggregate Functions

Aggregate functions summarize many rows into a single value.

Common aggregates include:

- `COUNT`
- `SUM`
- `AVG`
- `MIN`
- `MAX`

## Example

```sql
SELECT COUNT(*) AS user_count
FROM users;
```

This returns the total number of rows in the table.

## Another Example

```sql
SELECT AVG(salary)
FROM employees;
```

This returns the average salary.

## Why it matters

Aggregate functions are the foundation for analytics-style interview questions.