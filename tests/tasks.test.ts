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

  describe('Task Collaboration & Activity', () => {
    it('should allow adding comments to an existing task and record activity', async () => {
      const res = await request(app)
        .post('/api/v1/tasks/tsk_101/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Started setting up GitHub Actions workflow.'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.content).toBe('Started setting up GitHub Actions workflow.');

      const activityRes = await request(app)
        .get('/api/v1/tasks/tsk_101/activity')
        .set('Authorization', `Bearer ${authToken}`);

      expect(activityRes.status).toBe(200);
      expect(activityRes.body.data.comments.length).toBe(1);
      expect(activityRes.body.data.activities.some((a: any) => a.action === 'COMMENT_ADDED')).toBe(true);
    });

    it('should successfully reassign a task to another valid member', async () => {
      const res = await request(app)
        .post('/api/v1/tasks/tsk_101/assign')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          assigneeId: 'usr_demo_2'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.assigneeId).toBe('usr_demo_2');
    });

    it('should reject assigning to a non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/tasks/tsk_101/assign')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          assigneeId: 'usr_invalid_999'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('does not exist');
    });
  });
});
