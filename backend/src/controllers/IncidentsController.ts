import { Request, Response } from 'express';
import connection from '../database/connection';
import { Incident } from '../models/Incident';

export default {
  async index(request: Request, response: Response) {
    const { page = 1 } = request.query;

    const [count] = await connection('incidents').count();

    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf'
      ]);

    response.header('X-Total-Count', count['count(*)']);

    return response.json(incidents);
  },

  async store(request: Request, response: Response) {
    const { title, description, value } = request.body;
    const ong_id = request.headers.authorization;

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      ong_id,
    });

    response.status(201).json({ id });
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    const incidents: Incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first();

    if (incidents.ong_id !== ong_id) {
      return response.status(401).json({ message: 'Operation not permitted.' });
    }

    await connection('incidents')
      .where('id', id)
      .delete()

    return response.status(204).send();
  }
}