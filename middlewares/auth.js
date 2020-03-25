const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../constants/config');
const LoginFailedError = require('../errors/LoginFailedError');
const { AUTH_REQUIRED, AUTH_FAILED } = require('../constants/errors');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new LoginFailedError(AUTH_FAILED);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new LoginFailedError(AUTH_REQUIRED);
  }

  req.user = payload;

  next();
};
