# DISTINCT

`DISTINCT` removes duplicate rows from the result set.

## Example

```sql
SELECT DISTINCT department
FROM users;
```

This query returns each department only once, even if multiple users belong to the same department.

## Why it matters

SQL interview questions often ask for unique values, such as a list of departments, cities, or categories. `DISTINCT` is the standard way to remove duplicates from results.