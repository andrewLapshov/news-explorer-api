const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const { JWT_SECRET } = require('../constants/config');
const { USER_NOT_FOUND } = require('../constants/errors');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then(hash => User.create({ email, name, password: hash }))
    .then(user => {
      const { password: pass, ...newUser } = user._doc;
      res.status(201).send(newUser);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND);
    })
    .then(user => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports = {
  getUserInfo,
  createUser,
  login,
};
