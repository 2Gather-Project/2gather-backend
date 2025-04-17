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
    test("users table has a first_name column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name= 'first_name'`,
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("first_name");
          expect(column.data_type).toBe("character varying");
        });
    });
    test("users table has a last_name column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name= 'last_name'`,
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("last_name");
          expect(column.data_type).toBe("character varying");
        });
    });
    test("users table has a email column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name= 'email'`,
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("email");
          expect(column.data_type).toBe("character varying");
        });
    });
    test("users table has a address column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name= 'address'`,
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("address");
          expect(column.data_type).toBe("character varying");
        });
    });
  });
  describe("events table", () => {
    test("events table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
                    SELECT FROM
                        information_schema.tables
                    WHERE
                        table_name = 'events'
                    );`,
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
    test("events table has event_id column as a serial", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
                      FROM information_schema.columns
                      WHERE table_name = 'events'
                      AND column_name = 'event_id';`,
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("event_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('events_event_id_seq'::regclass)",
          );
        });
    });
    test("events table has events_id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
                    FROM information_schema.table_constraints AS tc
                    JOIN information_schema.key_column_usage AS kcu
                    ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.constraint_type = 'PRIMARY KEY'
                    AND tc.table_name = 'events';`,
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("event_id");
        });
    });
    test("events table has a user_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'events'
        AND column_name= 'user_id'`,
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("user_id");
          expect(column.data_type).toBe("integer");
        });
    });
    test("events table has a user_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'events'
        AND column_name= 'title'`,
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("title");
          expect(column.data_type).toBe("character varying");
        });
    });
  });
  describe("event_user_activity table", () => {
    test("event_user_activity table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
                    SELECT FROM
                        information_schema.tables
                    WHERE
                        table_name = 'event_user_activity'
                    );`,
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
  });
  describe("friend_requests table", () => {
    test("friend_requests table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
                    SELECT FROM
                        information_schema.tables
                    WHERE
                        table_name = 'friend_requests'
                    );`,
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
  });
  describe("blocked_users table", () => {
    test("blocked_users table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
                    SELECT FROM
                        information_schema.tables
                    WHERE
                        table_name = 'blocked_users'
                    );`,
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });
  });
});
