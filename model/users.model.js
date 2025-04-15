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

module.exports = { usersExists, getUsers };
