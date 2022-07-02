const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { getUserId } = require('./utils');

// リゾルバファイル
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const Link = require('./resolvers/Link');
const User = require('./resolvers/User');
const Vote = require('./resolvers/Vote');

// サブスクリプション Publisher(送信者)/Subscriber(受信者)
const { PubSub } = require('apollo-server');
const pubsub = new PubSub();

// GraphQLのスキーマ定義 => .graphql
// const typeDefs = gql``;

// リゾルバ関数
const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
  Vote,
};

const server = new ApolloServer({
  // __dirname: srcディレクトリのパス
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`server is up on ${url}`));
