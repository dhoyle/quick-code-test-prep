import type { SqlQuestion } from "@/lib/question-types";

export const SQL_WARMUP_QUESTIONS: SqlQuestion[] = [
  {
    track: "sql",
    slug: "basic-select",
    title: "Basic SELECT",
    promptText:
      "Write a SQL query that returns the name and age columns from the users table.",
    expectedIncludes: ["select", "from users"],
    forbiddenIncludes: ["serial", "*"],
    acceptedPatterns: [
      "select name, age from users",
      "select age, name from users",
    ],
    expectedColumns: ["name", "age"],
  },
  {
    track: "sql",
    slug: "where-filter",
    title: "WHERE Filter",
    promptText:
      "Write a SQL query that returns all users whose age is greater than or equal to 18.",
    expectedIncludes: ["select", "from users", "where", "age", ">=", "18"],
  },
  {
    track: "sql",
    slug: "order-by-scores",
    title: "ORDER BY Scores",
    promptText:
      "Write a SQL query that returns the name and score columns from the leaderboard table, sorted by score from highest to lowest.",
    expectedIncludes: [
      "select",
      "name",
      "score",
      "from leaderboard",
      "order by",
      "score",
      "desc",
    ],
  },
  {
    track: "sql",
    slug: "top-five-users",
    title: "LIMIT Top 5 Users",
    promptText:
      "Write a SQL query that returns the top 5 users from the leaderboard table by score.",
    expectedIncludes: [
      "select",
      "from leaderboard",
      "order by",
      "score",
      "desc",
      "limit 5",
    ],
  },
  {
    track: "sql",
    slug: "count-users",
    title: "COUNT Users",
    promptText:
      "Write a SQL query that returns the total number of rows in the users table.",
    expectedIncludes: ["select", "count(", "from users"],
  },
  {
    track: "sql",
    slug: "group-by-department",
    title: "GROUP BY Department",
    promptText:
      "Write a SQL query that returns each department and the number of employees in that department from the employees table.",
    expectedIncludes: [
      "select",
      "department",
      "count(",
      "from employees",
      "group by department",
    ],
  },
  {
    track: "sql",
    slug: "having-departments",
    title: "HAVING Departments",
    promptText:
      "Write a SQL query that returns departments with more than 10 employees from the employees table.",
    expectedIncludes: [
      "select",
      "department",
      "count(",
      "from employees",
      "group by department",
      "having",
      "> 10",
    ],
  },
  {
    track: "sql",
    slug: "inner-join-orders",
    title: "INNER JOIN Orders",
    promptText:
      "Write a SQL query that returns users.name and orders.total by joining the users and orders tables on users.id = orders.user_id.",
    expectedIncludes: [
      "select",
      "users.name",
      "orders.total",
      "from users",
      "join orders",
      "on",
      "users.id",
      "orders.user_id",
    ],
  },
  {
    track: "sql",
    slug: "left-join-orders",
    title: "LEFT JOIN Orders",
    promptText:
      "Write a SQL query that returns all users and any matching order totals by left joining users to orders on users.id = orders.user_id.",
    expectedIncludes: [
      "select",
      "users.name",
      "orders.total",
      "from users",
      "left join orders",
      "on",
      "users.id",
      "orders.user_id",
    ],
  },
  {
    track: "sql",
    slug: "case-age-group",
    title: "CASE Age Group",
    promptText:
      "Write a SQL query that returns name and a computed column age_group that shows 'minor' when age < 18 and 'adult' otherwise.",
    expectedIncludes: [
      "select",
      "name",
      "case",
      "when",
      "age < 18",
      "then 'minor'",
      "else 'adult'",
      "end as age_group",
      "from users",
    ],
  },
  {
    track: "sql",
    slug: "distinct-departments",
    title: "DISTINCT Departments",
    promptText:
      "Write a SQL query that returns the distinct department names from the employees table.",
    expectedIncludes: ["select", "distinct", "department", "from employees"],
  },
  {
    track: "sql",
    slug: "distinct-cities",
    title: "DISTINCT Cities",
    promptText:
      "Write a SQL query that returns the distinct city values from the users table.",
    expectedIncludes: ["select", "distinct", "city", "from users"],
  },
  {
    track: "sql",
    slug: "null-emails",
    title: "NULL Emails",
    promptText:
      "Write a SQL query that returns all users whose email is NULL.",
    expectedIncludes: ["select", "from users", "where", "email is null"],
  },
  {
    track: "sql",
    slug: "not-null-emails",
    title: "NOT NULL Emails",
    promptText:
      "Write a SQL query that returns all users whose email is NOT NULL.",
    expectedIncludes: ["select", "from users", "where", "email is not null"],
  },
  {
    track: "sql",
    slug: "between-salaries",
    title: "BETWEEN Salaries",
    promptText:
      "Write a SQL query that returns all employees whose salary is between 50000 and 100000.",
    expectedIncludes: [
      "select",
      "from employees",
      "where",
      "salary between 50000 and 100000",
    ],
  },
  {
    track: "sql",
    slug: "between-ages",
    title: "BETWEEN Ages",
    promptText:
      "Write a SQL query that returns all users whose age is between 18 and 30.",
    expectedIncludes: [
      "select",
      "from users",
      "where",
      "age between 18 and 30",
    ],
  },
  {
    track: "sql",
    slug: "in-departments",
    title: "IN Departments",
    promptText:
      "Write a SQL query that returns all employees whose department is either 'Sales' or 'Marketing'.",
    expectedIncludes: [
      "select",
      "from employees",
      "where",
      "department in",
      "'sales'",
      "'marketing'",
    ],
  },
  {
    track: "sql",
    slug: "in-status",
    title: "IN Status",
    promptText:
      "Write a SQL query that returns all orders whose status is either 'pending' or 'shipped'.",
    expectedIncludes: [
      "select",
      "from orders",
      "where",
      "status in",
      "'pending'",
      "'shipped'",
    ],
  },
];