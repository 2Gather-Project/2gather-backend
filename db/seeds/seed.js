const db = require("../connection");
const format = require("pg-format");

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
    .query("DROP TABLE IF EXISTS event_user_activity")
    .then(() => {
      console.log("1");
      db.query("DROP TABLE IF EXISTS friend_requests");
    })
    .then(() => {
      console.log("2");
      db.query("DROP TABLE IF EXISTS events");
    })
    .then(() => {
      console.log("3");
      db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      console.log("4");
      db.query("DROP TYPE IF EXISTS interests");
    })
    .then(() => {
      console.log("5");
      db.query("DROP TYPE IF EXISTS event_status");
    })
    .then(() => {
      console.log("6");
      db.query("DROP TYPE IF EXISTS user_activity_status");
    })
    .then(() => {
      console.log("7");
      return createInterests();
    })
    .then(() => {
      console.log("8");
      return createEventStatus();
    })
    .then(() => {
      console.log("9");
      return createUserActivityStatus();
    })
    .then(() => {
      console.log("10");
      return createUsers();
    })
    .then(() => {
      console.log("11");
      return createEvents();
    })
    .then(() => {
      console.log("12");
      return createEventUserActivity();
    })
    .then(() => {
      console.log("13");
      return createFriendRequests();
    })
    .then(() => {
      console.log("14");
      return insertDataUsers(usersData);
    })
    .then(() => {
      console.log("15");
      return insertEventsData(eventsData);
    })
    .then(() => {
      console.log("16");
      return insertEventUserActivity(eventUserActivityData);
    });
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
    address VARCHAR NOT NULL,
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
    category INTERESTS DEFAULT 'OTHER',
    status EVENT_STATUS DEFAULT 'ACTIVE',
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
     FOREIGN KEY (sender_id) REFERENCES users(user_id),
      FOREIGN KEY (receiver_id) REFERENCES users(user_id),
    status USER_ACTIVITY_STATUS NOT NULL
    )`,
  );
}

function createBlockedUsers() {
  return db.query(
    `CREATE TABLE blocked_users (
    user_id INT NOT NULL,
    blocked_user_id INT NOT NULL,
     FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (blocked_user_id) REFERENCES users(user_id),
    PRIMARY KEY(user_id, blocked_user_id)
    )`,
  );
}

function insertDataUsers(usersData) {
  const users = usersData.map((user) => {
    return [
      user.first_name,
      user.last_name,
      user.email,
      user.address,
      user.phone_number,
      user.date_of_birth,
      user.fav_food,
      user.personality,
      user.bio,
      user.gender,
      user.reason,
      user.job_title,
      user.coffee_tea,
      user.image_url,
    ];
  });

  console.log(users);
  return db.query(
    format(
      `INSERT INTO users
                  (first_name,last_name,email,address, phone_number,date_of_birth,fav_food,personality,bio,gender,reason,job_title,coffee_tea,image_url)
                  VALUES
                  %L RETURNING *;`,
      users,
    ),
  );
}

function insertEventsData(eventsData) {
  console.log(eventsData);
  const events = eventsData.map((event) => {
    return [
      event.user_id,
      event.title,
      event.description,
      event.location,
      event.time,
      event.created_at,
    ];
  });

  console.log(events);
  return db.query(
    format(
      `INSERT INTO events
                  (user_id,title,description,location,time ,created_at)
                  VALUES
                  %L RETURNING *;`,
      events,
    ),
  );
}

function insertEventUserActivity(eventUserActivityData) {
  const event_user_activity = eventUserActivityData.map((activity) => {
    console.log(activity, "in insert eventuseractivity");
    return [
      activity.event_id,
      activity.host_id,
      activity.attendee_id,
      activity.user_status,
      activity.user_approved,
    ];
  });
  return db.query(
    format(
      `INSERT INTO event_user_activity (event_id, host_id, attendee_id, user_status, user_approved) VALUES %L RETURNING *`,
      event_user_activity,
    ),
  );
}

module.exports = seed;
