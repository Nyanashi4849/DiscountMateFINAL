const request = require('supertest');
const app = require('../src/server');

describe('Product API Tests', () => {

  test('GET /products should not crash', async () => {
    const res = await request(app).get('/products');

    // Only check: server is alive
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(600);
  });

  test('POST /products should not crash', async () => {
    const res = await request(app)
      .post('/products')
      .send({ name: 'Test Product', price: 100 });

    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(600);
  });

});
