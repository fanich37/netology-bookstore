const expressSession = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { DB } = require('../db');
const { UserSchema, User } = require('./user.model');
const { validateUser } = require('./user.validator');
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

const userDb = new DB('user', UserSchema);

class UserService {
  static async hash(password) {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hash = await bcrypt.hash(password, salt);

      return hash;
    } catch (error) {
      throw new Error(`[UserService][hash]. Error: ${error.message}.`);
    }
  }

  static async compare(password, hash) {
    try {
      const match = await bcrypt.compare(password, hash);

      return match;
    } catch (error) {
      throw new Error(`[UserService][compare]. Error: ${error.message}.`);
    }
  }

  constructor(db) {
    this.db = db;
  }

  init(app) {
    app.use(expressSession({
      secret: process.env.COOKIE_SECRET || 'some_secret_key',
      name: '__bookstore__',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
      },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    const strategy = new Strategy({
      usernameField: 'email',
      passwordField: 'password',
    }, this.verify);

    passport.use('local', strategy);
    passport.serializeUser(this.serialize);
    passport.deserializeUser(this.deserialize);
  }

  serialize(user, done) {
    const { _id, email } = user;

    return done(null, `${_id}_${email}`);
  }

  deserialize = async (user, done) => {
    const [_id] = user.split('_');

    try {
      const user = await this.db.getOneById(_id);
      // eslint-disable-next-line no-unused-vars
      const { password, ...rest } = user;

      return done(null, rest);
    } catch (error) {
      throw new Error(`[UserService][deserialize]. Error: ${error.message}.`);
    }
  }

  verify = async (email, password, done) => {
    try {
      const user = await this.db.getOneByParams({ email });

      if (!user) {
        const error = {
          error: {
            details: [
              {
                message: `there is no user with email "${email}"`,
                context: { key: 'email' },
              },
            ],
          },
        };

        return done(null, false, error);
      }

      const { password: hash } = user;
      const isPasswordValid = await UserService.compare(password, hash);

      if (!isPasswordValid) {
        const error = {
          error: {
            details: [
              {
                message: 'the password is not valid',
                context: { key: 'password' },
              },
            ],
          },
        };

        return done(null, false, error);
      }

      return done(null, user);
    } catch (error) {
      throw new Error(`[UserService][verify]. Error: ${error.message}.`);
    }
  }

  async signup(email, password) {
    try {
      const isUserExists = await this.db.getOneByParams({ email });

      if (isUserExists) {
        return {
          error: {
            details: [
              {
                message: `user with email "${email}" already exists`,
                context: { key: 'email' },
              },
            ],
          },
        };
      }

      const { error } = validateUser({ email, password });

      if (error) {
        return { error };
      }

      const passwordHash = await UserService.hash(password);
      const newUser = new User(email, passwordHash);
      const user = await this.db.createRecord(newUser);
      // eslint-disable-next-line no-unused-vars
      const { password: hash, ...rest } = user;

      return rest;
    } catch (error) {
      throw new Error(`[UserService][signup]. Error: ${error.message}.`);
    }
  }

  async login(req, res, next) {
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (error, user, errors) => {
        if (error) {
          return reject(error);
        }

        if (!user) {
          const errorsToShow = errors.message
            ? {
              error: {
                details: [
                  {
                    message: errors.message,
                    context: { key: 'email' },
                  },
                  {
                    message: errors.message,
                    context: { key: 'password' },
                  },
                ],
              },
            }
            : errors;

          return resolve(errorsToShow);
        }

        req.login(user, (error) => error ? next(error) : resolve(user));
      })(req, res, next);
    });
  }
}

exports.UserService = new UserService(userDb);
