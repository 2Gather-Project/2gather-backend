const db = require("../db/connection");
const format = require("pg-format");

function fetchEventUserActivity(event_id) {
  return db
    .query(
      `
    SELECT * from event_user_activity WHERE event_user_activity.event_id=$1`,
      [event_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "404: id was not found",
        });
      }
      return rows;
    });
}

function createEventUserActivity(
  event_id,
  host_id,
  attendee_id,
  user_status,
  user_approved
) {
  return db
    .query(
      `INSERT INTO event_user_activity (event_id, host_id, attendee_id, user_status, user_approved) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [event_id, host_id, attendee_id, user_status, user_approved]
    )
    .then(({ rows }) => {
      return rows;
    });
}
function updateEventUserActivityStatus(
  event_id,
  attendee_id,
  user_status,
  user_approved
) {
  console.log(attendee_id);
  return db
    .query(
      `
      UPDATE event_user_activity
      SET user_status = $1, user_approved = $2
      WHERE event_id = $3 AND attendee_id = $4
      RETURNING *;
      `,
      [user_status, user_approved, event_id, attendee_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "404: id was not found",
        });
      }
      return rows;
    });
}

module.exports = {
  fetchEventUserActivity,
  createEventUserActivity,
  updateEventUserActivityStatus,
};
