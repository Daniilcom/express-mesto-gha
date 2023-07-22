const express = require('express');
const helmet = require('helmet');

const mongoose = require('mongoose');

const { ERROR_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect(DB_URL);

app.use(express.json());
app.use(helmet());
app.use((req, res, next) => {
  req.user = {
    _id: '64ba66017bbce797d7e6b159',
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).json({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
