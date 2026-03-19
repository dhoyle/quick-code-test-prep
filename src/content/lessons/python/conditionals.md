# Conditionals

Conditionals let your code make decisions.

## Basic syntax

```python
if score >= 90:
    return "A"
else:
    return "Not A"
```

This code checks whether score is at least 90. If it is, it returns "A". Otherwise, it returns "Not A".

You can also use `elif` for additional branches:

```python
if n > 0:
    return "positive"
elif n < 0:
    return "negative"
else:
    return "zero"
```

This checks three cases in order:

- positive
- negative
- zero

## Boolean checks

```python
if n % 2 == 0:
    return True
return False
```

This checks whether `n` is even. If it is, the function returns `True`. Otherwise, it returns `False`.

## Why this matters in coding tests

Many warmup-style problems are just conditional logic:

- even vs. odd
- empty vs. non-empty
- positive vs. negative
- found vs. not found

## Common mistakes

- Using `=` instead of `==`
- Forgetting the colon `:`
- Returning the wrong value for one branch

## Interview tip

For simple yes/no problems, write the check directly and return it when possible.