# Sets

A set stores unique values.

```python
values = {1, 2, 3}
```
This creates a set named `values` that contains the integers 1, 2, and 3.

Unlike a list, a set does not allow duplicates.

## Creating a set from a list

```python
numbers = [1, 2, 2, 3, 3, 3]
unique_numbers = set(numbers)
```

This removes duplicates and leaves only unique values.

## Membership checks

```python
seen = {"apple", "banana"}

if "apple" in seen:
    print("found")
```

This quickly checks membership.

## Tracking seen items

```python
def has_duplicate(items):
    seen = set()

    for item in items:
        if item in seen:
            return True
        seen.add(item)

    return False
```

This function returns `True` as soon as it finds a duplicate.

## Why this matters in coding tests

Sets are useful when you need to:

- Remove duplicates
- Test membership quickly
- Track whether something has already been seen

## Common mistakes

- Using {} when you meant set()
- Forgetting that sets are unordered
- Expecting duplicate values to remain in the set

## Interview tip

If the prompt mentions uniqueness, duplicates, or “seen before”, think about whether a set would simplify the solution.