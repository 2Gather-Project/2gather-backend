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
  return (
    db
      .query("DROP TABLE IF EXISTS event_user_activity")
      // .then(() => {
      //   db.query("DROP TABLE IF EXISTS friend_requests");
      // })
      .then(() => {
        db.query("DROP TABLE IF EXISTS events");
      })
      .then(() => {
        db.query("DROP TABLE IF EXISTS users");
      })
      .then(() => {
        db.query("DROP TYPE IF EXISTS interests");
      })
      .then(() => {
        db.query("DROP TYPE IF EXISTS event_status");
      })
      .then(() => {
        db.query("DROP TYPE IF EXISTS user_activity_status");
      })
      .then(() => {
        return createInterests();
      })
      .then(() => {
        return createEventStatus();
      })
      .then(() => {
        return createUserActivityStatus();
      })
      .then(() => {
        return createUsers();
      })
      .then(() => {
        return createEvents();
      })
      .then(() => {
        return createEventUserActivity();
      })
      // .then(() => {
      //   return createFriendRequests();
      // })
  );
};

function createInterests() {
  return db.query(
    `CREATE TYPE interests AS
      ENUM('COOKING', 'DANCING', 'DOG WALKING', 'THEATER', 'READING','OTHER')`,
  );
}

function createEventStatus() {
  return db.query(
    `CREATE TYPE event_status AS
      ENUM('ACTIVE', 'INACTIVE','CLOSED')`,
  );
}

function createUserActivityStatus() {
  return db.query(
    `CREATE TYPE user_activity_status AS
      ENUM('REQUESTED', 'APPROVED','CANCELLED')`,
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
    user_id INT NOT NULL,
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    category INTERESTS NOT NULL,
    status EVENT_STATUS NOT NULL,
    time VARCHAR,
    created_at DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE)
   `,
  );
}

function createEventUserActivity() {
  return db.query(
    `CREATE TABLE event_user_activity (
    id SERIAL UNIQUE,
    event_id INT NOT NULL,
    host_id INT NOT NULL,
    attendee_id INT NOT NULL,
    user_status USER_ACTIVITY_STATUS,
    user_approved BOOLEAN,
    PRIMARY KEY (event_id, host_id, attendee_id)
    )
    `,
  );
}

function createFriendRequests() {
  return db.query(
    `CREATE TABLE friend_requests (
    request_id SERIAL PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    status USER_ACTIVITY_STATUS
    )`,
  );
}

function createBlockedUsers() {
  return db.query(
    `CREATE TABLE blocked_users (
    user_id INT,
    blocked_user_id INT
    PRIMARY KEY(user_id, blocked_user)
    )`,
  );
}

module.exports = seed;
