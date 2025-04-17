exports.handleCustomError = (error, request, reply) => {
  if (error.status) {
    reply.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
};

exports.handleSqlError = (error, request, reply) => {
  if (error.code === "22P02") {
    reply.status(400).send({ msg: "Bad Request, invalid input" });
  }
};

// exports.handleIncorrectPath = (request, reply) => {
//   reply.status(404).send({ msg: "Page not found" });
// };

exports.handleServerError = (error, request, reply) => {
  reply.status(500).send({ msg: "Something went wrong!" });
};
