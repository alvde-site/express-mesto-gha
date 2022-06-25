const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.deleteCards = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      const owner = `${card.owner}`;
      if (req.user._id !== owner) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          if (!card) {
            throw new NotFoundError('Карточки по указанному_id в БД не найден');
          } else {
            res.send({ data: card });
          }
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(400).send({
              message: 'Карточка с указанным _id не найдена',
            });
            return;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Карточка с указанным _id не найдена',
        });
        return;
      }
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  /* напишите код здесь */
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки по указанному_id в БД не найден');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Передан несуществующий _id карточки',
        });
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки по указанному_id в БД не найден');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Передан несуществующий _id карточки',
        });
        return;
      }
      next(err);
    });
};
