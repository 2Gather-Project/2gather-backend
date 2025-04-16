const fetchEventUserActivity = require("../model/eventUserActivity.model");

function getEventUserActivity(request, reply) {
  const { event_id } = request.params;
  fetchEventUserActivity(event_id)
    .then((rows) => {
      console.log(rows, "in controller");
      reply.send({ event_user_activity: rows });
    })
    .catch((err) => {
      // if (err.code === "22P02") {
      //   reply.code(400).send({ message: "400: Bad request" });
      // }
      reply.code(err.status).send({ message: err.message });
    });
}

module.exports = getEventUserActivity;
