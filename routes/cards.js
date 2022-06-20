const cardsRouter = require("express").Router();

const { getCards, deleteCards, createCard } = require('../controllers/cards');

cardsRouter.get('/', getCards);

cardsRouter.delete('/:cardId', deleteCards);

cardsRouter.post('/', createCard);

module.exports = cardsRouter;