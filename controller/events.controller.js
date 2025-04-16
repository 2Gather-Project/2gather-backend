const {
  fetchEvents,
  addEvent,
  updateEvent,
  fetchEventById,
  dropEventById,
} = require("../model/events.model");

const getEvents = (request, reply) => {
  const { sort_by, order, column_name, value } = request.query;

  fetchEvents({ sort_by, order, column_name, value })
    .then((rows) => {
      console.log("event:", rows);
      reply.send({ events: rows });
    })
    .catch((error) => {
      reply.send(error);
    });
};

const getEventsById = (request, reply) => {
  const { event_id } = request.params;

  fetchEventById(event_id)
    .then((row) => {
      reply.send({ event: row });
    })
    .catch((error) => {
      reply.send(error);
    });
};

const postEvents = (request, reply) => {
  console.log(request.body);
  const { user_id, topic, description, location, category } = request.body;

  if (user_id && location) {
    console.log("posting event:", topic);
    addEvent({ user_id, topic, description, location, category })
      .then((event) => {
        reply.send({ event: event[0] });
      })
      .catch((error) => {
        console.log(error);
        reply.send(error);
      });
  } else {
    Promise.reject({ status: 400, msg: "Bad Request!!" });
  }
};

const patchEvents = (request, reply) => {
  const { event_id } = request.params;
  const { title, description, location, category, event_date } = request.body;

  updateEvent({ title, description, location, category, event_date, event_id })
    .then((event) => {
      console.log("event:", event);
      reply.send({ event: event[0] });
    })
    .catch((error) => {
      console.log(error);
      reply.send(error);
    });
};

const deleteEvent = (request, reply) => {
  const { event_id } = request.params;

  dropEventById(event_id)
    .then((rows) => {
      if (rows.length > 0) {
        reply.code(204).send({ msg: "Deletion successfull !!" });
      } else {
        reply.code(404).send({ msg: "Already Deleted !!" });
      }
    })
    .catch((err) => {
      reply.send(err);
    });
};

module.exports = {
  getEvents,
  getEventsById,
  postEvents,
  patchEvents,
  deleteEvent,
};
