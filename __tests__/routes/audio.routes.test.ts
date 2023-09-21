import request from 'supertest';
import express from 'express';
import audioRoutes from '../../app/routes/audioRoutes';
import { startApolloServer, createApp } from '../../server/server';

// Mock the database connection to return a resolved promise.
jest.mock('../../app/models/Database', () => ({
  connectDB: jest.fn().mockResolvedValue(null),
}));

// Mock the Next.js request handler and prepare method.
jest.mock('next', () => () => ({
  getRequestHandler: jest
    .fn()
    .mockReturnValue((_req: express.Request, res: express.Response) =>
      res.end('next.js handler'),
    ),
  prepare: jest.fn().mockResolvedValue(null),
}));

describe('Server setup', () => {
  let app: express.Express;
  let server: any;

  // Set up the Express app and Apollo server before running tests.
  beforeAll(async () => {
    app = createApp();
    // Start Apollo server on a dynamic port (0 means any available port).
    server = await startApolloServer(app, 0);
    app.use('/audio', audioRoutes);
  }, 10000);

  // Test the /audio route's response.
  test('should add /audio route', async () => {
    const response = await request(app).get('/audio');
    expect(response.status).toBe(200);
  });

  // Close the server after running all tests.
  afterAll(() => {
    if (server) {
      server.close();
    }
  });
});
