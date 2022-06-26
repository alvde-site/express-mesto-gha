const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { celebrate, Joi, errors } = require('celebrate');
const validator = require('validator');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// авторизация
app.use(auth);

app.use('/users', usersRouter);

app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Извините, я не могу это найти!' });
});
// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
