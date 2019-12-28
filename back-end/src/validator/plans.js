import * as Yup from 'yup';

class Validation {
  validateSchema(type, body) {
    const val = {
      STORE: async () => {
        const schema = Yup.object().shape({
          title: Yup.string().required(),
          duration: Yup.number().required(),
          price: Yup.number().required(),
        });

        if (!(await schema.isValid(body))) {
          return false;
        }

        return true;
      },
      UPDATE: async () => {
        const schema = Yup.object().shape({
          title: Yup.string().required(),
          duration: Yup.number().required(),
          price: Yup.number().required(),
        });

        if (!(await schema.isValid(body))) {
          return false;
        }

        return true;
      },

      DEFAULT: () => false,
    };
    return (val[type] || val.default)();
  }
}

export default new Validation();
