const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadReqError = require('../utils/errors/bad-req-err');
const NotFoundError = require('../utils/errors/not-found-err');
const Conflict = require('../utils/errors/conflict-err');
const AuthError = require('../utils/errors/auth-err');

const { SUCCESS_CODE, CREATED_CODE } = require('../utils/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(SUCCESS_CODE).send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пост с данным id не найден'));
      }
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const getUsersId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пост с данным id не найден'));
      }
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED_CODE).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Переданы некорректные данные'));
      }
      if (err instanceof ValidationError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');
      if (!user) {
        next(new AuthError('Пользователь с данным email не найден'));
      }
      res
        .cookie('token', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => {
      next(new BadReqError(`${err.message}`));
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пост с данным id не найден'));
      }
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(err);
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пост с данным id не найден'));
      }
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  getUsersId,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
