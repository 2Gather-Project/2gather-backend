const {
  getEndpoints,
  handleNonExistentEndpoint,
} = require("./controller/endpoints.controller.js");
const fastify = require("fastify");
const {
  allUsers,
  getUserByID,
  createUsers,
} = require("./controller/users.controller.js");

const fastifyApp = fastify({
  logger: true,
});

fastifyApp.get("/api/users/:user_id", getUserByID);
fastifyApp.post("/api/users", createUsers);

module.exports = fastifyApp;
