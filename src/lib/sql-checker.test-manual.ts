import { checkSqlAttempt } from "./sql-checker";

function logCase(name: string, result: unknown) {
  console.log(`\n=== ${name} ===`);
  console.dir(result, { depth: null });
}

const caseA = checkSqlAttempt({
  userAnswer: "SELECT customer_id FROM orders;",
  expectedIncludes: ["select", "select", "from orders", "from orders"],
  forbiddenIncludes: [],
  acceptedPatterns: [],
  expectedColumns: [],
});

logCase("Case A - duplicate expectedIncludes", caseA);

const caseB = checkSqlAttempt({
  userAnswer: "SELECT * FROM orders;",
  expectedIncludes: ["select", "from orders"],
  forbiddenIncludes: ["select *", "SELECT *", " select   * "],
  acceptedPatterns: [],
  expectedColumns: [],
});

logCase("Case B - duplicate forbiddenIncludes", caseB);

const caseC = checkSqlAttempt({
  userAnswer: "SELECT customer_id, customer_id AS cid, orders.customer_id FROM orders;",
  expectedIncludes: ["select", "from orders"],
  forbiddenIncludes: [],
  acceptedPatterns: [],
  expectedColumns: ["order_id"],
});

logCase("Case C - duplicate unexpected columns", caseC);