const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const LoginFailedError = require('../errors/LoginFailedError');

const {
  EMAIL_ALREADY_USED,
  WRONG_EMAIL,
  WRONG_EMAIL_OR_PASSWORD,
} = require('../constants/errors');

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: WRONG_EMAIL,
  }),
];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
    validate: emailValidator,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.plugin(uniqueValidator, { message: EMAIL_ALREADY_USED });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new LoginFailedError(WRONG_EMAIL_OR_PASSWORD));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new LoginFailedError(WRONG_EMAIL_OR_PASSWORD));
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
