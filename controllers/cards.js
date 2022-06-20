const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка", error: err })
    );
};

module.exports.deleteCards = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(404)
          .send({
            message: "Карточка с указанным _id не найдена",
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
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({
            message: "Переданы некорректные данные при создании карточки",
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
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({
            message: "Переданы некорректные данные для постановки лайка",
          });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(404)
          .send({
            message: "Передан несуществующий _id карточки"
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
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({
            message: "Переданы некорректные данные для снятия лайка",
          });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(404)
          .send({
            message: "Передан несуществующий _id карточки"
          });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};
