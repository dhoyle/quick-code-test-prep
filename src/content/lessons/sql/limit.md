# LIMIT

`LIMIT` restricts the number of rows returned by a query.

## Example

```sql
SELECT name, score
FROM leaderboard
ORDER BY score DESC
LIMIT 10;
```

This returns the top 10 scores.

`DESC` sorts results in descending order, while `ASC` sorts them in ascending order.

If no direction is specified, SQL usually defaults to `ASC`. 

## Why it matters

Many interview questions ask for things like:

- The top 5 users
- The highest salary
- The most recent order

These usually combine `ORDER BY` with `LIMIT`.