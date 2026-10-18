import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('GET /health', () => {
  it('should return 200 and healthy status payload', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('service', 'taskpulse-api');
    expect(res.body).toHaveProperty('uptime');
  });
});
