import Mail from '../../lib/Mail';

class PackageMail {
  get key() {
    return 'PackageMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.deliveryman_name} <${order.deliveryman_email}>`,
      subject: 'Pacotes para entrega',
      template: 'package',
      context: {
        deliveryman: order.deliveryman_name,
        product: order.product,
      },
    });
  }
}

export default new PackageMail();
