const mongoose = require('mongoose');
const { ValidationError, CastError } = mongoose.Error;
const User = require('../models/user');

const {
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  SUCCESS_CODE,
  CREATED_CODE,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS_CODE).send({ data: users }))
    .catch(() => {
      res
        .status(ERROR_SERVER)
        .send({ message: `Ошибка на сервере: ${ERROR_SERVER}` });
    });
};

const getUsersId = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({
          message: `Пост с данным id не найден. Ошибка: ${ERROR_NOT_FOUND}`,
        });
        return;
      }
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(ERROR_CODE).send({
          message: `Переданы некорректные данные. Ошибка: ${ERROR_CODE}`,
          ...err,
        });
        return;
      }
      res
        .status(ERROR_SERVER)
        .send({ message: `Ошибка на сервере: ${ERROR_SERVER}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_CODE).send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(ERROR_CODE).send({
          message: `Переданы некорректные данные. Ошибка: ${ERROR_CODE}`,
        });
        return;
      }
      res
        .status(ERROR_SERVER)
        .send({ message: `Ошибка на сервере: ${ERROR_SERVER}` });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((userData) => res.status(CREATED_CODE).send({ data: userData }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(ERROR_CODE).send({
          message: `Переданы некорректные данные. Ошибка: ${ERROR_CODE}`,
        });
        return;
      }
      res
        .status(ERROR_SERVER)
        .send({ message: `Ошибка на сервере: ${ERROR_SERVER}` });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((avatarUpd) => res.status(CREATED_CODE).send({ data: avatarUpd }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(ERROR_CODE).send({
          message: `Переданы некорректные данные. Ошибка: ${ERROR_CODE}`,
        });
        return;
      }
      res
        .status(ERROR_SERVER)
        .send({ message: `Ошибка на сервере: ${ERROR_SERVER}` });
    });
};

module.exports = { getUsers, getUsersId, createUser, updateUser, updateAvatar };
