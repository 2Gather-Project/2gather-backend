const db = require("../db/connection");
const format = require("pg-format");

function fetchEventUserActivity(event_id) {
  return db
    .query(
      `
    SELECT * from event_user_activity WHERE event_user_activity.event_id=$1`,
      [event_id],
    )
    .then(({ rows }) => {
      console.log(rows, "in model");
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "404: id was not found",
        });
      }
      // if (rows.code === "22P02") {
      //   return Promise.reject({
      //     status: 400,
      //     message: "400: Bad request",
      //   });
      // }
      return rows;
    });
}

module.exports = fetchEventUserActivity;
