const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../constants/config');
const LoginFailedError = require('../errors/LoginFailedError');

// module.exports.auth = (req, res, next) => {
//   const { jwt: token } = req.cookies;

//   if (!token) {
//     throw new LoginFailedError('Ошибка авторизации');
//   }

//   let payload;

//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     throw new LoginFailedError('Авторизация не выполнена');
//   }

//   req.user = payload;

//   next();
// };

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new LoginFailedError('Ошибка авторизации');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new LoginFailedError('Авторизация не выполнена');
  }

  req.user = payload;

  next();
};
