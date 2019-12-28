import * as Yup from 'yup';

class Validation {
  validateSchema(type, body) {
    const val = {
      STORE: async () => {
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
      },
      UPDATE: async () => {
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
      },

      DEFAULT: () => false,
    };
    return (val[type] || val.default)();
  }
}

export default new Validation();
