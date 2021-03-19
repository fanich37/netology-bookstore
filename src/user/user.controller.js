const { Router } = require('express');
const { UserService } = require('./user.service');
const { MOCK_USER } = require('./user.mock');

const UserController = Router();

UserController.post('/login', async (_, res) => {
  try {
    const user = await UserService.login(MOCK_USER._id);

    res.json(user);
  } catch (error) {
    throw new Error('The error occured while login user');
  }
});

exports.UserController = UserController;
