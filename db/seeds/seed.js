const db = require("../connection");
const format = require("pg-format");

const seed = async ({
  usersData,
  blockedUsersData,
  chatMessagesData,
  chatRoomsData,
  eventUserActivityData,
  eventsData,
  friendRequestsData,
}) => {
  try {
    await db.query("DROP TABLE IF EXISTS event_user_activity");
    await db.query("DROP TABLE IF EXISTS friend_requests");
    await db.query("DROP TABLE IF EXISTS chat_messages");
    await db.query("DROP TABLE IF EXISTS chat_rooms");
    await db.query("DROP TABLE IF EXISTS events");
    await db.query(`DROP TABLE IF EXISTS blocked_users`);
    await db.query("DROP TABLE IF EXISTS users");
    await db.query("DROP TYPE IF EXISTS interests");
    await db.query("DROP TYPE IF EXISTS event_status");
    await db.query("DROP TYPE IF EXISTS user_activity_status");
    await createInterests();
    await createEventStatus();
    await createUserActivityStatus();
    await createUsers();
    await createEvents();
    await createEventUserActivity();
    await createFriendRequests();
    await createBlockedUsers();
    await createChatRooms();
    await createChatMessages();
    await insertDataUsers(usersData);
    await insertEventsData(eventsData);
    await insertEventUserActivity(eventUserActivityData);
    await insertFriendRequest(friendRequestsData);
    await insertChatRooms(chatRoomsData);
    await insertChatMessages(chatMessagesData);
    await insertBlockedUsers(blockedUsersData);
  } catch (error) {
    console.error(error);
  }
};

function createInterests() {
  return db.query(
    `CREATE TYPE interests AS
      ENUM('COOKING', 'DANCING', 'DOG WALKING', 'THEATER', 'READING','OTHER')`
  );
}

function createEventStatus() {
  return db.query(
    `CREATE TYPE event_status AS
      ENUM('ACTIVE', 'INACTIVE','CLOSED')`
  );
}

function createUserActivityStatus() {
  return db.query(
    `CREATE TYPE user_activity_status AS
      ENUM('REQUESTED', 'APPROVED','CANCELLED')`
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
    image_url VARCHAR)`
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
   `
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
    `
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
    )`
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
    )`
  );
}

function createChatMessages() {
  return db.query(
    `CREATE TABLE chat_messages (
    message VARCHAR NOT NULL,
    created_at DATE,
    chat_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES chat_rooms(chat_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id), 
    PRIMARY KEY (chat_id, user_id)
    )`
  );
}

function createChatRooms() {
  return db.query(
    `CREATE TABLE chat_rooms (
    chat_id SERIAL PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    event_id INT NOT NULL,
    FOREIGN KEY (user1_id) REFERENCES users(user_id),
    FOREIGN KEY (user2_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
    )`
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

  return db.query(
    format(
      `INSERT INTO users
                  (first_name,last_name,email,address, phone_number,date_of_birth,fav_food,personality,bio,gender,reason,job_title,coffee_tea,image_url)
                  VALUES
                  %L RETURNING *;`,
      users
    )
  );
}

function insertEventsData(eventsData) {
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

  return db.query(
    format(
      `INSERT INTO events
                  (user_id,title,description,location,time ,created_at)
                  VALUES
                  %L RETURNING *;`,
      events
    )
  );
}

function insertEventUserActivity(eventUserActivityData) {
  const event_user_activity = eventUserActivityData.map((activity) => {
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
      event_user_activity
    )
  );
}

function insertFriendRequest(friendRequestsData) {
  const friend_requests = friendRequestsData.map((request) => {
    return [request.sender, request.reciever, request.status];
  });
  return db.query(
    format(
      `INSERT INTO friend_requests (
      sender_id, receiver_id, status) VALUES %L RETURNING *
      `,
      friend_requests
    )
  );
}

function insertChatRooms(chatRoomsData) {
  const chat_rooms = chatRoomsData.map((chat) => {
    return [chat.user1_id, chat.user2_id, chat.event_id];
  });
  return db.query(
    format(
      `INSERT INTO chat_rooms (
      user1_id, user2_id, event_id) VALUES %L RETURNING *`,
      chat_rooms
    )
  );
}

function insertChatMessages(chatMessagesData) {
  const chat_messages = chatMessagesData.map((message) => {
    const formattedDate = new Date(message.created_at).toISOString();
    return [message.chat_id, message.message, formattedDate, message.user_id];
  });
  return db.query(
    format(
      `INSERT INTO chat_messages (
      chat_id, message, created_at, user_id) VALUES %L RETURNING *`,
      chat_messages
    )
  );
}

function insertBlockedUsers(blockedUsersData) {
  const blocked_users = blockedUsersData.map((user) => {
    return [user.user_id, user.blocked_user_id];
  });
  return db.query(
    format(
      `INSERT INTO blocked_users (
      user_id, blocked_user_id) VALUES %L RETURNING *`,
      blocked_users
    )
  );
}

module.exports = seed;
