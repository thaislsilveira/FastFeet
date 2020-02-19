import Mail from '../../lib/Mail';

class PackageMail {
  get key() {
    return 'PackageMail';
  }

  async handle({ data }) {
    const {
      order: { deliveryman, recipient, product },
    } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Novos Pacotes para entrega',
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

export default new PackageMail();
