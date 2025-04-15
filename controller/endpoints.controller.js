const endpoints = require("../endpoints.json");

const getEndpoints = (request, reply) => {
  reply.send({ endpoints });
};

module.exports = { getEndpoints };
