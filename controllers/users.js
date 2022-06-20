const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка", error: err }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: "Произошла ошибка", error: err })
    );
};

// сработает при POST-запросе на URL /users
module.exports.createUser =  (req, res) => {
  const { name, about, avatar } = req.body;

  /* напишите код здесь */
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка", error: err }));
};

module.exports.updateUser =  (req, res) => {
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id, { name: 'Виктор Гусев' })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: "Произошла ошибка", error: err }));
};

module.exports.updateUserAvatar =  (req, res) => {
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id, { avatar: 'http://изменили аватар' })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: "Произошла ошибка", error: err }));
};