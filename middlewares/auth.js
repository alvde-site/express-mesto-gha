const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { cookie } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!cookie) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  // извлечём токен
  const token = cookie.replace('jwt=', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Необходима авторизация', mytoken: token });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
