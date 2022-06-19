const express = require('express');
//const mongoose = require('mongoose');
const path = require('path');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//     useFindAndModify: false
// });

//app.use(express.static(path.resolve(__dirname, 'build')));

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})

