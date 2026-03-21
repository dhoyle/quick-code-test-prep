# Operators

Operators are the symbols Python uses to do math and make comparisons.

## Arithmetic operators

- `+` add
- `-` subtract
- `*` multiply
- `/` divide
- `%` remainder

Example:

```python
total = 2 + 3
```

This adds 2 and 3 and stores the result in `total`.

```python
remainder = 7 % 2
```

This returns the remainder after dividing 7 by 2, which is 1.

## Comparison operators

- `==` equal to
- `!=` not equal to
- `>` greater than
- `<` less than
- `>=` greater than or equal to
- `<`=` less than or equal to

Example:

```python
score = 85
passed = score >= 70
```

This checks whether the score is at least 70 and stores the result (`True` or `False`) in `passed`.

## Example: checking even vs odd

```python
n = 8
is_even = n % 2 == 0
```

This first computes the remainder of `n` divided by 2, then checks whether that remainder is 0.

## Example: comparing values

```python
a = 10
b = 7
a_is_larger = a > b
```

This compares two values and stores whether `a` is greater than `b`.

## Example: building conditions

```python
age = 20

if age >= 18:
    result = "adult"
else:
    result = "minor"
```

This uses a comparison operator inside a condition to decide which value to assign.

## Why this matters in coding tests

Operators show up in basic interview questions all the time:

- Adding numbers
- Checking even vs odd
- Comparing values
- Building conditions

## Common mistakes

- Using `=` instead of `==`
- Forgetting what `%` does
- Mixing up arithmetic and comparison expressions

## Interview tip

If a prompt says “greater than,” “equal to,” or “even,” think about which operator matches that wording.