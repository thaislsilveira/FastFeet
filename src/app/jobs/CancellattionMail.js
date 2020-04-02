import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const {
      order: { deliveryman, recipient, product },
    } = data.problems[0];

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Pacote Cancelado',
      template: 'cancellation',
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
