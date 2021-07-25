const express = require('express');
const app = express();

// GraphQL
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema/typeDefs');
const { resolvers } = require('./schema/resolvers');

// Config
const PORT = process.env.PORT || 4000;

// Initiate ApolloServer
const startup = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });
  return app;
};

startup();

// Run app
app.listen(PORT, console.log('Server running on ', PORT));
