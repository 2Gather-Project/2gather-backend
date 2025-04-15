const db = require("../db/connection");

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

const isArticleIdValid = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return false;
      }
      return true;
    });
};

const updateVotesForArticleId = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles 
                    SET votes = votes + $1
                    WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "Article id does not exists",
        });
      } else {
        return rows;
      }
    });
};

module.exports = {
  fetchEvents,
  fetchEventsById,
  isArticleIdValid,
  updateVotesForArticleId,
};