# Common Patterns

Once you know variables, functions, conditionals, and loops, most beginner Python interview problems reduce to a few patterns.

## Pattern 1: Membership check

```python
def contains_value(items, target):
    return target in items
```

This checks whether `target` appears in the list.

## Pattern 2: Count occurrences

```python
def count_items(items):
    counts = {}

    for item in items:
        counts[item] = counts.get(item, 0) + 1

    return counts
```

This builds a dictionary where each key is an item and each value is the number of times that item appears.

## Pattern 3: Aggregate values

```python
def sum_list(numbers):
    return sum(numbers)
```

This returns the total of all numbers in the list.

## Pattern 4: Find a max value

```python
def find_max(numbers):
    return max(numbers)
```

This returns the largest value in the list.

## Pattern 5: Scan a string

```python
def count_vowels(text):
    total = 0

    for ch in text.lower():
        if ch in "aeiou":
            total += 1

    return total
```

This loops through the string and counts vowels one character at a time.

## Why this matters in coding tests

If you recognize the pattern quickly, you can solve simple timed questions much faster.

Ask yourself:

- Am I checking membership?
- Am I counting things?
- Am I filtering a list?
- Am I scanning characters?
- Am I returning one value or a new collection?

## Interview tip

When stuck, start with the simplest loop that could work. You can optimize later if needed.