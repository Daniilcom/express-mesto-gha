const mongoose = require('mongoose');
const Card = require('../models/card');

const {
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  SUCCESS_CODE,
  CREATED_CODE,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_CODE).send({ data: cards }))
    .catch(() => {
      res
        .status(ERROR_SERVER)
        .send({ message: `Ошибка на сервере: ${ERROR_SERVER}` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name instanceof mongoose.ValidationError) {
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

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({
          message: `Пост с данным id не найден. Ошибка: ${ERROR_NOT_FOUND}`,
        });
        return;
      }
      res.status(SUCCESS_CODE).send({ message: 'Пост удален' });
    })
    .catch((err) => {
      if (err.name instanceof mongoose.ValidationError) {
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({
          message: `Пост с данным id не найден. Ошибка: ${ERROR_NOT_FOUND}`,
        });
        return;
      }
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name instanceof mongoose.ValidationError) {
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({
          message: `Пост с данным id не найден. Ошибка: ${ERROR_NOT_FOUND}`,
        });
        return;
      }
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name instanceof mongoose.ValidationError) {
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

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
