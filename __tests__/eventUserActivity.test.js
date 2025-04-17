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
  test("200: GET all event-user-activity by event_id", () => {
    return request(server)
      .get("/api/event-user-activity/1")
      .expect(200)
      .then(({ body }) => {
        const eventUserActivityArray = body.event_user_activity;
        console.log(JSON.stringify(body));
        expect(eventUserActivityArray.length).toBe(1);

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
  test("404: GET an error message if id isn't found in database", () => {
    return request(server)
      .get("/api/event-user-activity/9999999")
      .expect(404)
      .then(({ body }) => {
        console.log(body);
        expect(body.message).toBe("404: id was not found");
      });
  });
  test("201: POST an event-user-activity", () => {
    const newEventUserActivity = {
      event_id: 1,
      host_id: 1,
      attendee_id: 4,
      user_status: "REQUESTED",
      user_approved: false,
    };
    return request(server)
      .post("/api/event-user-activity")
      .send(newEventUserActivity)
      .expect(201)
      .then(({ body }) => {
        const event = body.event_user_activity;

        expect(event.id).toBe(6);
        expect(event.host_id).toBe(1);
        expect(event.attendee_id).toBe(4);
        expect(event.user_status).toBe("REQUESTED");
        expect(event.user_approved).toBe(false);
      });
  });
  test("PATCH 200: updates event user activity status to APPROVED", () => {
    return request(server)
      .patch("/api/event-user-activity/1/2")
      .send({
        user_status: "APPROVED",
        user_approved: true,
      })
      .expect(200)
      .then(({ body }) => {
        const updatedActivity = body.event_user_activity;
        expect(updatedActivity.length).toBe(1);
        const activity = updatedActivity[0];
        expect(activity.event_id).toBe(1);
        expect(activity.attendee_id).toBe(2);
        expect(activity.user_status).toBe("APPROVED");
        expect(activity.user_approved).toBe(true);
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
