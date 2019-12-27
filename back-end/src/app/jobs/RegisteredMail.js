import moment from 'moment';
import Mail from '../../lib/Mail';

import formatterPrice from '../../helpers/currencyFormatter';

class RegisteredMail {
  get key() {
    return 'RegisteredMail';
  }

  async handle({ data }) {
    const { checkStudent, checkPlan, price, start_date, end_date } = data;

    await Mail.sendMail({
      to: `${checkStudent.name} <${checkStudent.email}>`,
      subject: 'Seja Bem-vindo',
      template: 'registered',
      context: {
        id: checkStudent.id,
        student: checkStudent.name,
        plan: checkPlan.title,
        price: formatterPrice(price),
        start_date: moment(start_date).format('DD/MM/YYYY'),
        end_date: moment(end_date).format('DD/MM/YYYY'),
      },
    });
  }
}

export default new RegisteredMail();
