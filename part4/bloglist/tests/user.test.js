const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const helper = require('./test_helper');

const User = require('../models/user');

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

    const users = await Promise.all(initialUsers.map(
      async (user) => {
        return new User({
          username: user.username,
          name: user.name,
          passwordHash: await bcrypt.hash(user.password, 10),
        }) 
      }
    ));

    const userSaveCalls = users.map(user => user.save());

    await Promise.all(userSaveCalls);
  });

  test('creation succeeds with a fresh username', async () => {
    const testUser = {
      username: 'freshuser',
      name: 'Fresh User',
      password: 'freshpassword',
    };

    await api
      .post('/api/users')
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersInDb = await helper.usersInDb();
    expect(usersInDb).toHaveLength(initialUsers.length + 1);

    const userNames = usersInDb.map((u) => u.name);
    expect(userNames).toContain(testUser.name);
  });
  //   test('creation fails with an existin username');
  afterAll(() => {
    mongoose.connection.close()
  })
});
