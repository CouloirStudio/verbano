import 'dotenv/config';
import http from 'http';
import 'module-alias/register';
import {connectDB} from '@/app/models/Database';
import {ApolloServer, Config, ExpressContext} from 'apollo-server-express';
import typeDefs from '@/app/graphql/schema/index';
import resolvers from '@/app/graphql/resolvers/index';
import {buildContext} from 'graphql-passport';
import {User} from '@/app/models';
import createApp from '@/server/app';
import '@/app/config/mail';
import sendEmail from '@/app/config/mail';

/**
 * Starts the server, including the Apollo GraphQL server and the Express server.
 */
export async function startServer(): Promise<http.Server> {
  const app = createApp();

  await sendEmail();

  await connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => buildContext({ req, res, User }),
  } as Config<ExpressContext>);

  await server.start();
  server.applyMiddleware({ app, cors: false });

  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 3000;

  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });

  return httpServer;
}

// Initialize and start the server only if NOT in a test environment
if (process.env.NODE_ENV !== 'test') {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
  });
}
