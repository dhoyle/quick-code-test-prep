import type { PythonQuestion } from "@/lib/question-types";

export const PYTHON_WARMUP_QUESTIONS: PythonQuestion[] = [
  {
    track: "python",
    slug: "add-two-numbers",
    title: "Add Two Numbers",
    promptText:
      "Write a function named add_numbers that takes a and b and returns their sum.",
    expectedFunctionName: "add_numbers",
    requiredTokens: ["def add_numbers", "return", "a + b"],
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
    requiredTokens: ["def is_even", "return", "n % 2", "== 0"],
    acceptedPatterns: [
      "def is_even(n): return n % 2 == 0",
      "def is_even(n): return (n % 2) == 0",
    ],
  },
  {
    track: "python",
    slug: "first-item",
    title: "First Item in List",
    promptText:
      "Write a function named first_item that takes a list items and returns the first element.",
    expectedFunctionName: "first_item",
    requiredTokens: ["def first_item", "return", "items[0]"],
  },
  {
    track: "python",
    slug: "reverse-string",
    title: "Reverse String",
    promptText:
      "Write a function named reverse_string that takes a string text and returns the reversed string.",
    expectedFunctionName: "reverse_string",
    requiredTokens: ["def reverse_string", "return", "text"],
    acceptedPatterns: [
      "def reverse_string(text): return text[::-1]",
      "def reverse_string(text): return text[:: -1]",
    ],
  },
  {
    track: "python",
    slug: "sum-list",
    title: "Sum a List",
    promptText:
      "Write a function named sum_list that takes a list of numbers and returns the total.",
    expectedFunctionName: "sum_list",
    requiredTokens: ["def sum_list", "return", "sum("],
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
    requiredTokens: ["def find_max", "return", "max("],
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
    requiredTokens: ["def filter_evens", "return", "for", "% 2", "== 0"],
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
    requiredTokens: [
      "def count_items",
      "for",
      "return",
      "counts",
      ".get(",
    ],
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
    requiredTokens: ["def count_vowels", "for", "return", "text"],
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
    requiredTokens: ["def contains_value", "return", "target in items"],
    acceptedPatterns: [
      "def contains_value(items, target): return target in items",
    ],
  },
];