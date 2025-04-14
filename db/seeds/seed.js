const db = require("../connection");

const seed = ({
  usersData,
  blockedUsersData,
  chatMessagesData,
  chatRoomsData,
  eventStatusData,
  eventUserActivityData,
  eventsData,
  friendRequestsData,
  interestData,
}) => {
  return db.query("DROP TABLE IF EXISTS users").then(() => {
    return createUsers();
  });
};

function createUsers() {
  return db.query(
    `CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    addreess VARCHAR NOT NULL,
    phone_number VARCHAR,
    date_of_birth DATE,
    fav_food VARCHAR,
    personality VARCHAR,
    bio VARCHAR,
    gender VARCHAR,
    reason VARCHAR,
    job_title VARCHAR,
    coffee_tea VARCHAR,
    image_url VARCHAR)`,
  );
}

module.exports = seed;
