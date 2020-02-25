import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Pacote Cancelado',
      template: 'package',
      context: {
        deliveryman: deliveryman.name,
        product,
        recipient: recipient.name,
        address: `
          ${recipient.street},
          ${recipient.number},
          ${recipient.city} - ${recipient.state}`,
      },
    });
  }
}

export default new CancellationMail();
