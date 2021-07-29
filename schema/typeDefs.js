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

	type Author {
		id: String
		username: String
	}

	type Story {
		title: String
		story: String
		author: Author
	}

	# Queries

	type Query {
		# User Queries
		getAllUsers: [User!]!
		getAllStories: [Story!]!
		getUserStories(id: String!): [Story!]!
		getUser(id: String!): User!
		verify: User
	}

	# Mutations
	type Mutation {
		# User Mutations
		signup(username: String!, email: String!, password: String!): User!
		login(username: String!, password: String!): LoggedInUser!
		createStory(
			title: String!
			story: String!
			authorId: String!
			authorUsername: String!
		): Story!
	}
`;

module.exports = { typeDefs };
