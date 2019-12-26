import * as Yup from 'yup';

class Validation {
  async validateSchema(type, body) {
    switch (type) {
      case 'store':
      case 'update':
        // eslint-disable-next-line no-case-declarations
        const schema = Yup.object().shape({
          title: Yup.string().required(),
          duration: Yup.number().required(),
          price: Yup.number().required(),
        });

        if (!(await schema.isValid(body))) {
          return false;
        }
        return true;
      default:
        return false;
    }
  }
}

export default new Validation();
