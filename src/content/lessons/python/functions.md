# Functions

Functions are the core of most Python interview questions.

## Basic structure

A function usually has:

- A name
- Parameters
- A return value

```python
def add_numbers(a, b):
    return a + b
```    

This function: 

- is named `add_numbers`
- takes two inputs: `a` and `b`
- returns their sum

When you call it:

```python
add_numbers (2,3)
```

It returns:

```python
5
```


## More examples

```python
def is_even(n):
    return n % 2 == 0
```

This function checks whether a number is even.

- `%` means “remainder”
- `n % 2 == 0` means “n divides evenly by 2”

```python
def first_item(items):
    return items[0]
```

This function returns the first element of a list.

## Why "return" matters

A lot of coding test mistakes come from computing the answer but not returning it.

Wrong:

```python
def add_numbers(a, b):
    total = a + b
```  

This computes the value, but never returns it.

Correct:

```python
def add_numbers(a, b):
    total = a + b
    return total
```

## Why this matters in coding tests

Most prompts say:

- “Write a function named ...”
- “Return ...”
- “Given a list ...”

That means you should focus on the function signature and the returned value.

## Common mistakes

- Wrong function name
- Wrong parameter names
- Forgetting `return`
- Using a variable that was never defined

## Interview tip

Match the function name and parameter names from the prompt whenever possible.