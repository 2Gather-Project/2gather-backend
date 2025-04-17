const endpoints = require("../endpoints.json");

const getEndpoints = (request, reply) => {
  reply.send({ endpoints });
};

const handleNonExistentEndpoint = (request, reply) => {
  console.log(request);
  reply.status(404).send({ msg: `Invalid Endpoint!!` });
};
module.exports = { getEndpoints, handleNonExistentEndpoint };
