const db = require("../db/connection");
const format = require("pg-format");

const possible_column_names = [
  "description",
  "title",
  "user_id",
  "location",
  "category",
  "status",
  "created_at",
  "event_date",
  "img_url",
];

const possible_order = ["asc", "desc"];

const fetchEvents = ({
  sort_by = "event_date",
  order = "asc",
  column_name = undefined,
  value = undefined,
}) => {
  if (sort_by && !possible_column_names.includes(sort_by)) {
    return Promise.reject({ status: 404, msg: "Invalid Input" });
  }

  if (column_name && !possible_column_names.includes(column_name)) {
    return Promise.reject({ status: 404, msg: "Invalid Input" });
  }

  if (!possible_order.includes(order)) {
    return Promise.reject({ status: 404, msg: "Invalid Input" });
  }

  let selectQuery = `SELECT * FROM events `;

  let whereQyery = "";
  let orderByQuery = "";

  if (column_name && value && Number(value)) {
    whereQyery = `WHERE ${column_name} = '${value}' `;
  } else if (column_name && value && typeof value === "string") {
    whereQyery = `WHERE ${column_name} ILIKE '%${value}%' `;
  }

  if (value && (column_name === "status" || column_name === "category")) {
    whereQyery = `WHERE ${column_name} = '${value.toUpperCase()}' `;
  }

  if (sort_by && order) {
    orderByQuery = `ORDER BY events.${sort_by} ${order}`;
  }

  selectQuery += whereQyery + orderByQuery;

  return db.query(selectQuery).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource not found!!" });
    } else {
      return rows;
    }
  });
};

const addEvent = ({
  user_id,
  title,
  description,
  location,
  category,
  event_date,
}) => {
  return db
    .query(
      `INSERT INTO events
                      (user_id,title,description,location,category,event_date)
                      VALUES
                      ($1,$2,$3,$4,$5,$6) RETURNING *;`,
      [user_id, title, description, location, category, event_date]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const updateEvent = ({
  title,
  description,
  location,
  category,
  event_date,
  event_id,
}) => {
  return db
    .query(
      `UPDATE events
        SET TITLE = $1, DESCRIPTION = $2, LOCATION = $3 , CATEGORY = $4, EVENT_DATE= $5
      WHERE EVENT_ID = $6 RETURNING *;`,
      [title, description, location, category, event_date, event_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const fetchEventById = (event_id) => {
  let queryString = `SELECT * from events `;
  const queryParams = [];

  if (event_id) {
    queryString += `where events.event_id = $1`;
    queryParams.push(event_id);
  }

  return db.query(`${queryString};`, queryParams).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({ status: 404, msg: "Event not found!!" });
    } else {
      return rows[0];
    }
  });
};

const dropEventById = ({ user_id, topic, description, location, category }) => {
  return db
    .query(`DELETE FROM events where event_id = $1 returning *;`, [event_id])
    .then(({ rows }) => {
      return rows;
    });
};
module.exports = {
  fetchEvents,
  addEvent,
  updateEvent,
  fetchEventById,
  dropEventById,
};
