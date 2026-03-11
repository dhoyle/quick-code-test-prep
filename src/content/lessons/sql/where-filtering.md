# WHERE Filtering

`WHERE` filters rows before they are returned.

## Example

```sql
SELECT name, age
FROM users
WHERE age >= 18;
```

This returns only users who are 18 or older.

## Why it matters

Filtering is one of the most common interview tasks because it shows whether you can translate requirements into conditions.