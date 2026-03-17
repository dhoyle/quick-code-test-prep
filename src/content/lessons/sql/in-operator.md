# IN

`IN` checks whether a value matches any value in a list.

## Example

```sql
SELECT name, department
FROM users
WHERE department IN ('Sales', 'Marketing', 'HR');
```

This query returns users whose department is Sales, Marketing, or HR.

## Why it matters

`IN` is cleaner than writing multiple `OR` conditions. SQL interview questions often use it for matching one value against a known list of acceptable values.