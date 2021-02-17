const { Router } = require('express');
const { UserService } = require('./user.service');

const UserController = Router();

UserController.post('/login', async (_, res) => {
  const user = await UserService.login();

  res.json(user);
});

exports.UserController = UserController;
