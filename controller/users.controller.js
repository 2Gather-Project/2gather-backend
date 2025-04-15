const { getUsers } = require("../model/users.model");

const allUsers = (request, reply, next) => {
  getUsers()
    .then((users) => {
      reply.send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { allUsers };



