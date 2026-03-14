# CASE WHEN

`CASE WHEN` adds conditional logic to SQL queries.

## Example

```sql
SELECT name,
  CASE
    WHEN age < 18 THEN 'minor'
    WHEN age >= 18 THEN 'adult'
  END AS age_group
FROM users;
```

This creates a new `age_group` column categorizing users. The `CASE` expression assigns a value to that column based on the conditions defined in the `WHEN` clauses. This column exists only in the query result and is not added to the table.

## Why it matters

`CASE` is often used in reporting queries and interview problems involving conditional grouping.