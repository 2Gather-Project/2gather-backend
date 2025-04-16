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
  test("404: Responds with path not found", () => {
    return request(server)
      .get("/api/event")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Endpoint!!");
      });
  });
  test("200: Responds with all the events with sort order votes order by desc", () => {
    return request(server)
      .get("/api/events?sort_by=created_at&&order=asc")
      .expect(200)
      .then(({ body: { events } }) => {
        expect(events.length).toBe(7);
        expect(events).toBeSortedBy("created_at", { ascending: true });
        events.forEach((event) => {
          expect(typeof event.title).toBe("string");
          expect(typeof event.description).toBe("string");
          expect(typeof event.location).toBe("string");
          expect(typeof event.user_id).toBe("number");
        });
      });
  });

  test("200: Responds with all the events belonging to user_id", () => {
    return request(server)
      .get("/api/events?column_name=user_id&&value=1")
      .expect(200)
      .then(({ body: { events } }) => {
        expect(events.length).toBe(1);
        expect(events).toBeSortedBy("created_at", { ascending: true });
        events.forEach((event) => {
          console.log(event);
          expect(typeof event.title).toBe("string");
          expect(event.description).toBe(
            "Visit the museum and chat about history and life."
          );
          expect(event.status).toBe("ACTIVE");
        });
      });
  });
});
