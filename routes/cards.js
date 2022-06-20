const cardsRouter = require("express").Router();

const { getCards, deleteCards, createCard, likeCard, dislikeCard } = require('../controllers/cards');

cardsRouter.get('/', getCards);

cardsRouter.delete('/:cardId', deleteCards);

cardsRouter.post('/', createCard);

cardsRouter.put('/:cardId/likes', likeCard);

cardsRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRouter;