import 'dotenv/config';
import https from 'https';
import fs from 'fs';
import path from 'path';
import 'module-alias/register';
import { connectDB } from '@/app/models/Database';
import { ApolloServer, Config, ExpressContext } from 'apollo-server-express';
import typeDefs from '@/app/graphql/schema/index';
import resolvers from '@/app/graphql/resolvers/index';
import { buildContext } from 'graphql-passport';
import { User } from '@/app/models';
import createApp from '@/server/app';

/**
 * Starts the server, including the Apollo GraphQL server and the Express server.
 */
export async function startServer(): Promise<https.Server> {
  const app = createApp();

  await connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });

  const passphrase = process.env.CERT_PASSPHRASE;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => buildContext({ req, res, User }),
  } as Config<ExpressContext>);

  await server.start();
  server.applyMiddleware({ app, cors: false });

  const httpsServer = https.createServer({
      key: fs.readFileSync(path.join(__dirname, '../certs', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '../certs', 'cert.pem')),
      passphrase: passphrase,
    }, app);
  const PORT = process.env.PORT || 3000;

  httpsServer.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
    console.log(`GraphQL endpoint: https://localhost:${PORT}/graphql`);
  });

  return httpsServer;
}

// Initialize and start the server only if NOT in a test environment
if (process.env.NODE_ENV !== 'test') {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
  });
}
