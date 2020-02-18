import * as Yup from 'yup';

import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import File from '../models/File';

import PackageMail from '../jobs/PackageMail';
import Queue from '../../lib/Queue';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { deliveryman_id, recipient_id, product } = req.body;

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman not exists.' });
    }

    const recipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not exists.' });
    }

    const { name: deliveryman_name } = deliverymanExists;
    const { email: deliveryman_email } = deliverymanExists;

    const order = await Order.create({
      order_id: req.params.id,
      deliveryman_id,
      recipient_id,
      product,
    });

    await Queue.add(PackageMail.key, {
      order,
      deliveryman_name,
      deliveryman_email,
    });

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    await order.update(req.body);

    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
      signature,
    } = await Order.findByPk(req.params.id, {
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
      signature,
    });
  }
}

export default new OrderController();
