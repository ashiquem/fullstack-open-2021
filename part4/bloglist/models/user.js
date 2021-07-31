const mongoose = require('mongoose');
const constants = require('../utils/constants');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [
      constants.USERNAME_MIN_LENGTH,
      `username must be at least ${constants.USERNAME_MIN_LENGTH} 3 characters`,
    ],
  },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
