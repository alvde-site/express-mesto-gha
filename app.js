const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '62b38ec23d0367f63dd3d08b'
//   };

//   next();
// });

app.post('/signin', login);

app.post('/signup', createUser);

app.use('/users', auth, usersRouter);

app.use('/cards', auth, cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Извините, я не могу это найти!' });
});

app.listen(PORT);
