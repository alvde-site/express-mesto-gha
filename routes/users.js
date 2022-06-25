const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);

usersRouter.get('/', getUsers);

usersRouter.get('/:userId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    postId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

usersRouter.patch('/me', updateUser);

usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;
