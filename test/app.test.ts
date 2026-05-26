import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app';

describe('Fastify app', () => {
  it('GET /health returns ok status', async () => {
    const app = buildApp({ logger: false });
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
    await app.close();
  });

  it('GET / returns app message and version', async () => {
    const app = buildApp({ logger: false });
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().message).toBe('CI/CD Lab Fastify app is running');
    await app.close();
  });

  it('GET / returns "dev" as default version when APP_VERSION is unset', async () => {
    const original = process.env.APP_VERSION;
    delete process.env.APP_VERSION;

    const app = buildApp({ logger: false });
    const response = await app.inject({ method: 'GET', url: '/' });

    expect(response.json().version).toBe('dev');
    await app.close();

    // 還原環境變數
    if (original !== undefined) process.env.APP_VERSION = original;
  });

  it('GET / reflects APP_VERSION env var', async () => {
    process.env.APP_VERSION = '1.2.3';

    const app = buildApp({ logger: false });
    const response = await app.inject({ method: 'GET', url: '/' });

    expect(response.json().version).toBe('1.2.3');
    await app.close();
    delete process.env.APP_VERSION;
  });

  it('GET /nonexistent returns 404', async () => {
    const app = buildApp({ logger: false });
    const response = await app.inject({ method: 'GET', url: '/nonexistent' });

    expect(response.statusCode).toBe(404);
    await app.close();
  });

  it('buildApp accepts custom logger option', () => {
    const app = buildApp({ logger: false });
    // 確認 Fastify instance 正常建立，不會因為 logger: false 而報錯
    expect(app).toBeDefined();
    expect(typeof app.inject).toBe('function');
  });
});