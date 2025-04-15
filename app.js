import Fastify from "fastify";
import {getEndpoints} from "./controller/endpoints.controller.js";

const fastify = Fastify({
  logger: true,
});

fastify.get("/api", getEndpoints );
