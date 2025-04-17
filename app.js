const {
  getEndpoints,
  handleNonExistentEndpoint,
} = require("./controller/endpoints.controller.js");
const fastify = require("fastify");
const {
  getEvents,
  postEvents,
  patchEvents,
  getEventsById,
  deleteEvent,
} = require("./controller/events.controller.js");
const {
  getEventUserActivity,
  postEventUserActivity,
  updateEventUserActivity,
} = require("./controller/eventUserActivity.controller.js");
const {
  allUsers,
  getUserByID,
  createUser,
  patchUser,
  login
} = require("./controller/users.controller.js");
const cors = require("@fastify/cors");

const fastifyApp = fastify({
  logger: true,
});

// fastifyApp.use(cors());
fastifyApp.register(cors, {
  origin: true,
  preflight: true,
});

fastifyApp.get("/api", getEndpoints);
fastifyApp.get("/api/users", allUsers);
fastifyApp.get("/api/events", getEvents);

fastifyApp.post("/api/events", postEvents);
fastifyApp.patch("/api/events/:event_id", patchEvents);
fastifyApp.get("/api/events/:event_id", getEventsById);
fastifyApp.delete("/api/events/:event_id", deleteEvent);
fastifyApp.get("/api/event-user-activity/:event_id", getEventUserActivity);
fastifyApp.post("/api/event-user-activity", postEventUserActivity);

fastifyApp.patch(
  "/api/event-user-activity/:event_id/:attendee_id",
  updateEventUserActivity
);
fastifyApp.get("/api/users/:user_id", getUserByID);
fastifyApp.post("/api/users", createUser);
fastifyApp.patch("/api/users/:user_id", patchUser);

fastifyApp.post("/api/login", login);
fastifyApp.all("/*", handleNonExistentEndpoint);

module.exports = fastifyApp;
