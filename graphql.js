'use strict';

const { ApolloServer } = require('@apollo/server');
const {
  handlers,
  startServerAndCreateLambdaHandler,
} = require('@as-integrations/aws-lambda');

// -------------------
// Schema (typeDefs)
// -------------------
const typeDefs = `
  type Query {
    hello: String
    greet(name: String!): String
    getUsers: [User]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }
`;

// -------------------
// In-memory DB (temporary)
// -------------------
const users = [];

// -------------------
// Resolvers
// -------------------
const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL + Serverless!',
    greet: (_, { name }) =>
      `Hello, ${name}! Welcome to Serverless GraphQL.`,
    getUsers: () => users,
  },

  Mutation: {
  createUser: (_, { name, email }) => {
    // Check if email already exists
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const newUser = {
      id: String(Date.now()),
      name,
      email,
    };

    users.push(newUser);
    return newUser;
  },
},
};

// -------------------
// Apollo Server Setup
// -------------------
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// -------------------
// Lambda Handler
// -------------------
module.exports.graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);