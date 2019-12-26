import * as Yup from 'yup';

class Validation {
  async validateSchema(type, body) {
    switch (type) {
      case 'store' || 'update':
        // eslint-disable-next-line no-case-declarations
        const schema = Yup.object().shape({
          name: Yup.string().required(),
          email: Yup.string()
            .email()
            .required(),
          age: Yup.number().required(),
          weight: Yup.number().required(),
          height: Yup.number().required(),
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
