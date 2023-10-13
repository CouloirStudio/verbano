import { Express } from 'express-serve-static-core';
import { createApp } from '../../../server/server';
import request from 'supertest';

const mockAuthenticationMiddleware = (req, res, next) => {
  req.user = { id: 1, email: 'test@gmail.com' };
  next();
};
describe('/auth-check Endpoint', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp(mockAuthenticationMiddleware);
  });

  it('returns 200 for authenticated users', async () => {
    const response = await request(app).get('/auth-check');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Authenticated');
  });

  it('returns 401 for unauthorized users', async () => {
    app = createApp(); // Recreate app without mock middleware
    const response = await request(app).get('/auth-check');
    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });
});
