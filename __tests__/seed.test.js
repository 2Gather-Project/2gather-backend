const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("seed", () => {
  describe("users table", () => {
    test("users table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
                    SELECT FROM
                        information_schema.tables
                    WHERE
                        table_name = 'users'
                    );`,
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
  });
});
