const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.deleteCards = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      const owner = `${card.owner}`;
      if (req.user._id !== owner) {
        return Promise.reject(new Error('Error_403'));
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          if (!card) {
            throw new Error('Error_404');
          } else {
            res.send({ data: card });
          }
        })
        .catch((err) => {
          if (err.message === 'Error_404') {
            res.status(404).send({
              message: 'Карточки по указанному_id в БД не найден',
            });

            return;
          }
          if (err.name === 'CastError') {
            res.status(400).send({
              message: 'Карточка с указанным _id не найдена',
            });
            return;
          }
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Карточка с указанным _id не найдена',
        });
        return;
      }
      if (err.message === 'Error_403') {
        res.status(403).send({
          message: 'Нельзя удалить чужую карточку',
        });
        return;
      }
      if (err.message === 'Error_404') {
        res.status(404).send({
          message: 'Карточки по указанному_id в БД не найден',
        });

        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
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
      res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('Error_404');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.message === 'Error_404') {
        res.status(404).send({
          message: 'Карточки по указанному_id в БД не найден',
        });

        return;
      }
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
      res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('Error_404');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.message === 'Error_404') {
        res.status(404).send({
          message: 'Карточка по указанному_id в БД не найдена',
        });

        return;
      }
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
      res.status(500).send({ message: err.message });
    });
};
