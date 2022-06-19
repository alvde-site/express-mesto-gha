const usersRouter = require("express").Router();

const { getUsers, getUserById, createUser } = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/:userId', getUserById);

usersRouter.post('/', createUser);

module.exports = usersRouter;
