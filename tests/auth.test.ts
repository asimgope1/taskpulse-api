import request from 'supertest';
import { createApp } from '../src/app';
import { store } from '../src/db/store';

const app = createApp();

describe('Auth Endpoints', () => {
  beforeEach(() => {
    store.resetForTesting();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should successfully register a new user and return a JWT', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Alice Developer',
          email: 'alice@example.com',
          password: 'SecurePassword123!',
          role: 'MEMBER'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('alice@example.com');
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject registration if email is already taken', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Demo Dup',
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('already exists');
    });

    it('should reject registration if password is too short', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Short Pass',
          email: 'short@example.com',
          password: 'short'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should authenticate user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject login with invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
