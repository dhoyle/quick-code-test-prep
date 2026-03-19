# Variables and Types

Python lets you store values in variables without declaring the type first. The type is inferred automatically based on the value you assign to the variable. 

## Examples

```python
name = "David"
age = 42
price = 19.99
is_ready = True
```

This code creates four variables:

- `name` stores text
- `age` stores a whole number
- `price` stores a decimal number
- `is_ready` stores a boolean value

Common built-in types:

- `int` for whole numbers
- `float` for decimal numbers
- `str` for text
- `bool` for booleans (true/false)
- `list` for ordered collections
- `dict` for key/value pairs

## Why this matters in coding tests

Most interview questions start with simple inputs:

- numbers
- strings
- lists
- dictionaries

You need to be comfortable reading and returning these values quickly.

## Quick examples

```python
x = 10
y = 5
total = x + y
```

This creates two number variables and stores their sum in `total`.

```python
text = "hello"
first_letter = text[0]
```

This stores a string and then selects its first character.

```python
items = [10, 20, 30]
first_item = items[0]
```
This creates a list and selects the first item using index `0`.

## Common mistakes

- Mixing up strings and numbers
- Forgetting that Python is case-sensitive
- Using the wrong variable name later in the function

## Interview tip

Use simple variable names that match the prompt. If the prompt says `n`, use `n`. If it says `items`, use `items`.

