const uuid = require('uuid').v4;

class User {
  constructor(email, password) {
    this._id = uuid();
    this.email = email;
    this.password = password;
  }
}

const UserSchema = {
  _id: String,
  email: String,
  password: String,
};

exports.User = User;
exports.UserSchema = UserSchema;
