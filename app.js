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
  getInterests,
  getApprovedEvents,
  patchEventStatus,
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
  getHostedEvents,
  login,
} = require("./controller/users.controller.js");
const cors = require("@fastify/cors");
const {
  handleCustomError,
  handleSqlError,
  handleServerError,
} = require("./controller/errors.controller.js");

const fastifyApp = fastify({
  logger: true,
});

fastifyApp.register(cors, {
  origin: (origin, cb) => {
    // allow any origin by always returning true
    cb(null, true);
  },
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
});

fastifyApp.get("/cors-enabled", (_req, reply) => {
  reply.send("CORS headers");
});

fastifyApp.get("/cors-disabled", { cors: false }, (_req, reply) => {
  reply.send("No CORS headers");
});

fastifyApp.get("/api", getEndpoints);
fastifyApp.get("/api/users", allUsers);
fastifyApp.get("/api/events", getEvents);

fastifyApp.post("/api/events", postEvents);
fastifyApp.patch("/api/events/:event_id", patchEvents);
fastifyApp.patch("/api/events/status/:event_id", patchEventStatus);
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
fastifyApp.get("/api/users/:user_id/approved-events", getApprovedEvents);

fastifyApp.get("/api/users/:user_id/hosted-events", getHostedEvents);

fastifyApp.get("/api/interests", getInterests);

fastifyApp.post("/api/login", login);

// fastifyApp.all("/*", handleNonExistentEndpoint)

// fastifyApp.setErrorHandler(handleCustomError);
// fastifyApp.setErrorHandler(handleSqlError);
// fastifyApp.setErrorHandler(handleServerError);

module.exports = fastifyApp;
