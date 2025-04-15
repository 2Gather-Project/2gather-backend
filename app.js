// import Fastify from "fastify";
// import {getEndpoints} from "./controller/endpoints.controller.js";
const { getEndpoints } = require("./controller/endpoints.controller.js");
const fastify = require("fastify");
const { getUsers } = require("./controller/users.controller.js");
const { getEvents } = require("./controller/events.controller.js");
 

const fastifyApp = fastify({
  logger: true,
});

fastifyApp.get("/api", getEndpoints);

fastifyApp.get("/api/users", getUsers);

fastifyApp.get("/api/events", getEvents);

fastifyApp.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
