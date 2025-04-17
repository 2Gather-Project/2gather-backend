const {
  fetchEventUserActivity,
  createEventUserActivity,
  updateEventUserActivityStatus,
} = require("../model/eventUserActivity.model");

function getEventUserActivity(request, reply) {
  const { event_id } = request.params;
  fetchEventUserActivity(event_id)
    .then((rows) => {
      reply.send({ event_user_activity: rows });
    })
    .catch((err) => {
      reply.code(err.status).send({ message: err.message });
    });
}

function postEventUserActivity(request, reply) {
  const { event_id, host_id, attendee_id, user_status, user_approved } =
    request.body;

  createEventUserActivity(
    event_id,
    host_id,
    attendee_id,
    user_status,
    user_approved
  )
    .then((rows) => {
      reply.code(201).send({ event_user_activity: rows[0] });
    })
    .catch((err) => {
      reply.code(err.status).send({ message: err.message });
    });
}

function updateEventUserActivity(request, reply) {
  const { event_id, attendee_id } = request.params;
  const { user_status, user_approved } = request.body;
  updateEventUserActivityStatus(
    event_id,
    attendee_id,
    user_status,
    user_approved
  )
    .then((updatedActivity) => {
      reply.send({ event_user_activity: updatedActivity });
    })
    .catch((err) => {
      console.log(err);
      reply.code(err.status).send({ message: err.message });
    });
}

module.exports = {
  getEventUserActivity,
  postEventUserActivity,
  updateEventUserActivity,
};
