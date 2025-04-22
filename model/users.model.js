const db = require("../db/connection");

const usersExists = (user_id) => {
  return db
    .query(`select * from users where user_id = $1`, [user_id])
    .then(({ rows }) => {
      if (rows.length !== 0) {
        return true;
      }
      return false;
    });
};

const getUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

const fetchUserByID = (user_id) => {
  return db
    .query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

const postUsers = async (first_name, last_name, email, address) => {
  const query = `
    INSERT INTO users (
      first_name, last_name, email, address
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [first_name, last_name, email, address];

  try {
    const result = await db.query(query, values);
    const user = result.rows[0];
    // user.date_of_birth = user.date_of_birth.toLocaleDateString("en-CA");
    return user;
  } catch (err) {
    console.error("Error inserting user:", err);
    throw err;
  }
};

const updateUser = async (body) => {
  const {
    address,
    phone_number,
    fav_food,
    personality,
    bio,
    gender,
    reason,
    job_title,
    coffee_tea,
    image_url,
    user_id,
  } = body;

  const query = `UPDATE users
SET
  address = $1,
  phone_number = $2,
  fav_food = $3,
  personality = $4,
  bio = $5,
  gender = $6,
  reason = $7,
  job_title = $8,
  coffee_tea = $9,
  image_url = $10
WHERE user_id = $11
RETURNING *;`;

  const values = [
    address,
    phone_number,
    fav_food,
    personality,
    bio,
    gender,
    reason,
    job_title,
    coffee_tea,
    image_url,
    user_id,
  ];
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error("Error updating user");
  }
};

const fetchUserbyEmail = (email) => {
  return db
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "404: User not found",
        });
      }
      return rows[0];
    });
};

const fetchHostedEvents = (user_id) => {
  return db
    .query(`SELECT * FROM events WHERE user_id = $1`, [user_id])
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = {
  usersExists,
  getUsers,
  fetchUserByID,
  postUsers,
  updateUser,
  fetchUserbyEmail,
  fetchHostedEvents,
};
