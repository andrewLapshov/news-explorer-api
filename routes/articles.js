const articles = require('express').Router();

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

const {
  articleRequestCheck,
  articleIdRequestCheck,
} = require('../modules/validations');

articles.get('/', getArticles);
articles.post('/', articleRequestCheck, createArticle);
articles.delete('/:articleId', articleIdRequestCheck, deleteArticle);

module.exports = articles;
