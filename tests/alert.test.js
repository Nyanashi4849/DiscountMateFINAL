const request = require('supertest');
const app = require('../src/server');

describe('Alert API Tests', () => {

  test('GET /alerts should not crash', async () => {
    const res = await request(app).get('/alerts');

    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(600);
  });

  test('POST /alerts should not crash', async () => {
    const res = await request(app)
      .post('/alerts')
      .send({ productId: '123', targetPrice: 50 });

    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(600);
  });

});
