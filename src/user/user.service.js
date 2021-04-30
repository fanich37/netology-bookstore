const bcrypt = require('bcrypt');
const { DB } = require('../db');
const { UserSchema, User } = require('./user.model');
const { validateUser } = require('./user.validator');
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

const userDb = new DB('user', UserSchema);

class UserService {
  constructor(db) {
    this.db = db;
  }

  static async hash(password) {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hash = await bcrypt.hash(password, salt);

      return hash;
    } catch (error) {
      throw new Error(`[UserService][hash]. Error: ${error.message}.`);
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

  async login(id) {
    try {
      const result = await this.db.getOneById(id);

      return result;
    } catch (error) {
      throw new Error('The error occured in userService');
    }
  }
}

exports.UserService = new UserService(userDb);
