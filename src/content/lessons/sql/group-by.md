# GROUP BY

`GROUP BY` is used with aggregate functions to summarize rows.

## Example

```sql
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;
```

This returns one row per department with a count of employees.

## Why it matters

Grouping shows up often in analytics-style interview questions.