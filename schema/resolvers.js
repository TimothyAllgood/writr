// Fake Database to test GraphQL
const { users } = require('../fakeData');

// Returns a list of all users
const getAllUsers = () => {
  return users;
};

// Resolvers for GraphQL
const resolvers = {
  Query: {
    getAllUsers,
  },
};

module.exports = { resolvers };
