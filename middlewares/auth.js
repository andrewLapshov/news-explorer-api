const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../constants/config');
const LoginFailedError = require('../errors/LoginFailedError');

module.exports.auth = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    throw new LoginFailedError('Ошибка авторизации');
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new LoginFailedError('Авторизация не выполнена');
  }

  req.user = payload;

  next();
};
