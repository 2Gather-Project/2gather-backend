// import Fastify from "fastify";
// import {getEndpoints} from "./controller/endpoints.controller.js";
const { getEndpoints } = require("./controller/endpoints.controller.js");
const fastify = require("fastify");

const fastifyApp = fastify({
  logger: true,
});

fastifyApp.get("/api", getEndpoints);

fastifyApp.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
