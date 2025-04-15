const {
  fetchEvents,
  fetchEventsById,
  updateVotesForEventId,
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

const updateEventVotes = (request, reply) => {
  const { inc_votes } = request.body;
  const { event_id } = request.params;
  if (event_id && inc_votes) {
    updateVotesForEventId(event_id, inc_votes).then((event) => {
      reply.send({ event: event[0] });
    });
  } else {
    Promise.reject({ status: 400, msg: "Bad Request!!" });
  }
};
module.exports = { getEvents, getEventsById, updateEventVotes };
