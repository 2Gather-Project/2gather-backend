const {
  fetchEvents,
  fetchEventsById,
  addEvent,
} = require("../model/events.model");

const getEvents = (request, reply) => {
  const { sort_by, order, column_name, value } = request.query;

  fetchEvents({ sort_by, order, column_name, value }).then((rows) => {
    reply.send({ events: rows });
  });
};

const getEventsById = (request, reply) => {
  const { event_id } = request.params;

  fetchEventsById(event_id).then((row) => {
    reply.send({ event: row });
  });
};

const postEvents = (request, reply) => {
  console.log(request.body);
  const { user_id, topic, description, location, category } = request.body;

  if (user_id && location) {
    console.log("posting event:", topic);
    addEvent({ user_id, topic, description, location, category }).then(
      (event) => {
        reply.send({ event: event[0] });
      }
    );
  } else {
    Promise.reject({ status: 400, msg: "Bad Request!!" });
  }
};
module.exports = { getEvents, getEventsById, postEvents };
