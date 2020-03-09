const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', users);
router.use('/articles', articles);
router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
