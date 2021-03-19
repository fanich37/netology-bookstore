const { DB } = require('../db');

const userDb = new DB('user', { _id: String, mail: String });

class UserService {
  constructor(db) {
    this.db = db;
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
