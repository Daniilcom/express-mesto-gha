const usersRouter = require('express').Router();
const {
  getUsers,
  getUser,
  getUsersId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const {
  validateUserId,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/user-validator');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser);
usersRouter.get('/:userId', validateUserId, getUsersId);
usersRouter.patch('/me', validateUpdateUser, updateUser);
usersRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = usersRouter;
