const { Router } = require('express');
const { prepareFormErrors } = require('../utils');
const { UserService } = require('./user.service');
const { MOCK_USER } = require('./user.mock');
const { userFields } = require('./user.form');
const { urlEncodedParser } = require('./user.middleware');

const UserController = Router();

UserController.get('/login', (_, res) => res.render('user-form', {
  pageTitle: 'Log in and do your job',
  currentRoute: 'Log in',
  userFields,
  errors: {},
  values: {},
  formAction: '/user/login',
  actionName: 'Log in',
}));

UserController.get('/signup', (_, res) => res.render('user-form', {
  pageTitle: 'Sign up and add new books',
  currentRoute: 'Sign up',
  userFields,
  errors: {},
  values: {},
  formAction: '/user/signup',
  actionName: 'Sign up',
}));

UserController.post('/signup', urlEncodedParser, async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await UserService.signup(email, password);

    if ('error' in result) {
      const errors = prepareFormErrors(result.error);

      return res.status(422).render('user-form', {
        pageTitle: 'Sign up and add new books',
        currentRoute: 'Sign up',
        userFields,
        errors,
        formAction: '/user/signup',
        values: { email },
        actionName: 'Sign up',
      });
    }

    return res.redirect(301, '/user/login');
  } catch (error) {
    throw new Error(`[UserController][post][/signup]. Error: ${error.message}.`);
  }
});

UserController.post('/login', async (_, res) => {
  try {
    const user = await UserService.login(MOCK_USER._id);

    res.json(user);
  } catch (error) {
    throw new Error('The error occured while login user');
  }
});

exports.UserController = UserController;
