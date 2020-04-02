import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import CancellationMail from '../jobs/CancellattionMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1, per_page = 20 } = req.query;

    const deliveryProblems = await DeliveryProblem.findAll({
      order: ['description'],
      attributes: ['id', 'description'],
      limit: per_page,
      offset: (page - 1) * per_page,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'street',
                'number',
                'complement',
                'state',
                'city',
                'cep',
              ],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['id', 'path', 'url'],
                },
              ],
            },
          ],
        },
      ],
    });
    return res.json(deliveryProblems);
  }

  async findOne(req, res) {
    const { page = 1, per_page = 20 } = req.query;

    const { id } = req.params;

    const deliveryProblems = await DeliveryProblem.findAll({
      where: {
        id,
      },
      attributes: ['id', 'description'],
      limit: per_page,
      offset: (page - 1) * per_page,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'street',
                'number',
                'complement',
                'state',
                'city',
                'cep',
              ],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['id', 'path', 'url'],
                },
              ],
            },
          ],
        },
      ],
    });
    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      order_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { order_id, description } = req.body;

    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const problem = await DeliveryProblem.create({
      order_id,
      description,
    });

    return res.json(problem);
  }

  async delete(req, res) {
    const deliveryProblem = await DeliveryProblem.findByPk(req.params.id);

    deliveryProblem.canceled_at = new Date();

    await deliveryProblem.save();

    const problems = await DeliveryProblem.findAll({
      order: ['description'],
      attributes: ['id', 'description'],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'street',
                'number',
                'complement',
                'state',
                'city',
                'cep',
              ],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['id', 'path', 'url'],
                },
              ],
            },
          ],
        },
      ],
    });

    await Queue.add(CancellationMail.key, {
      problems,
    });

    return res.json({ message: 'Encomenda cancelado com sucesso!' });
  }
}
export default new DeliveryProblemController();
