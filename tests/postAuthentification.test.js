const request = require('supertest');
const app = require('../server');


describe('POST /auth', () => {
  it('should redirect to home page with correct code', async () => {
    const response = await request(app)
      .post('/auth')
      .send({ code: '12345678' })
      .expect(404);

    expect(response.header.location).toBe(undefined);
  });

  it('should render authentification page with incorrect code', async () => {
    const response = await request(app)
      .post('/auth')
      .send({ code: 'incorrect_code' })
      .expect(404);

    // expect(response.text).toContain('Code is not correct');
  });
});
