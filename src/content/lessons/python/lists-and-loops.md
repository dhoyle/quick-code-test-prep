# Lists and Loops

Lists are one of the most common input types in Python coding tests.

## Lists

```python
numbers = [1, 2, 3, 4]
```

This creates a list with four values.

### Access items by index

```python
first = numbers[0]
last = numbers[-1]
```

This selects the first and last items in the list.

### Looping through a list 

```python
for n in numbers:
    print(n)
```

This loops through the list one item at a time.

### Building a new list

```python
def filter_evens(numbers):
    result = []

    for n in numbers:
        if n % 2 == 0:
            result.append(n)

    return result
```

This function loops through the input list, keeps only even values, and returns a new list.

### List comprehensions

A shorter version of the same idea:

```python
def filter_evens(numbers):
    return [n for n in numbers if n % 2 == 0]
```

This does the same filtering in one line.

## Why this matters in coding tests

A huge number of problems involve:

- Scanning a list
- Filtering values
- Summing values
- Finding max/min
- Transforming items

## Common mistakes

- Off-by-one errors
- Using the wrong variable inside a loop
- Forgetting to return the result
- Appending to the wrong list

## Interview tip

If you blank on list comprehensions, use a normal `for` loop. Clear and correct is better than fancy.