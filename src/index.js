import express from 'express';

const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const AuthPayload = require('./resolvers/AuthPayload')
const Subscription = require('./resolvers/Subscription')
const Feed = require('./resolvers/Feed')

const app = express()

const resolvers = {
  Query,
  Mutation,
  AuthPayload,
  Subscription,
  Feed,
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: './src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/likeap/db/dev',
      secret: 'mysecret123',
      debug: true
    }),
  }),
  debug: true,
  tracing: true,
  introspection: true,
  playground: true
})


server.applyMiddleware({ app, path: '/graphql' });
app.listen({ port: 4000 }, () => {
  console.log('Apollo Server on http://localhost:4000/graphql');
});
//server.start(() => console.log('Server is running on http://localhost:4000'));

