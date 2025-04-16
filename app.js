const {
  getEndpoints,
  handleNonExistentEndpoint,
} = require("./controller/endpoints.controller.js");
const fastify = require("fastify");
const { allUsers } = require("./controller/users.controller.js");
const {
  getEvents,
  postEvents,
  patchEvents,
  getEventsById,
} = require("./controller/events.controller.js");
const { fetchEventById } = require("./model/events.model.js");
const {
  getEventUserActivity,
  postEventUserActivity,
  updateEventUserActivity,
} = require("./controller/eventUserActivity.controller.js");

const fastifyApp = fastify({
  logger: true,
});

fastifyApp.get("/api", getEndpoints);
fastifyApp.get("/api/users", allUsers);
fastifyApp.get("/api/events", getEvents);
//fastifyApp.get("/api/events/:user_id", getEventsNotBelongingToUserId);
fastifyApp.post("/api/events", postEvents);
fastifyApp.patch("/api/events/:event_id", patchEvents);
fastifyApp.get("/api/events/:event_id", getEventsById);
fastifyApp.get("/api/event-user-activity/:event_id", getEventUserActivity);
fastifyApp.post("/api/event-user-activity", postEventUserActivity);
fastifyApp.patch(
  "/api/event-user-activity/:event_id/:attendee_id",
  updateEventUserActivity,
);

fastifyApp.all("/*", handleNonExistentEndpoint);

module.exports = fastifyApp;
