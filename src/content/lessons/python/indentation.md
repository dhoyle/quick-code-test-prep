# Indentation

Indentation is a core part of Python syntax.

Unlike many languages, Python uses indentation to define blocks of code.

## Example

```python
if n > 0:
    return "positive"
```

The `return` line is indented, so it belongs to the `if` block.

## Another example

```python
def is_even(n):
    return n % 2 == 0
```

The `return` line is part of the function because it is indented under `def`.

## Incorrect indentation

```python
if n > 0:
return "positive"
```

This will cause an error because Python expects the block under `if` to be indented.

## Why this matters in coding tests

A lot of beginner Python mistakes are not logic mistakes — they are indentation mistakes.

Your answer may be conceptually correct, but still fail if indentation is off.

## Key rule

Inside a function, loop, or conditional block, indent the nested lines by 4 spaces.

## Places where indentation matters

- functions
- `if` / `elif` / `else`
- `for` loops
- `while` loops

## Interview tip

When in doubt, write the block header first:

```python
if condition:
```    

Then press **Enter** and indent before writing the next line.