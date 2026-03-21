# List Comprehensions

A list comprehension is a concise way to build a new list.

## Basic example

```python
numbers = [1, 2, 3, 4]
squares = [n * n for n in numbers]
```

This creates a new list containing the square of each number.

## Filtering example

```python
numbers = [1, 2, 3, 4, 5, 6]
evens = [n for n in numbers if n % 2 == 0]
```

This creates a new list containing only the even numbers.

## Equivalent loop version

The comprehension above is equivalent to:

```python
evens = []

for n in numbers:
    if n % 2 == 0:
        evens.append(n)
```

Both are correct. The comprehension is just shorter.

## Why this matters in coding tests

List comprehensions are common in Python solutions because they are:

- Compact
- Readable once you get used to them
- Great for filtering and transforming lists

## Common mistakes

- Trying to do too much in one comprehension
- Forgetting the order: expression first, then `for`, then optional `if`
- Using a comprehension when a normal loop would be clearer

## Interview tip

Use list comprehensions when they make the solution cleaner. If the logic gets complicated, switch to a regular loop.