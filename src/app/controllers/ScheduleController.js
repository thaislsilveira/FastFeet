import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  format,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import pt from 'date-fns/locale/pt';
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
        deliveryman_id: deliveryman.id,
      },
      order: ['product'],
      attributes: ['id', 'product', 'start_date', 'end_date'],
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

  async update(req, res) {
    const { start_date, end_date, signature_id } = req.body;

    const order = await Order.findByPk(req.params.id);
    const { id: deliveryman_id } = req.params;

    /** Funções de não permitir cadastrar end_date sem ter um start_date */
    if (end_date && !start_date) {
      const isStartDateNull = await Order.findOne({
        where: { id: req.params.id, start_date: null },
      });

      if (isStartDateNull) {
        return res.status(400).json({
          error: 'You cannot register the delivery date without end_date',
        });
      }
    }

    /** Funções de não permitir cadastrar signature_id sem ter um start_date */
    if (signature_id && !start_date) {
      const isStartDateNullSignature = await Order.findOne({
        where: { id: req.params.id, start_date: null },
      });

      if (isStartDateNullSignature) {
        return res.status(400).json({
          error:
            'You cannot register the subscription without the delivery date',
        });
      }
    }

    /** Funcoes de comparação de tempo entre 8 e 18 e não permitir retirar neste horário */
    const today = new Date();

    const eightHour = format(today.getTime(), "yyyy-MM-dd'T08:00':ssxxx", {
      locale: pt,
    });
    const eighteenHour = format(today.getTime(), "yyyy-MM-dd'T18:00':ssxxx", {
      locale: pt,
    });

    const isBetween8and18 = isWithinInterval(parseISO(start_date), {
      start: parseISO(eightHour),
      end: parseISO(eighteenHour),
    });

    if (!isBetween8and18) {
      return res.status(400).json({
        error: 'You can only pick up a product from 8:00 am to 18:00 pm.',
      });
    }

    const countDeliveries = await Order.count({
      where: {
        deliveryman_id,
        start_date: { [Op.gte]: startOfDay(today), [Op.lte]: endOfDay(today) },
      },
    });
    if (countDeliveries + 1 > 5) {
      return res.status(400).json({
        error: 'Only 5 withdrawals are allowed per day!',
      });
    }

    const { signature } = await Order.findByPk(req.params.id, {
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    await order.update({
      start_date,
      end_date,
      signature,
    });

    return res.json({ message: 'Alterações realizadas com sucesso!' });
  }
}

export default new ScheduleController();
