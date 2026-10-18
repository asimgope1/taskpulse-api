import request from 'supertest';
import { createApp } from '../src/app';
import { store } from '../src/db/store';

const app = createApp();

describe('Task Endpoints', () => {
  let authToken: string;

  beforeEach(async () => {
    store.resetForTesting();
    // Login with demo account
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });

    authToken = loginRes.body.data.token;
  });

  describe('GET /api/v1/tasks', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/tasks');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should list all tasks for authenticated user', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.total).toBeGreaterThanOrEqual(2);
    });

    it('should filter tasks by status', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?status=IN_PROGRESS')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((t: any) => t.status === 'IN_PROGRESS')).toBe(true);
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task successfully', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Implement Codzee webhook handler',
          description: 'Receive PR review events and log summaries to slack.',
          priority: 'HIGH',
          tags: ['webhooks', 'integrations']
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Implement Codzee webhook handler');
      expect(res.body.data.creatorId).toBe('usr_demo_1');
    });

    it('should fail if title is missing or shorter than 3 characters', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'ab'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
