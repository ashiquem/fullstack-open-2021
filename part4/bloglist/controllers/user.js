const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const constants = require('../utils/constants');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');

  response.json(users);
});

usersRouter.post('/', async (request, response, next) => {
  const body = request.body;

  try {
    if (!isValidPassword(body.password)) {
      return response.status(400).json({
        error: `password must be at least ${constants.PASS_MIN_LENGTH}`,
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

const isValidPassword = (password) =>
  password.length >= constants.PASS_MIN_LENGTH;

module.exports = usersRouter;
