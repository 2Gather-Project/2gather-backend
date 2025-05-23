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

  test("200: reponds with a array events that contains an array with all the events in the db", () => {
    return request(server)
      .get("/api/events?column_name=user_id&&value=1&&not_equal=true")
      .expect(200)
      .then(({ body }) => {
        const eventsArray = body.events;
        expect(Array.isArray(eventsArray)).toBe(true);
        expect(eventsArray.length).toBe(6);
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

  test("200: responds with a array events that contains an array with all the events in the db and status is active", () => {
    return request(server)
      .get(
        "/api/events?column_name=user_id&&value=1&&not_equal=true&&status=active"
      )
      .expect(200)
      .then(({ body }) => {
        const eventsArray = body.events;
        expect(Array.isArray(eventsArray)).toBe(true);
        expect(eventsArray.length).toBe(6);
        eventsArray.forEach((event) => {
          expect(typeof event.event_id).toBe("number");
          expect(typeof event.title).toBe("string");
          expect(typeof event.description).toBe("string");
          expect(typeof event.location).toBe("string");
          expect(typeof event.category).toBe("string");
          expect(typeof event.status).toBe("string");
          expect(typeof event.event_date).toBe("string");
          expect(typeof event.created_at).toBe("string");
          expect(event.status).toBe("ACTIVE");
        });
      });
  });

  test("200: responds with a array events that contains an array with all the events in the db and status is inactive", () => {
    return request(server)
      .get(
        "/api/events?column_name=user_id&&value=2&&not_equal=true&&status=inactive"
      )
      .expect(200)
      .then(({ body }) => {
       
        expect(body.msg).toBe("Resource not found!!");
      });
  });

  test("200: reponds with a array events that contains an array with all the events in the db", () => {
    return request(server)
      .get("/api/events?column_name=user_id&&value=1")
      .expect(200)
      .then(({ body }) => {
        const eventsArray = body.events;
        expect(Array.isArray(eventsArray)).toBe(true);
        expect(eventsArray.length).toBe(1);
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

describe("PATCH /api/events/status/:event_id", () => {
  test("200: reponds with a  events that changes the status of the event", () => {
    return request(server)
      .patch("/api/events/status/1")
      .send({
        status: "INACTIVE",
      })
      .expect(200)
      .then(({ body }) => {
        const event = body.event;
        expect(event.status).toBe("INACTIVE");
      });
  });
});

describe("POST /api/events", () => {
  test("200: reponds with a  events that contains an event details with hostname", () => {
    return request(server)
      .post("/api/events")
      .send({
        user_id: 1,
        title: "Street Food Lunch",
        description:
          "Grab a bite and discover new flavors together at the city’s food market.",
        location: "Manchester",
        category: "OTHER",
        status: "ACTIVE",
        event_date: "2025-04-23T15:54:56.946Z",
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

describe("POST /api/interests", () => {
  test("200: all the interests", () => {
    return request(server)
      .get("/api/interests")
      .expect(200)
      .then(({ body }) => {
        const interests = body.interests;
        console.log(interests);
        expect(Array.isArray(interests)).toBe(true);
        expect(interests.length).toBe(6);
      });
  });
});
