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

describe("GET /api/events", () => {
  test("200: reponds with a array events that contains an array with all the events in the db", () => {
    return request(server)
      .get("/api/events")
      .expect(200)
      .then(({ body }) => {
        const eventsArray = body.events;
        expect(Array.isArray(eventsArray)).toBe(true);
        expect(eventsArray.length).toBe(7);
        eventsArray.forEach((event) => {
          expect(typeof event.event_id).toBe("number");
          expect(typeof event.title).toBe("string");
          expect(typeof event.description).toBe("string");
          expect(typeof event.location).toBe("string");
          expect(typeof event.category).toBe("string");
          expect(typeof event.status).toBe("string");
          expect(typeof event.event_date).toBe("string");
          expect(typeof event.created_at).toBe("string");
        });
      });
  });
});

describe("GET /api/events/:event_id", () => {
  test("200: reponds with a  events that contains an event details with hostname", () => {
    return request(server)
      .get("/api/events/1")
      .expect(200)
      .then(({ body }) => {
        const event = body.event;

        expect(typeof event.event_id).toBe("number");
        expect(typeof event.title).toBe("string");
        expect(typeof event.description).toBe("string");
        expect(typeof event.location).toBe("string");
        expect(typeof event.category).toBe("string");
        expect(typeof event.status).toBe("string");
        expect(typeof event.event_date).toBe("string");
        expect(typeof event.created_at).toBe("string");
        expect(typeof event.host_first_name).toBe("string");
        expect(typeof event.host_last_name).toBe("string");
      });
  });
});

describe("PATCH /api/events/:event_id", () => {
  test("200: reponds with a  events that contains an event details with hostname", () => {
    return request(server)
      .patch("/api/events/1")
      .send({
        title: "Street Food Lunch",
        description:
          "Grab a bite and discover new flavors together at the city’s food market.",
        location: "Manchester",
        category: "OTHER",
        status: "ACTIVE",
        event_date: "2025-04-16T15:54:56.946Z",
      })
      .expect(200)
      .then(({ body }) => {
        const event = body.event;

        expect(typeof event.event_id).toBe("number");
        expect(typeof event.title).toBe("string");
        expect(typeof event.description).toBe("string");
        expect(typeof event.location).toBe("string");
        expect(typeof event.category).toBe("string");
        expect(typeof event.status).toBe("string");
        expect(typeof event.event_date).toBe("string");
        expect(typeof event.created_at).toBe("string");
      });
  });
});
