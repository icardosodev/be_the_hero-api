import request from 'supertest';
import app from '../../app';
import connection from '../../database/connection';

describe('ONG', () => {
  beforeAll(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  })

  it('should be albe to create a new ONG', async () => {
    const response = await request(app)
      .post('/ongs')
      .send({
        name: "sovipa",
        email: "contato@sovipa.com.br",
        whatsapp: "31900000000",
        city: "Viçosa",
        uf: "MG"
      });

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toHaveLength(8);
  });
});
