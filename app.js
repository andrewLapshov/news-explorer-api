const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const { PORT, MONGO_IP, ALLOWED_ORIGINS } = require('./constants/config');

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

app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }),
);

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
