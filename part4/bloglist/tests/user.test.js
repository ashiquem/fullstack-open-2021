const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const User = require('../models/user');
const constants = require('../utils/constants');

const initialUsers = [
  {
    username: 'testuser0',
    name: 'user0',
    password: 'password0',
  },
  {
    username: 'testuser1',
    name: 'user1',
    password: 'password1',
  },
];

describe(`when there is initially ${initialUsers.length} user in db`, () => {
  beforeEach(async () => {
    // seeding the db
    await User.deleteMany({});

    const users = await Promise.all(
      initialUsers.map(async (user) => helper.createUser(user))
    );

    const userSaveCalls = users.map((user) => user.save());

    await Promise.all(userSaveCalls);
  });

  test('get returns all current users', async () => {
    const usersResponse = await api.get(constants.URLS.users);
    expect(usersResponse.body).toHaveLength(initialUsers.length);
  });

  test('creation succeeds with a fresh username', async () => {
    const testUser = {
      username: 'freshuser',
      name: 'Fresh User',
      password: 'freshpassword',
    };

    await api
      .post(constants.URLS.users)
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersInDb = await helper.usersInDb();
    expect(usersInDb).toHaveLength(initialUsers.length + 1);

    const userNames = usersInDb.map((u) => u.name);
    expect(userNames).toContain(testUser.name);
  });
  test('creation fails with an existing username', async () => {
    const existingUser = {
      username: 'testuser0',
      name: 'user0',
      password: 'password0',
    };

    const response = await api
      .post(constants.URLS.users)
      .send(existingUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(initialUsers.length);
  });

  test(`creation fails with username shorter than ${constants.USERNAME_MIN_LENGTH} characters`, async () => {
    const invalidUserName = {
      username: 'te',
      name: 'user0',
      password: 'password0',
    };

    const response = await api
      .post(constants.URLS.users)
      .send(invalidUserName)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain(
      `username must be at least ${constants.USERNAME_MIN_LENGTH} 3 characters`
    );
  });

  test(`creation fails with password shorter than ${constants.PASS_MIN_LENGTH} characters`, async () => {
    const invalidPass = {
      username: 'validUserName',
      name: 'user0',
      password: 'pa',
    };

    const response = await api
      .post(constants.URLS.users)
      .send(invalidPass)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain(
      `password must be at least ${constants.PASS_MIN_LENGTH}`
    );
  });
  afterAll(() => {
    mongoose.connection.close();
  });
}, 100000);
