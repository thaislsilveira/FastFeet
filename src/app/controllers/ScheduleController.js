import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import File from '../models/File';
import Recipient from '../models/Recipient';

class ScheduleController {
  async index(req, res) {
    const { page = 1, per_page = 20 } = req.query;

    const { id: deliveryman_id } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found.' });
    }

    const orders = await Order.findAll({
      where: {
        canceled_at: null,
        end_date: null,
        deliveryman_id: deliveryman.id,
      },
      order: ['product'],
      attributes: ['id', 'product', 'start_date'],
      limit: per_page,
      offset: (page - 1) * per_page,
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
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    return res.json(orders);
  }
}

export default new ScheduleController();
