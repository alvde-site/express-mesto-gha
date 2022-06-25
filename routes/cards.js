const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  deleteCards,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);

cardsRouter.delete('/:cardId', deleteCards);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/[www]?[\da-zA-Z]+#?/),
  }).unknown(true),
}), createCard);

cardsRouter.put('/:cardId/likes', likeCard);

cardsRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRouter;
