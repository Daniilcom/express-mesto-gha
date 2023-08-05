const express = require('express');
const helmet = require('helmet');
const { errors } = require('celebrate');

const mongoose = require('mongoose');

const NotFoundError = require('./utils/errors/not-found-err');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const {
  validateRegister,
  validateLogin,
} = require('./middlewares/auth-validator');
const { errHandler } = require('./middlewares/err-handler');
const { createUser, login } = require('./controllers/users');

mongoose.connect(DB_URL);

app.use(express.json());
app.use(helmet());

app.post('/signup', validateRegister, createUser);
app.post('/signin', validateLogin, login);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use(errHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
