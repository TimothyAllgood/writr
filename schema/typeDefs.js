const { gql } = require('apollo-server-express');

// Defines GraphQL Types
const typeDefs = gql`
  type User {
    username: String!
    email: String!
    password: String!
  }

  type LoggedInUser {
    id: String
    username: String
    token: String!
  }

  # Queries

  type Query {
    # User Queries
    getAllUsers: [User!]!
    getUser(id: String!): User!
    verify: User
  }

  # Mutations
  type Mutation {
    # User Mutations
    signup(username: String!, email: String!, password: String!): User!
    login(username: String!, password: String!): LoggedInUser!
  }
`;

module.exports = { typeDefs };
