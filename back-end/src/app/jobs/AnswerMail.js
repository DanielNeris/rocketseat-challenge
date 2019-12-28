import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { id, student, question, answer } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Resposta',
      template: 'answer',
      context: {
        id,
        student: student.name,
        question,
        answer,
      },
    });
  }
}

export default new AnswerMail();
