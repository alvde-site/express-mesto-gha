const bcrypt = require('bcrypt'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// сработает при POST-запросе на URL /users
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new Error('Error_404');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.message === 'Error_404') {
        res.status(404).send({
          message: 'Пользователь по указанному_id в БД не найден',
        });

        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Пользователь по указанному _id не найден',
        });

        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new Error('Error_404');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.message === 'Error_404') {
        res.status(404).send({
          message: 'Пользователь по указанному_id в БД не найден',
        });

        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Пользователь по указанному _id не найден',
        });

        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => { // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: 3600 * 24 * 7 },
      );
      // отправим токен, браузер сохранит его в куках
      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          httpOnly: true,
        })
        .send({ token }); // если у ответа нет тела, можно использовать метод end
    })
    .catch((err) => {
      // возвращаем ошибку аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
    },
  )
    .then((user) => {
      if (
        user.name.length < 2
        || user.name.length > 30
        || user.about.length < 2
        || user.about.length > 30
      ) {
        throw new Error('Error_400');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.message === 'Error_400') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });

        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};
