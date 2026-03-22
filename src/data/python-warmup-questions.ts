import type { PythonQuestion } from "@/lib/question-types";

export const PYTHON_WARMUP_QUESTIONS: PythonQuestion[] = [
  {
    track: "python",
    slug: "add-two-numbers",
    title: "Add Two Numbers",
    promptText:
      "Write a function named add_numbers that takes a and b and returns their sum.",
    expectedFunctionName: "add_numbers",
    requiredTokens: ["def add_numbers", "return", "+"],
    acceptedPatterns: [
      "def add_numbers(a, b): return a + b",
      "def add_numbers(a,b): return a+b",
    ],
  },
  {
    track: "python",
    slug: "is-even",
    title: "Check Even Number",
    promptText:
      "Write a function named is_even that takes n and returns True if n is even, otherwise False.",
    expectedFunctionName: "is_even",
    requiredTokens: ["def is_even", "return", "%", "== 0"],
    acceptedPatterns: [
      "def is_even(n): return n % 2 == 0",
    ],
  },
  {
    track: "python",
    slug: "first-item",
    title: "First Item in List",
    promptText:
      "Write a function named first_item that takes a list items and returns the first element.",
    expectedFunctionName: "first_item",
    requiredTokens: ["def first_item", "return", "[0]"],
    acceptedPatterns: [
      "def first_item(items): return items[0]",
    ],
  },
  {
    track: "python",
    slug: "reverse-string",
    title: "Reverse String",
    promptText:
      "Write a function named reverse_string that takes a string text and returns the reversed string.",
    expectedFunctionName: "reverse_string",
    requiredTokens: ["def reverse_string", "return"],
    acceptedPatterns: [
      "def reverse_string(text): return text[::-1]",
    ],
  },
  {
    track: "python",
    slug: "sum-list",
    title: "Sum a List",
    promptText:
      "Write a function named sum_list that takes a list of numbers and returns the total.",
    expectedFunctionName: "sum_list",
    requiredTokens: ["def sum_list", "return"],
    acceptedPatterns: [
      "def sum_list(numbers): return sum(numbers)",
      "def sum_list(nums): return sum(nums)",
    ],
  },
  {
    track: "python",
    slug: "find-max",
    title: "Find Maximum",
    promptText:
      "Write a function named find_max that takes a list of numbers and returns the largest value.",
    expectedFunctionName: "find_max",
    requiredTokens: ["def find_max", "return"],
    acceptedPatterns: [
      "def find_max(numbers): return max(numbers)",
      "def find_max(nums): return max(nums)",
    ],
  },
  {
    track: "python",
    slug: "filter-evens",
    title: "Filter Even Numbers",
    promptText:
      "Write a function named filter_evens that takes a list of numbers and returns a new list containing only the even numbers.",
    expectedFunctionName: "filter_evens",
    requiredTokens: ["def filter_evens", "return"],
    acceptedPatterns: [
      "def filter_evens(numbers): return [n for n in numbers if n % 2 == 0]",
      "def filter_evens(nums): return [n for n in nums if n % 2 == 0]",
    ],
  },
  {
    track: "python",
    slug: "count-items",
    title: "Count Items with Dictionary",
    promptText:
      "Write a function named count_items that takes a list items and returns a dictionary with counts for each item.",
    expectedFunctionName: "count_items",
    requiredTokens: ["def count_items", "for", "return"],
    acceptedPatterns: [
      "def count_items(items): counts = {}; for item in items: counts[item] = counts.get(item, 0) + 1; return counts",
    ],
  },
  {
    track: "python",
    slug: "count-vowels",
    title: "Count Vowels",
    promptText:
      "Write a function named count_vowels that takes a string text and returns the number of vowels in it.",
    expectedFunctionName: "count_vowels",
    requiredTokens: ["def count_vowels", "for", "return"],
    acceptedPatterns: [
      "def count_vowels(text): return sum(1 for ch in text if ch.lower() in 'aeiou')",
    ],
  },
  {
    track: "python",
    slug: "contains-value",
    title: "Check List Contains Value",
    promptText:
      "Write a function named contains_value that takes a list items and a target value and returns True if target is in the list, otherwise False.",
    expectedFunctionName: "contains_value",
    requiredTokens: ["def contains_value", "return", "in"],
    acceptedPatterns: [
      "def contains_value(items, target): return target in items",
    ],
  },
  {
    track: "python",
    slug: "string-length",
    title: "String Length",
    promptText:
      "Write a function named string_length that takes a string text and returns its length.",
    expectedFunctionName: "string_length",
    requiredTokens: ["def string_length", "return"],
    acceptedPatterns: [
      "def string_length(text): return len(text)",
      "def string_length(s): return len(s)",
    ],
  },
  {
    track: "python",
    slug: "normalize-text",
    title: "Normalize Text",
    promptText:
      "Write a function named normalize_text that takes a string text and returns the lowercase version with leading and trailing spaces removed.",
    expectedFunctionName: "normalize_text",
    requiredTokens: ["def normalize_text", "return", ".strip()", ".lower()"],
    acceptedPatterns: [
      "def normalize_text(text): return text.strip().lower()",
      "def normalize_text(text): return text.lower().strip()",
    ],
  },
  {
    track: "python",
    slug: "get-score",
    title: "Dictionary Lookup",
    promptText:
      "Write a function named get_score that takes a dictionary scores and a name, and returns the value for that name.",
    expectedFunctionName: "get_score",
    requiredTokens: ["def get_score", "return"],
    acceptedPatterns: [
      "def get_score(scores, name): return scores[name]",
      "def get_score(scores, name): return scores.get(name, 0)",
    ],
  },
  {
    track: "python",
    slug: "has-key",
    title: "Check Dictionary Key",
    promptText:
      "Write a function named has_key that takes a dictionary data and a key, and returns True if the key exists in the dictionary, otherwise False.",
    expectedFunctionName: "has_key",
    requiredTokens: ["def has_key", "return", "in"],
    acceptedPatterns: [
      "def has_key(data, key): return key in data",
    ],
  },
  {
    track: "python",
    slug: "unique-items",
    title: "Unique Items with Set",
    promptText:
      "Write a function named unique_items that takes a list items and returns a set of the unique values.",
    expectedFunctionName: "unique_items",
    requiredTokens: ["def unique_items", "return", "set("],
    acceptedPatterns: [
      "def unique_items(items): return set(items)",
    ],
  },
  {
    track: "python",
    slug: "has-duplicate",
    title: "Detect Duplicate",
    promptText:
      "Write a function named has_duplicate that takes a list items and returns True if any value appears more than once, otherwise False.",
    expectedFunctionName: "has_duplicate",
    requiredTokens: ["def has_duplicate", "return"],
    acceptedPatterns: [
      "def has_duplicate(items): return len(set(items)) != len(items)",
      "def has_duplicate(items): return len(set(items)) < len(items)",
      "def has_duplicate(nums): return len(set(nums)) != len(nums)",
      "def has_duplicate(nums): return len(set(nums)) < len(nums)",
      "def has_duplicate(items): seen = set(); for item in items: if item in seen: return True; seen.add(item); return False",
      "def has_duplicate(nums): seen = set(); for n in nums: if n in seen: return True; seen.add(n); return False",
    ],
  },
  {
    track: "python",
    slug: "square-list",
    title: "Square a List",
    promptText:
      "Write a function named square_list that takes a list of numbers and returns a new list containing the square of each value.",
    expectedFunctionName: "square_list",
    requiredTokens: ["def square_list", "return"],
    acceptedPatterns: [
      "def square_list(numbers): return [n * n for n in numbers]",
      "def square_list(nums): return [n * n for n in nums]",
    ],
  },

  // NEW QUESTIONS

  {
    track: "python",
    slug: "reverse-words",
    title: "Reverse Words",
    promptText:
      "Write a function named reverse_words that takes a string text and returns a list of the words in reverse order.",
    expectedFunctionName: "reverse_words",
    requiredTokens: ["def reverse_words", "return"],
    acceptedPatterns: [
      "def reverse_words(text): return text.split()[::-1]",
      "def reverse_words(text): return list(reversed(text.split()))",
    ],
  },
  {
    track: "python",
    slug: "is-palindrome",
    title: "Check Palindrome",
    promptText:
      "Write a function named is_palindrome that takes a string text and returns True if it reads the same forward and backward.",
    expectedFunctionName: "is_palindrome",
    requiredTokens: ["def is_palindrome", "return"],
    acceptedPatterns: [
      "def is_palindrome(text): return text == text[::-1]",
    ],
  },
  {
    track: "python",
    slug: "count-character",
    title: "Count Character",
    promptText:
      "Write a function named count_character that takes a string text and a character ch, and returns how many times ch appears.",
    expectedFunctionName: "count_character",
    requiredTokens: ["def count_character", "return"],
    acceptedPatterns: [
      "def count_character(text, ch): return text.count(ch)",
    ],
  },
  {
    track: "python",
    slug: "smallest-number",
    title: "Find Smallest Number",
    promptText:
      "Write a function named smallest_number that takes a list of numbers and returns the smallest value.",
    expectedFunctionName: "smallest_number",
    requiredTokens: ["def smallest_number", "return"],
    acceptedPatterns: [
      "def smallest_number(nums): return min(nums)",
    ],
  },
  {
    track: "python",
    slug: "remove-duplicates",
    title: "Remove Duplicates",
    promptText:
      "Write a function named remove_duplicates that takes a list items and returns a list of unique values.",
    expectedFunctionName: "remove_duplicates",
    requiredTokens: ["def remove_duplicates", "return"],
    acceptedPatterns: [
      "def remove_duplicates(items): return list(set(items))",
    ],
  },
  {
    track: "python",
    slug: "merge-lists",
    title: "Merge Two Lists",
    promptText:
      "Write a function named merge_lists that takes two lists a and b and returns a combined list.",
    expectedFunctionName: "merge_lists",
    requiredTokens: ["def merge_lists", "return"],
    acceptedPatterns: [
      "def merge_lists(a, b): return a + b",
    ],
  },
  {
    track: "python",
    slug: "invert-dictionary",
    title: "Invert Dictionary",
    promptText:
      "Write a function named invert_dictionary that swaps keys and values in a dictionary.",
    expectedFunctionName: "invert_dictionary",
    requiredTokens: ["def invert_dictionary", "return"],
    acceptedPatterns: [
      "def invert_dictionary(data): return {v: k for k, v in data.items()}",
    ],
  },
  {
    track: "python",
    slug: "double-evens",
    title: "Double Even Numbers",
    promptText:
      "Write a function named double_evens that doubles only the even numbers in a list.",
    expectedFunctionName: "double_evens",
    requiredTokens: ["def double_evens", "return"],
    acceptedPatterns: [
      "def double_evens(nums): return [n * 2 if n % 2 == 0 else n for n in nums]",
    ],
  },
  {
    track: "python",
    slug: "sum-even-numbers",
    title: "Sum Even Numbers",
    promptText:
      "Write a function named sum_even_numbers that returns the sum of even numbers in a list.",
    expectedFunctionName: "sum_even_numbers",
    requiredTokens: ["def sum_even_numbers", "return"],
    acceptedPatterns: [
      "def sum_even_numbers(nums): return sum(n for n in nums if n % 2 == 0)",
    ],
  },
];