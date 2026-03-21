# Common Built-ins

Python has built-in functions that solve many simple interview tasks quickly.

## len()

```python
items = [10, 20, 30]
count = len(items)
```

This returns the number of items in the list.

## sum()

```python
numbers = [1, 2, 3]
total = sum(numbers)
```

This returns the total of all numbers.

## max() and min()

```python
numbers = [5, 1, 9]
largest = max(numbers)
smallest = min(numbers)
```

These return the largest and smallest values.

## sorted()

```python
numbers = [3, 1, 2]
ordered = sorted(numbers)
```

This returns a new sorted list.

## range()

```python
for i in range(3):
    print(i)
```

This prints:

0
1
2

`range(n)` is commonly used when you need to loop a specific number of times.

## Why this matters in coding tests

Many interview questions can be solved faster and more clearly by using built-ins instead of writing everything from scratch.

## Common mistakes

- Confusing `sorted()` with `.sort()`
- Using `max()` or `min()` on an empty list
- Forgetting that `range(3)` stops before 3

## Interview tip

Use built-ins when they make the solution simpler and clearer. In Python, that is usually a good sign, not a shortcut to avoid.