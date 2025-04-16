const db = require("../db/connection");
const format = require("pg-format");

const possible_column_names = [
  "description",
  "title",
  "user_id",
  "location",
  "category",
  "created_at",
  "img_url",
];

const possible_order = ["asc", "desc"];

const fetchEvents = ({
  sort_by = "created_at",
  order = "desc",
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

  const groupByQuery = `GROUP BY events.event_id `;

  let whereQyery = "";
  let orderByQuery = "";

  if (column_name && value) {
    whereQyery = `WHERE ${column_name} = '${value}' `;
  }

  if (sort_by && order) {
    orderByQuery = `ORDER BY events.${sort_by} ${order}`;
  }
  console.log("events:");
  selectQuery += whereQyery + groupByQuery + orderByQuery;
  console.log("events:", selectQuery);

  return db.query(selectQuery).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Event id not found!!" });
    } else {
      return rows;
    }
  });
};

const fetchEventsById = (article_id) => {
  let queryString = `SELECT articles.*, COUNT(comments.comment_id)  as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;
  const queryParams = [];

  if (article_id) {
    queryString += `WHERE articles.article_id = $1 group by articles.article_id`;
    queryParams.push(article_id);
  }

  return db.query(`${queryString};`, queryParams).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({ status: 404, msg: "Article id not found!!" });
    } else {
      return rows[0];
    }
  });
};


const addEvent = ({ user_id, topic, description, location, category }) => {
  return db
    .query(
      format(
        `INSERT INTO events
                      (user_id,title,description,location)
                      VALUES
                      %L RETURNING *;`,
        [
          {
            user_id,
            topic,
            description,
            location,
          },
        ]
      )
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = {
  fetchEvents,
  fetchEventsById,
  addEvent,
};
