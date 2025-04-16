const endpoints = require("../endpoints.json");

const getEndpoints = (request, reply) => {
  reply.send({ endpoints });
};

const handleNonExistentEndpoint = (request, reply) => {
  reply.status(404).send({ msg: `Invalid Endpoint!!` });
};
module.exports = { getEndpoints, handleNonExistentEndpoint };
