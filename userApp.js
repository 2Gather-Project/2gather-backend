const {
  getEndpoints,
  handleNonExistentEndpoint,
} = require("./controller/endpoints.controller.js");

const fastify = require("fastify");
const {
  allUsers,
  getUserByID,
  createUser,
  patchUser,
} = require("./controller/users.controller.js");

const fastifyApp = fastify({
  logger: true,
});

fastifyApp.get("/api/users/:user_id", getUserByID);
fastifyApp.post("/api/users", createUser);
fastifyApp.patch("/api/users/:user_id", patchUser);
fastifyApp.all("/*", handleNonExistentEndpoint);

module.exports = fastifyApp;
