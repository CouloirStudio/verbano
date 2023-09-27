import request from 'supertest';
import express from 'express';
import audioRoutes from '../../app/routes/audioRoutes';
import { startApolloServer, createApp } from '../../server/server';
import http from 'http';

jest.mock('../../app/models/Database', () => ({
  connectDB: jest.fn().mockResolvedValue(null),
}));

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
  let server: http.Server;

  beforeAll(async () => {
    app = createApp();
    server = await startApolloServer(app, 0);
    app.use('/audio', audioRoutes);
  }, 10000);

  test('should add /audio route', async () => {
    const response = await request(app).get('/audio');
    expect(response.status).toBe(200);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });
});
