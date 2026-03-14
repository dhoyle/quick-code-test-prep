# ORDER BY

`ORDER BY` sorts the results of a query.

## Example

```sql
SELECT name, age
FROM users
ORDER BY age DESC;
```

This returns users sorted from oldest to youngest. 

`DESC` sorts results in descending order, while `ASC` sorts them in ascending order.

If no direction is specified, SQL usually defaults to `ASC`.

## Multiple Columns

```sql
SELECT department, salary
FROM employees
ORDER BY department, salary DESC;
```

Rows are sorted by department first, then salary within each department.

## Why it matters

Many coding tests require sorting results before applying limits or aggregations.