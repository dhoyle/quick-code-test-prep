# HAVING

`HAVING` filters groups created by `GROUP BY`.

## Example

```sql
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 10;
```

This returns departments with more than 10 employees.

## Why not WHERE?

`WHERE` filters rows before grouping.

`HAVING` filters groups after grouping.

## Why it matters

Many SQL interview questions require filtering aggregated results.