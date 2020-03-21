const { celebrate, Joi } = require('celebrate');
const LoginFailedError = require('../errors/LoginFailedError');
const BadRequestError = require('../errors/BadRequestError');

const {
  AUTH_FAILED,
  EMAIL_REQUIRED,
  NAME_REQUIRED,
  PASS_REQUIRED,
  NO_KEYWORD,
  NO_TITLE,
  NO_TEXT,
  NO_DATE,
  NO_SOURCE,
  NO_LINK,
  NO_IMAGE,
  NO_ARTICLEID,
} = require('../constants/errors');

Joi.objectId = require('joi-objectid')(Joi);

const signupRequestCheck = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .error(new BadRequestError(NAME_REQUIRED)),
    email: Joi.string()
      .required()
      .email()
      .error(new BadRequestError(EMAIL_REQUIRED)),
    password: Joi.string()
      .required()
      .min(8)
      .error(new BadRequestError(PASS_REQUIRED)),
  }),
});

const loginRequestCheck = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .error(new BadRequestError(EMAIL_REQUIRED)),
    password: Joi.string()
      .required()
      .min(8)
      .error(new BadRequestError(PASS_REQUIRED)),
  }),
});

const authRequestCheck = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .required()
        .error(new LoginFailedError(AUTH_FAILED)),
    })
    .unknown(true),
});

const articleRequestCheck = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string()
      .required()
      .error(new BadRequestError(NO_KEYWORD)),
    title: Joi.string()
      .required()
      .error(new BadRequestError(NO_TITLE)),
    text: Joi.string()
      .required()
      .error(new BadRequestError(NO_TEXT)),
    date: Joi.string()
      .required()
      .error(new BadRequestError(NO_DATE)),
    source: Joi.string()
      .required()
      .error(new BadRequestError(NO_SOURCE)),
    link: Joi.string()
      .required()
      .uri()
      .error(new BadRequestError(NO_LINK)),
    image: Joi.string()
      .required()
      .uri()
      .error(new BadRequestError(NO_IMAGE)),
  }),
});

const articleIdRequestCheck = celebrate({
  params: Joi.object().keys({
    articleId: Joi.objectId()
      .required()
      .error(new BadRequestError(NO_ARTICLEID)),
  }),
});

module.exports = {
  signupRequestCheck,
  loginRequestCheck,
  authRequestCheck,
  articleRequestCheck,
  articleIdRequestCheck,
};
