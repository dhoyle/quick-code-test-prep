
`INNER JOIN` combines rows from two tables when a matching value exists in both.

## Example

```sql
SELECT users.name, orders.total
FROM users
INNER JOIN orders
  ON users.id = orders.user_id;
```  

This returns only users who have placed orders.

## Table Aliases

SQL queries often use **table aliases** to make queries shorter and easier to read.

For example:

```sql
SELECT u.name, o.total
FROM users u
INNER JOIN orders o
  ON u.id = o.user_id;
```

Here:

- `u` is an alias for the `users` table
- `o` is an alias for the `orders` table

So `u.name` is the same as `users.name`.

The keyword `AS` can also be used when defining aliases:

```sql
FROM users AS u
JOIN orders AS o
```

Both styles are valid, but many SQL queries omit `AS` for table aliases to keep the query shorter.

## Why it matters

Many coding tests involve combining data from multiple tables.

