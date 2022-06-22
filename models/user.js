const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { // опишем свойство validate
      validator(email) { // validator - функция проверки данных. e - значение свойства email
        return validator.isEmail(email); // если не почта, вернётся false
      },
      message: 'Введите почту', // когда validator вернёт false, будет использовано это сообщение
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
