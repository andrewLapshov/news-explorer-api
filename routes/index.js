const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const NotFoundError = require('../errors/NotFoundError');
const { URL_NOT_FOUND } = require('../constants/errors');

router.use('/users', users);
router.use('/articles', articles);
router.use((req, res, next) => {
  next(new NotFoundError(URL_NOT_FOUND));
});

module.exports = router;
