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

This selects the name of each person from the users table and uses a `CASE` expression to categorize them as either 'minor' or 'adult' based on their age. A new column named `age_group` is created in the query result to display this category for each user. The `CASE` expression assigns the value shown in `age_group` based on the conditions defined in the `WHEN` clauses. This column exists only in the query result and is not added to the table.

## Why it matters

`CASE` is often used in reporting queries and interview problems involving conditional grouping.