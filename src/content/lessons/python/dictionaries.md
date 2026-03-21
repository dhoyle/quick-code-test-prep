# Dictionaries

A dictionary stores key-value pairs.

```python
person = {
    "name": "David",
    "age": 42
}
```

In this example:

- A dictionary named `person` is created with two key-value pairs
- "name" and "age" are keys
- "David" and 42 are values

## Looking up values

```python
person = {"name": "David", "age": 42}
name = person["name"]
```

This retrieves the value associated with the "name" key and assigns it to a new variable called `name`. After this executes, the variable `name` contains the string "David". 

## Using .get()

```python
counts = {}
value = counts.get("apple", 0)
```

This looks up "apple" in the dictionary. If it is not present, it returns 0.

## Counting occurrences

One of the most useful dictionary patterns is counting:

```python
def count_items(items):
    counts = {}

    for item in items:
        counts[item] = counts.get(item, 0) + 1

    return counts
```

This builds a dictionary where each key is an item and each value is the number of times that item appears.

## Example: storing lookups

```python
scores = {
    "alice": 95,
    "bob": 88
}

bob_score = scores["bob"]
```

This uses a dictionary to store values that can be looked up by key.

## Example: grouping data

```python
def group_words_by_length(words):
    grouped = {}

    for word in words:
        length = len(word)

        if length not in grouped:
            grouped[length] = []

        grouped[length].append(word)

    return grouped
```

This groups words by their length. The keys are lengths, and the values are lists of words.

## Example: tracking seen values

```python
def first_repeat(items):
    seen = {}

    for item in items:
        if item in seen:
            return item

        seen[item] = True

    return None
```

This uses a dictionary to track whether an item has already been seen.

## Checking whether a key exists

```python
person = {"name": "David"}

if "name" in person:
    print("found")
```

This checks whether the dictionary contains a given key.

## Why this matters in coding tests

Dictionaries are extremely common in interview questions:

- Counting frequencies
- Storing lookups
- Grouping data
- Tracking seen values

## Common mistakes

- Forgetting to initialize an empty dictionary with {}
- Using `dict[key]` when the key may not exist
- Mixing up keys and values
- Updating the wrong key inside a loop

## Interview tip

If you need to count, group, or look things up quickly, a dictionary is often the right tool.