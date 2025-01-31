import { ApolloServer } from 'apollo-server-micro';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { rolesResolvers } from '../api/resolvers/roleResolvers'
import { transactionsResolvers } from '../api/resolvers/transactionResolvers'
import { usersResolvers } from '../api/resolvers/userResolvers'
import { rolesTypeDefs } from './models/roleTypeDefs'
import { transactionTypeDefs } from './models/transactionTypeDefs'
import { usersTypeDefs } from './models/userTypeDefs'
import { runMiddleware } from '../api/middleware/runMiddleware'
import { authService } from './services/authService';
import Cors from 'cors';


const typeDefs = mergeTypeDefs([rolesTypeDefs, usersTypeDefs, transactionTypeDefs]);

const resolvers = {
  Query: {
    ...rolesResolvers.Query,
    ...transactionsResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...rolesResolvers.Mutation,
    ...transactionsResolvers.Mutation,
    ...usersResolvers.Mutation,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.split(' ')[1] || null;
    let user = null;

    if (token) {
      try {
        user = authService.verifyToken(token);
      } catch (err) {
        console.error('Error verificando el token:', err.message);
      }
    }
    return { user };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};


const cors = Cors({
  origin: [
    'https://studio.apollographql.com',
    'http://localhost:3000',
    'https://tecnical-test-prevalent.vercel.app'
  ],
  credentials: true,
});

let started = false;
export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (!started) {
    await apolloServer.start();
    started = true;
  }

  return apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}
