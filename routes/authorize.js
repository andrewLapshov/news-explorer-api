const authorize = require('express').Router();
const { login, createUser } = require('../controllers/users');
const {
  signupRequestCheck,
  loginRequestCheck,
} = require('../modules/validations');

authorize.post('/signup', signupRequestCheck, createUser);
authorize.post('/signin', loginRequestCheck, login);

module.exports = authorize;
