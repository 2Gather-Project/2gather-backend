const {
  fetchInterests,
  fetchEvents,
  addEvent,
  updateEvent,
  fetchEventById,
  dropEventById,
  fetchApprovedEvents,
  updateEventStatus,
} = require("../model/events.model");
const { usersExists } = require("../model/users.model");

const getInterests = (request, reply) => {
  fetchInterests()
    .then((rows) => {
      reply.send({ interests: rows });
    })
    .catch((error) => {
      reply.send(error);
    });
};

const getEvents = (request, reply) => {
  const { sort_by, order, column_name, value, not_equal } = request.query;

  fetchEvents({ sort_by, order, column_name, value, not_equal })
    .then((rows) => {
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
  const {
    user_id,
    title,
    description,
    location,
    category,
    event_date,
    image_url,
  } = request.body;

  if (user_id) {
    addEvent({
      user_id,
      title,
      description,
      location,
      category,
      event_date,
      image_url,
    })
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
  const { title, description, location, category, event_date, image_url } =
    request.body;

  updateEvent({
    title,
    description,
    location,
    category,
    event_date,
    event_id,
    image_url,
  })
    .then((event) => {
      reply.send({ event: event[0] });
    })
    .catch((error) => {
      reply.send(error);
    });
};

const patchEventStatus = (request, reply) => {
  const { event_id } = request.params;
  const { status } = request.body;

  updateEventStatus({
    event_id,
    status,
  })
    .then((event) => {
      reply.send({ event: event[0] });
    })
    .catch((error) => {
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

const getApprovedEvents = (request, reply) => {
  const user_id = Number(request.params.user_id);

  if (isNaN(user_id)) {
    return reply.status(400).send({ msg: "Invalid user" });
  }
  usersExists(user_id)
    .then((response) => {
      if (!response)
        return Promise.reject({ status: 404, msg: "User not found" });
      return fetchApprovedEvents(user_id);
    })
    .then((rows) => {
      reply.send({ events: rows });
    })
    .catch((error) => {
      if (error.status) {
        reply.status(error.status).send({ msg: error.msg });
      } else {
        console.log(error);
        reply.status(500).send({ msg: "Something went wrong!" });
      }
    });
};
module.exports = {
  getEvents,
  getEventsById,
  postEvents,
  patchEvents,
  deleteEvent,
  getInterests,
  getApprovedEvents,
  patchEventStatus,
};
