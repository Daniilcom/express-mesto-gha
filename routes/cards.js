const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/card-validator');

cardsRouter.get('/', getCards);
cardsRouter.post('/', validateCreateCard, createCard);
cardsRouter.delete('/:cardId', validateCardId, deleteCard);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRouter;
