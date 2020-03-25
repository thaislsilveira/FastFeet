import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';

class ProblemController {
  async index(req, res) {
    const { page = 1, per_page = 20 } = req.query;

    const { id: order_id } = req.params;

    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found.' });
    }

    const deliveryProblems = await DeliveryProblem.findAll({
      where: {
        order_id: order.id,
      },
      order: ['description'],
      attributes: ['id', 'description'],
      limit: per_page,
      offset: (page - 1) * per_page,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product'],
        },
      ],
    });
    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'A message is required' });
    }

    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    const { description } = req.body;

    const createorder = await DeliveryProblem.create({
      order_id: id,
      description,
    });

    return res.json(createorder);
  }
}
export default new ProblemController();
