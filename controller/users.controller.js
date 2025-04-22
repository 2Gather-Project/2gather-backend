const {
  getUsers,
  fetchUserByID,
  postUsers,
  updateUser,
  fetchUserbyEmail,
  fetchHostedEvents,
} = require("../model/users.model");

const allUsers = (request, reply, next) => {
  getUsers().then((users) => {
    reply.send({ users });
  });
};

const getUserByID = (request, reply, next) => {
  const { user_id } = request.params;
  if (isNaN(user_id)) {
    return reply.status(400).send({ msg: "Invalid user" });
  }
  fetchUserByID(user_id).then((user) => {
    if (!user) {
      return reply.status(404).send({ msg: "Invalid Endpoint!!" });
    }
    reply.status(200).send({ user });
  });
};

const createUser = async (request, reply) => {
  const { first_name, last_name, email, address } = request.body;

  if (!first_name || !last_name || !email || !address) {
    return reply.status(400).send({ msg: "Field is required" });
  }

  try {
    const user = await postUsers(first_name, last_name, email, address);
    reply.status(201).send({ user });
  } catch (err) {
    reply.status(500).send({ msg: "Internal server error" });
  }
};

const patchUser = (request, reply, next) => {
  const user_id = Number(request.params.user_id);
  const updateData = {
    ...request.body,
    user_id: Number(user_id),
  };
  if (isNaN(user_id)) {
    return reply.status(400).send({ msg: "Invalid user_id" });
  }
  updateUser(updateData).then((updatedUser) => {
    reply.status(200).send({ user: updatedUser });
  });
};

const login = (request, reply) => {
  const { email } = request.body;

  if (!email) {
    return reply.code(400).send({ message: "400: Username is required" });
  }

  fetchUserbyEmail(email)
    .then((user) => {
      reply.send({ user });
    })
    .catch((err) => {
      reply.code(err.status).send({ message: err.message });
    });
};

const getHostedEvents = (request, reply) => {
  const { user_id } = request.params;
  fetchHostedEvents(user_id).then((events) => {
    reply.send({ events });
  });
};

module.exports = {
  allUsers,
  getUserByID,
  createUser,
  patchUser,
  login,
  getHostedEvents,
};
