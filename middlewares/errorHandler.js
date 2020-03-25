const { SERVER_ERROR, EMAIL_ALREADY_USED } = require('../constants/errors');

const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message = SERVER_ERROR } = err;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = EMAIL_ALREADY_USED;
  }
  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;
