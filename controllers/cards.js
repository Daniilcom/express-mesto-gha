const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;

const Card = require('../models/card');

const BadReqError = require('../utils/errors/bad-req-err');
const NotFoundError = require('../utils/errors/not-found-err');
const Forbidden = require('../utils/errors/forbidden-err');
const { SUCCESS_CODE, CREATED_CODE } = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_CODE).send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Пост с данным id не найден');
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new Forbidden('Пост с данным id невозможно удалить');
      }
      res.status(SUCCESS_CODE).send({ message: 'Пост удален!' });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Пост с данным id не найден'));
      }
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Пост с данным id не найден'));
      }
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
