# NULL Handling

`NULL` represents a missing or unknown value in SQL. To check for `NULL`, use `IS NULL` or `IS NOT NULL`.

## Example

```sql
SELECT name
FROM users
WHERE manager_id IS NULL;
```

This query returns users who do not have a manager assigned.

## Why it matters

A very common SQL mistake is writing `= NULL` or `!= NULL`, which does not work the way people expect. Interview questions often test whether you know how to correctly filter missing values.