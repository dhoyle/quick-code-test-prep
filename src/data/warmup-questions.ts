export type WarmupQuestion = {
  slug: string;
  title: string;
  promptText: string;
};

export const SQL_WARMUP_QUESTIONS: WarmupQuestion[] = [
  {
    slug: "basic-select",
    title: "Basic SELECT",
    promptText:
      "Write a SQL query that returns the name and age columns from the users table.",
  },
  {
    slug: "where-filter",
    title: "WHERE Filter",
    promptText:
      "Write a SQL query that returns all users whose age is greater than or equal to 18.",
  },
  {
    slug: "order-by-scores",
    title: "ORDER BY Scores",
    promptText:
      "Write a SQL query that returns the name and score columns from the leaderboard table, sorted by score from highest to lowest.",
  },
  {
    slug: "top-five-users",
    title: "Top 5 Users",
    promptText:
      "Write a SQL query that returns the top 5 users from the leaderboard table by score.",
  },
];