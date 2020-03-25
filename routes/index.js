const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const authorize = require('./authorize');
const { auth } = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');
const { URL_NOT_FOUND } = require('../constants/errors');

router.use(authorize);

router.use('/users', auth, users);
router.use('/articles', auth, articles);
router.use('*', (req, res, next) => {
  next(new NotFoundError(URL_NOT_FOUND));
});

module.exports = router;
