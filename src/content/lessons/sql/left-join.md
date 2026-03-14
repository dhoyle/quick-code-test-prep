# LEFT JOIN

`LEFT JOIN` returns all rows from the left table and matching rows from the right table.

## Example

```sql
SELECT users.name, orders.total
FROM users
LEFT JOIN orders
  ON users.id = orders.user_id;
```

This returns all users, including those who have not placed any orders.

Rows from `users` that do not have a matching row in `orders` will still appear, with `NULL` values for the order columns. The columns from `orders` will contain `NULL` for those rows.

## Table Aliases

This query uses **table aliases** to make the SQL shorter and easier to read.

```sql
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o
  ON u.id = o.user_id;
```

Here:

- `u` is an alias for the `users` table
- `o` is an alias for the `orders` table

So `u.name` is the same as writing `users.name`.

The keyword `AS` can also be used when defining aliases:

```sql
FROM users AS u
LEFT JOIN orders AS o
```

Both styles are valid, but many SQL queries omit `AS` for table aliases to keep the query shorter.

## Why it matters

Interview questions often require identifying records that **do not have a match in another table**.

## Interview tip

`LEFT JOIN` is often used to find rows that do not have a matching record in another table.

```sql
SELECT users.name
FROM users
LEFT JOIN orders
  ON users.id = orders.user_id
WHERE orders.id IS NULL;
```

This query returns users who have **not placed any orders**, which is a very common interview question.