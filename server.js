const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

// GraphQL
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema/typeDefs');
const { resolvers } = require('./schema/resolvers');

// Config
const PORT = process.env.PORT || 4000;

// Middleware

app.use(
  cors({
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
    optionsSuccessStatus: 200,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
