# BETWEEN

`BETWEEN` filters values within an inclusive range.

## Example

```sql
SELECT name, age
FROM users
WHERE age BETWEEN 18 AND 30;
```

This query returns users whose age is between 18 and 30, including both 18 and 30.

## Why it matters

Interview questions often ask for values within a date range, salary range, or numeric range. `BETWEEN` is a concise way to express those filters.