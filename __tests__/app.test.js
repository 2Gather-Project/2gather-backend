const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const fastifyApp = require("../app");

let server;

beforeAll(async () => {
  await fastifyApp.ready();
  server = fastifyApp.server; // this gives Supertest the Node http.Server
});

beforeEach(() => {
  return seed(data);
});

afterAll(async () => {
  await fastifyApp.close(); // close Fastify
  await db.end(); // close db pool
});

describe("GET /api", () => {
  test("200: responds with API endpoints documentation", () => {
    return request(server)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/users", () => {
  test("200: reponds with a object users that contains an array with all the users in the db", () => {
    return request(server)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
      });
  });
});
