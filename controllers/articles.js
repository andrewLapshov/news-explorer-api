const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const NoPermissions = require('../errors/NoPermissions');
const {
  ARTICLES_NOT_FOUND,
  ARTICLE_NOT_FOUND,
  NO_PERMISSIONS,
} = require('../constants/errors');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError(ARTICLES_NOT_FOUND);
    })
    .then((articles) => res.status(200).send({ data: articles }))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((article) => res.status(201).send({ data: article }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findOne({ _id: articleId })
    .select('+owner')
    .orFail(() => {
      throw new NotFoundError(ARTICLE_NOT_FOUND);
    })
    .then((articleInfo) => {
      if (!articleInfo.owner.equals(req.user._id)) {
        throw new NoPermissions(NO_PERMISSIONS);
      }
      Article.findByIdAndRemove(articleId)
        .then((article) => res.status(200).send({ data: article }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
