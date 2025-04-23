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
  "image_url",
];

const possible_order = ["asc", "desc"];

const fetchInterests = () => {
  return db.query("SELECT enum_range(null::interests)").then(({ rows }) => {
    return rows;
  });
};

const fetchEvents = ({
  sort_by = "event_date",
  order = "asc",
  column_name = undefined,
  value = undefined,
  not_equal = false,
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

  console.log(not_equal);

  if (column_name && value && Number(value) && !not_equal) {
    whereQyery = `WHERE ${column_name} = '${value}' `;
  } else if (column_name && value && typeof value === "string" && !not_equal) {
    whereQyery = `WHERE ${column_name} ILIKE '%${value}%' `;
  } else if (column_name && value && Number(value) && not_equal) {
    whereQyery = `WHERE ${column_name} != '${value}' `;
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
  image_url,
}) => {
  return db
    .query(
      `INSERT INTO events
                      (user_id,title,description,location,category,event_date,image_url)
                      VALUES
                      ($1,$2,$3,$4,$5,$6,$7) RETURNING *;`,
      [user_id, title, description, location, category, event_date, image_url]
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
  image_url,
}) => {
  return db
    .query(
      `UPDATE events
        SET TITLE = $1, DESCRIPTION = $2, LOCATION = $3 , CATEGORY = $4, EVENT_DATE= $5,
        IMAGE_URL = $7
      WHERE EVENT_ID = $6 RETURNING *;`,
      [title, description, location, category, event_date, event_id, image_url]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const fetchEventById = (event_id) => {
  let queryString = `SELECT 
  users.first_name as host_first_name, 
  users.last_name as host_last_name, 
  events.event_id as event_id, 
  events.title as title, 
  events.description as description,
  events.location as location,
  events.category as category,
  events.status as status, 
  events.event_date as event_date, 
  events.created_at as created_at, 
  events.image_url as image_url,
  users.user_id as host_id 
  from events join users 
  on events.user_id = users.user_id `;
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

const fetchApprovedEvents = (user_id) => {
  return db.query(
    `
    SELECT DISTINCT events.* 
    FROM events
    JOIN event_user_activity 
      ON events.event_id = event_user_activity.event_id
    WHERE events.user_id = $1
      AND event_user_activity.host_id = $1
      AND event_user_activity.user_approved = true
      AND event_user_activity.user_status = 'APPROVED'
    `, [user_id]
  ).then(({ rows }) => {

    return rows;
  });


}
module.exports = {
  fetchEvents,
  addEvent,
  updateEvent,
  fetchEventById,
  dropEventById,
  fetchInterests,
  fetchApprovedEvents
};
