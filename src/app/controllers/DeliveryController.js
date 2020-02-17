import { Op } from 'sequelize';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { id } = req.params;

    const { delivered } = req.query;

    if (delivered && JSON.parse(delivered)) {
      const orders = await Order.findAll({
        where: { id, canceled_at: null, end_date: null },
        attributes: ['id', 'product', 'recipient_id', 'signature_id'],
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['id', 'name'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['id', 'path', 'url'],
              },
            ],
          },
        ],
      });

      return res.json(orders);
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: { [Op.eq]: null },
        end_date: { [Op.eq]: null },
      },
    });

    return res.json(orders);
  }
}

export default new DeliverymanController();
