const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const signupRequestCheck = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(8),
  }),
});

const loginRequestCheck = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(8),
  }),
});

const authRequestCheck = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .unknown(true),
});

const articleRequestCheck = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string()
      .required()
      .uri(),
    image: Joi.string()
      .required()
      .uri(),
  }),
});

const articleIdRequestCheck = celebrate({
  params: Joi.object().keys({
    articleId: Joi.objectId().required(),
  }),
});

module.exports = {
  signupRequestCheck,
  loginRequestCheck,
  authRequestCheck,
  articleRequestCheck,
  articleIdRequestCheck,
};
