const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const { PORT, MONGO_IP } = require('./constants/config');

const router = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const {
  signupRequestCheck,
  loginRequestCheck,
  authRequestCheck,
} = require('./modules/validations');

const { auth } = require('./middlewares/auth');
const limiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect(MONGO_IP, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(limiter);
app.use(requestLogger);

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', signupRequestCheck, createUser);
app.post('/signin', loginRequestCheck, login);

app.use(cookieParser());

app.use(authRequestCheck, auth);
app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
