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
  return db
    .query("DROP TABLE IF EXISTS users")
    .then(() => {
      db.query("DROP TABLE IF EXISTS interests");
    })
    .then(() => {
      return createInterests();
    })
    .then(() => {
      return createUsers();
    });
};

function createInterests() {
  return db.query(
    `CREATE TYPE interests AS
      ENUM('Cooking', 'Dancing', 'Dog Walking', 'Theater', 'Reading')`,
  );
}

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

function createEvents() {
  return db.query(
    `CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    category VARCHAR,
    time VARCHAR,
    created_at DATE,
    FOREIGN KEY (category) REFERENCES interest(name) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
   `,
  );
}

module.exports = seed;
