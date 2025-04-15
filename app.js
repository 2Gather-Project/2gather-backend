const { getEndpoints } = require("./controller/endpoints.controller.js");
const fastify = require("fastify");
const { allUsers } = require("./controller/users.controller.js");
const { getEvents } = require("./controller/events.controller.js");

const fastifyApp = fastify({
  logger: true,
});

fastifyApp.get("/api", getEndpoints);
fastifyApp.get("/api/users", allUsers);
fastifyApp.get("/api/events", getEvents);

module.exports = fastifyApp;
