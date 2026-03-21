# Strings

Strings are one of the most common input types in Python interview questions.

A string is a sequence of characters:

```python
text = "hello"
```

This stores "hello" in `text`. 

## Indexing

You can access individual characters by position:

```python 
text = "hello"
first = text[0]
last = text[-1]
```

This stores "h" in `first` and "o" in `last`.

In Python, element numbering (indexing) starts at 0 for sequence types such as lists and strings. 

## Slicing

You can get part of a string using slicing:

```python
text = "hello"
part = text[1:4]
```

This returns "ell".

## Common string methods

```python
text = "  Hello  "
cleaned = text.strip().lower()
```

This code:

- Removes extra spaces with `strip()`
- Converts the string to lowercase with `lower()`

## Membership checks
```python
text = "banana"
has_a = "a" in text
```

This checks whether "a" appears anywhere in the string.

## Looping through characters
```python
for ch in text:
    print(ch)
```

This goes through the string one character at a time and prints each character to the console on a new line.

## Example: reverse a string

```python
def reverse_string(text):
    return text[::-1]
```

This returns the characters of the string in reverse order.

## Example: count vowels

```python
def count_vowels(text):
    total = 0

    for ch in text.lower():
        if ch in "aeiou":
            total += 1

    return total
```

This loops through the string one character at a time and counts how many vowels appear.

## Why this matters in coding tests

Strings show up in problems such as:

- Reverse a string
- Count vowels
- Check whether a character appears
- Normalize text before comparing it

## Common mistakes

- Off-by-one slicing errors
- Forgetting strings are zero-indexed
- Confusing `text[1:4]` with `text[1]`
- Not normalizing case before comparisons

## Interview tip

If a prompt involves text, think in terms of:

- Indexing
- Slicing
- Looping
- Normalization with methods such as `lower()` or `strip()`