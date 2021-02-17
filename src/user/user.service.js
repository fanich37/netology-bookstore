const { MOCK_USER } = require('./user.mock');
const { DB } = require('../db');

const userDb = new DB('user');
userDb.createRecord(MOCK_USER);

class UserService {
  constructor(db) {
    this.db = db;
  }

  login(id = MOCK_USER.id) {
    return this.db.getOneById(id);
  }
}

exports.UserService = new UserService(userDb);
