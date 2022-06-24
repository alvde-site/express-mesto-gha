const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);

usersRouter.get('/', getUsers);

usersRouter.get('/:userId', getUserById);

usersRouter.patch('/me', updateUser);

usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;
