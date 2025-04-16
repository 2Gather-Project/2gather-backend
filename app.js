const {
  getEndpoints,
  handleNonExistentEndpoint,
} = require("./controller/endpoints.controller.js");
const fastify = require("fastify");
const { allUsers } = require("./controller/users.controller.js");
const { getEvents, postEvents } = require("./controller/events.controller.js");

const fastifyApp = fastify({
  logger: true,
});

fastifyApp.get("/api", getEndpoints);
fastifyApp.get("/api/users", allUsers);
fastifyApp.get("/api/events", getEvents);
//fastifyApp.get("/api/events/:user_id", getEventsNotBelongingToUserId);
fastifyApp.post("/api/events",postEvents);

fastifyApp.all("/*", handleNonExistentEndpoint);

module.exports = fastifyApp;
