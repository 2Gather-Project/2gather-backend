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
  test("404: GET an error message if event id isn't found in database", () => {
    return request(server)
      .get("/api/event-user-activity/9999999")
      .expect(404)
      .then(({ body }) => {
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
  xtest("404: POST an error when sending invalid event_id to event-user-activity", () => {
    return request(server)
      .post("/api/event-user-activity")
      .send({
        event_id: 50,
        host_id: 1,
        attendee_id: 4,
        user_status: "REQUESTED",
        user_approved: false,
      })
      .expect(404)
      .then(({ body }) => {
        console.log(body);
        expect(body.error).toBe("Not Found");
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
  test("PATCH 404: Responds with a not found, when given an invalid attendee ID", () => {
    return request(server)
      .patch("/api/event-user-activity/1/73")
      .send({
        user_status: "APPROVED",
        user_approved: true,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("Not Found");
      });
  });
});



describe.only("GET /api/users/:user_id/approved-events", () => {
  test("200: responds with an array of events that have approved attendees for the specified host", () => {
    return request(server)
      .patch("/api/event-user-activity/1/2") // sending this request to have an approved event, which can be used for testing
      .send({
        user_status: "APPROVED",
        user_approved: true
      })
      .expect(200)
      .then(() => {
        return request(server)
          .get("/api/users/1/approved-events")
          .expect(200)
          .then(({ body }) => {
            const { events } = body;
            expect(Array.isArray(events)).toBe(true);
            expect(events.length).toBe(1);

            events.forEach(event => {
              expect(typeof event.event_id).toBe("number");
              expect(typeof event.title).toBe("string");
              expect(typeof event.description).toBe("string");
              expect(typeof event.location).toBe("string");
              expect(typeof event.category).toBe("string");
              expect(typeof event.status).toBe("string");
              expect(typeof event.event_date).toBe("string");
              expect(typeof event.created_at).toBe("string");
              expect(event.user_id).toBe(1); // Ensure all events belong to user with id 1
            });
          });
      });
  });

  test("200: responds with an empty array when the user has no events with approved attendees", () => {
    return request(server)
      .get("/api/users/1/approved-events") // Using a user who has no events approved 
      .expect(200)
      .then(({ body }) => {
        const { events } = body;
        expect(Array.isArray(events)).toBe(true);
        expect(events.length).toBe(0);
      });
  });

  test("400: responds with an error when given an invalid user_id", () => {
    return request(server)
      .get("/api/users/invalid-id/approved-events")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid user");
      });
  });

  test("404: responds with an error when the user_id does not exist", () => {
    return request(server)
      .get("/api/users/999999/approved-events")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});