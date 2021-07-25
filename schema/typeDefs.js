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
`;

module.exports = { typeDefs };
