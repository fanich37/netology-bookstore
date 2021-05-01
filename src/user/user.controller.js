const { Router } = require('express');
const { prepareFormErrors } = require('../utils');
const { UserService } = require('./user.service');
const { userFields } = require('./user.form');
const { urlEncodedParser, restrictedRouteMiddleware } = require('./user.middleware');

const UserController = Router();

UserController.get('/login', (req, res) => req.user
  ? res.redirect('/user/me')
  : res.render('user-form', {
    pageTitle: 'Log in and do your job',
    currentRoute: 'Log in',
    userFields,
    errors: {},
    values: {},
    formAction: '/user/login',
    actionName: 'Log in',
  }),
);

UserController.post('/login', urlEncodedParser, async (req, res, next) => {
  const { email } = req.body;

  try {
    const result = await UserService.login(req, res, next);

    if ('error' in result) {
      const errors = prepareFormErrors(result.error);

      return res.status(422).render('user-form', {
        pageTitle: 'Log in and do your job',
        currentRoute: 'Log in',
        userFields,
        errors,
        values: { email },
        formAction: '/user/login',
        actionName: 'Log in',
      });
    }

    return res.redirect('/user/me');
  } catch (error) {
    throw new Error(`[UserController][post][/login]. Error: ${error.message}.`);
  }
});

UserController.get('/signup', (req, res) => req.user
  ? res.redirect('/user/me')
  : res.render('user-form', {
    pageTitle: 'Sign up and add new books',
    currentRoute: 'Sign up',
    userFields,
    errors: {},
    values: {},
    formAction: '/user/signup',
    actionName: 'Sign up',
  }),
);

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

UserController.get(
  '/me',
  restrictedRouteMiddleware,
  (_, res) => res.render('user-card', {
    pageTitle: 'User page',
    currentRoute: 'User page',
  }));

UserController.post('/logout', (req, res) => {
  req.logout();
  res.clearCookie('__bookstore__').redirect('/');
});

exports.UserController = UserController;
