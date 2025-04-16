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
    .query(`SELECT * FROM users WHERE $1`, [user_id])
    .then(({ rows }) => {
      return rows;
    });
};

const postUsers = (
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
  coffee_tea,
  image_url
) => {
  const query = `INSERT INTO users
                  (first_name,last_name,email,address,date_of_birth,fav_food,personality,bio,gender,reason,job_title,coffee_tea,image_url)
                  VALUES
                  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;`;
  const values = [
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
    coffee_tea,
    image_url,
  ];
  console.log("mdoel");
  return db
    .query(query, values)
    .then(({ rows }) => {
      console.log("rows");
      return rows[0];
    })
    .catch((err) => {
      console.log("err");
      console.error(err.message);
    });
};

module.exports = { usersExists, getUsers, fetchUserByID, postUsers };
