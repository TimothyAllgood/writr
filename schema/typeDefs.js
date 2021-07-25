const { gql } = require('apollo-server-express');

// Defines GraphQL Types
const typeDefs = gql`
  type User {
    username: String!
    email: String!
    password: String!
  }

  # Queries

  type Query {
    # User Queries
    getAllUsers: [User!]!
  }

  # Mutations
  type Mutation {
    # User Mutations
    register(username: String!, email: String!, password: String!): User!
  }
`;

module.exports = { typeDefs };
