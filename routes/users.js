const usersRouter = require("express").Router();

const { getUsers, getUserById, createUser, updateUser } = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/:userId', getUserById);

usersRouter.post('/', createUser);

usersRouter.patch('/me', updateUser);

module.exports = usersRouter;
