const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
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

describe("event-user-activity", () => {
  test.only("200: get all event-user-activity by event_id", () => {
    return request(server)
      .get("/api/event-user-activity/1")
      .expect(200)
      .then(({ body }) => {
        const eventUserActivityArray = body.event_user_activity;
        console.log(JSON.stringify(body));
        expect(eventUserActivityArray.length).toBe(2);

        eventUserActivityArray.forEach((event) => {
          expect(typeof event.id).toBe("number");
          expect(event.event_id).toBe(1);
          expect(typeof event.host_id).toBe("number");
          expect(typeof event.event_id).toBe("number");
          expect(typeof event.attendee_id).toBe("number");
          expect(typeof event.user_status).toBe("string");
          expect(typeof event.user_approved).toBe("boolean");
        });
      });
  });
  test("404: get an error message if id isn't found in database", () => {
    return request(server)
      .get("/api/event-user-activity/9999999")
      .expect(404)
      .then(({ body }) => {
        console.log(body);
        expect(body.message).toBe("404: id was not found");
      });
  });
  // test.only("400: get an error message if id isn't found in database", () => {
  //   return request(server)
  //     .get("/api/event-user-activity/one")
  //     .expect(400)
  //     .then(({ body }) => {
  //       console.log(body);
  //       expect(body.message).toBe("400: Bad request");
  //     });
  // });
});
