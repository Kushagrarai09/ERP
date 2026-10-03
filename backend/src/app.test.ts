import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

const app = createApp();

describe('API smoke tests', () => {
  it('reports that the API is running', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('protects tenant resources without a bearer token', async () => {
    const response = await request(app).get('/api/companies');
    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe('Authentication required');
  });
});