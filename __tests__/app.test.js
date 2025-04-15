const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const fastifyApp = require("../app");
const users = require("../db/data/test-data/users");

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
        console.log(JSON.stringify(body));
        const usersArray = body.users;
        expect(Array.isArray(usersArray)).toBe(true);
        expect(usersArray.length).toBe(4);

        usersArray.forEach((user) => {
          expect(typeof user.user_id).toBe("number");
          expect(typeof user.first_name).toBe("string");
          expect(typeof user.last_name).toBe("string");
          expect(typeof user.email).toBe("string");
          expect(typeof user.address).toBe("string");
          expect(typeof user.date_of_birth).toBe("string");
          expect(typeof user.fav_food).toBe("string");
          expect(typeof user.personality).toBe("string");
          expect(typeof user.bio).toBe("string");
          expect(typeof user.gender).toBe("string");
          expect(typeof user.reason).toBe("string");
          expect(typeof user.job_title).toBe("string");
          // expect(typeof user.pet_owner).toBe("string");
          expect(typeof user.coffee_tea).toBe("string");
          expect(typeof user.image_url).toBe("string");
        });
      });
  });
});
