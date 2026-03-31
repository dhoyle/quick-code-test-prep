import { describe, it, expect } from "vitest";
import { checkSqlAttempt } from "./sql-checker";

describe("checkSqlAttempt", () => {
  describe("basic correctness", () => {
    it("returns correct when all expected fragments are present", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT name FROM users",
        expectedIncludes: ["select", "from users"],
      });
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(100);
      expect(result.missing).toEqual([]);
    });

    it("returns incorrect when a required fragment is missing", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT name FROM users",
        expectedIncludes: ["select", "from orders"],
      });
      expect(result.isCorrect).toBe(false);
      expect(result.missing).toContain("from orders");
    });

    it("matching is case-insensitive", () => {
      const result = checkSqlAttempt({
        userAnswer: "select name from users",
        expectedIncludes: ["SELECT", "FROM users"],
      });
      expect(result.isCorrect).toBe(true);
    });

    it("ignores trailing semicolons", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT name FROM users;",
        expectedIncludes: ["select", "from users"],
      });
      expect(result.isCorrect).toBe(true);
    });

    it("normalizes extra whitespace", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT   name   FROM   users",
        expectedIncludes: ["select", "from users"],
      });
      expect(result.isCorrect).toBe(true);
    });
  });

  describe("score calculation", () => {
    it("scores 100 when all fragments match", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT id, name FROM orders WHERE status = 'active'",
        expectedIncludes: ["select", "from orders", "where"],
      });
      expect(result.score).toBe(100);
    });

    it("scores proportionally when some fragments are missing", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT name FROM users",
        expectedIncludes: ["select", "from users", "where", "order by"],
      });
      expect(result.score).toBe(50); // 2 of 4 matched
    });

    it("scores 0 when no fragments match", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT name FROM users",
        expectedIncludes: ["group by", "having", "order by"],
      });
      expect(result.score).toBe(0);
    });

    it("scores 0 when expectedIncludes is empty", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT * FROM users",
        expectedIncludes: [],
      });
      expect(result.score).toBe(0);
    });
  });

  describe("forbiddenIncludes", () => {
    it("marks as incorrect when a forbidden fragment is found", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT * FROM orders",
        expectedIncludes: ["select", "from orders"],
        forbiddenIncludes: ["select *"],
      });
      expect(result.isCorrect).toBe(false);
      expect(result.forbiddenMatched).toContain("select *");
    });

    it("deducts 25 points per forbidden match", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT * FROM orders",
        expectedIncludes: ["select", "from orders"],
        forbiddenIncludes: ["select *"],
      });
      // base score 100, minus 25 for one forbidden = 75
      expect(result.score).toBe(75);
    });

    it("deducts for multiple distinct forbidden matches", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT * FROM orders WHERE 1=1",
        expectedIncludes: ["select", "from orders"],
        forbiddenIncludes: ["select *", "where 1=1"],
      });
      // base 100 - 50 = 50
      expect(result.score).toBe(50);
    });

    it("does not score below 0 from forbidden deductions", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT * FROM orders",
        expectedIncludes: ["select"],
        forbiddenIncludes: ["select *", "from orders", "orders", "select", "*"],
      });
      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    it("deduplicates forbidden fragments before checking", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT * FROM orders",
        expectedIncludes: ["select", "from orders"],
        forbiddenIncludes: ["select *", "SELECT *", " select   * "],
      });
      // only one unique forbidden fragment matched, so -25
      expect(result.score).toBe(75);
      expect(result.forbiddenMatched).toHaveLength(1);
    });
  });

  describe("acceptedPatterns", () => {
    it("accepts an exact pattern match and overrides score to 100", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT id FROM orders",
        expectedIncludes: ["nonexistent"],
        acceptedPatterns: ["SELECT id FROM orders"],
      });
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(100);
    });

    it("does not accept a non-matching pattern", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT id FROM users",
        expectedIncludes: ["nonexistent"],
        acceptedPatterns: ["SELECT id FROM orders"],
      });
      expect(result.isCorrect).toBe(false);
    });

    it("pattern matching is case-insensitive and whitespace-normalized", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT   id   FROM   orders;",
        expectedIncludes: [],
        acceptedPatterns: ["select id from orders"],
      });
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(100);
    });
  });

  describe("expectedColumns", () => {
    it("penalizes unexpected columns in SELECT", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT id, name FROM users",
        expectedIncludes: ["select", "from users"],
        expectedColumns: ["id"],
      });
      // name is not in expectedColumns
      expect(result.isCorrect).toBe(false);
      expect(result.unexpectedColumns).toContain("name");
    });

    it("does not penalize when SELECT columns match expectedColumns", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT id, name FROM users",
        expectedIncludes: ["select", "from users"],
        expectedColumns: ["id", "name"],
      });
      expect(result.isCorrect).toBe(true);
      expect(result.unexpectedColumns).toEqual([]);
    });

    it("strips table prefix from column names", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT users.id FROM users",
        expectedIncludes: ["from users"],
        expectedColumns: ["id"],
      });
      expect(result.unexpectedColumns).toEqual([]);
    });

    it("strips AS aliases from column names", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT id AS user_id FROM users",
        expectedIncludes: ["from users"],
        expectedColumns: ["id"],
      });
      expect(result.unexpectedColumns).toEqual([]);
    });

    it("deduplicates repeated column references", () => {
      const result = checkSqlAttempt({
        userAnswer:
          "SELECT customer_id, customer_id AS cid, orders.customer_id FROM orders",
        expectedIncludes: ["select", "from orders"],
        expectedColumns: ["order_id"],
      });
      // All three resolve to customer_id — only one unexpected column
      expect(result.unexpectedColumns).toHaveLength(1);
      expect(result.unexpectedColumns).toContain("customer_id");
    });

    it("does not check columns when expectedColumns is empty", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT a, b, c FROM t",
        expectedIncludes: ["select", "from t"],
        expectedColumns: [],
      });
      expect(result.unexpectedColumns).toEqual([]);
      expect(result.isCorrect).toBe(true);
    });
  });

  describe("deduplication of expectedIncludes", () => {
    it("counts duplicate expectedIncludes as one", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT customer_id FROM orders",
        expectedIncludes: ["select", "select", "from orders", "from orders"],
      });
      // After dedup: 2 unique fragments, both matched
      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(100);
    });
  });

  describe("matched and missing arrays", () => {
    it("populates matched with found fragments", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT id FROM users WHERE id = 1",
        expectedIncludes: ["select", "from users", "where", "order by"],
      });
      expect(result.matched).toContain("select");
      expect(result.matched).toContain("from users");
      expect(result.matched).toContain("where");
    });

    it("populates missing with absent fragments", () => {
      const result = checkSqlAttempt({
        userAnswer: "SELECT id FROM users",
        expectedIncludes: ["select", "from users", "where", "order by"],
      });
      expect(result.missing).toContain("where");
      expect(result.missing).toContain("order by");
    });
  });
});
