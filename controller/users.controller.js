const { getUsers, fetchUserByID, postUsers } = require("../model/users.model");

const allUsers = (request, reply, next) => {
  getUsers()
    .then((users) => {
      reply.send({ users });
    })
    .catch((err) => {
      //  next(err);
    });
};
const getUserByID = (request, reply, next) => {
  const { user_id } = request.params;
  fetchUserByID(user_id)
    .then((user) => {
      console.log(user);
      reply.send({ user_id });
    })
    .catch((err) => {
      // next(err);
    });
};

const createUsers = (request, reply, next) => {
  const {
    user_id,
    first_name,
    last_name,
    email,
    address,
    date_of_birth,
    fav_food,
    personality,
    bio,
    gender,
    reason,
    job_title,
    pet_owner,
    coffee_tea,
    image_url,
  } = request.body;
  postUsers(
    user_id,
    first_name,
    last_name,
    email,
    address,
    date_of_birth,
    fav_food,
    personality,
    bio,
    gender,
    reason,
    job_title,
    pet_owner,
    coffee_tea,
    image_url
  )
    .then((user) => {
      reply.send({ user });
    })
    .catch((err) => {
      // next(err);
    });
};

module.exports = { allUsers, getUserByID, createUsers };
