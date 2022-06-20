const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(404)
          .send({
            message: "Пользователь по указанному _id не найден",
          });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

// сработает при POST-запросе на URL /users
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  /* напишите код здесь */
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({
            message: "Переданы некорректные данные при создании пользователя",
          });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(404)
          .send({
            message: "Пользователь по указанному _id не найден",
          });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id, { avatar: "http://изменили аватар" })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(404)
          .send({
            message: "Пользователь по указанному _id не найден",
          });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};
