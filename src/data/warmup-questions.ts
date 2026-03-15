export type WarmupQuestion = {
  slug: string;
  title: string;
  promptText: string;
  expectedIncludes: string[];
  forbiddenIncludes?: string[];
  acceptedPatterns?: string[];
};

export const SQL_WARMUP_QUESTIONS: WarmupQuestion[] = [
  {
    slug: "basic-select",
    title: "Basic SELECT",
    promptText:
      "Write a SQL query that returns the name and age columns from the users table.",
    expectedIncludes: ["select", "name", "age", "from users"],
    forbiddenIncludes: ["serial", "*"],
    acceptedPatterns: [
      "select name, age from users",
      "select age, name from users",
    ],
  },
  {
    slug: "where-filter",
    title: "WHERE Filter",
    promptText:
      "Write a SQL query that returns all users whose age is greater than or equal to 18.",
    expectedIncludes: ["select", "from users", "where", "age", ">=", "18"],
  },
  {
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
    slug: "top-five-users",
    title: "Top 5 Users",
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
    slug: "count-users",
    title: "COUNT Users",
    promptText:
      "Write a SQL query that returns the total number of rows in the users table.",
    expectedIncludes: ["select", "count(", "from users"],
  },
  {
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
];