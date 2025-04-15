import { endpoints } from "../endpoints.json";

export const getEndpoints = (request, reply) => {
  reply.send({ endpoints });
};
