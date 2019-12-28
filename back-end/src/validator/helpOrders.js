import * as Yup from 'yup';

class Validation {
  validateSchema(type, body) {
    const val = {
      STORE: async () => {
        const schema = Yup.object().shape({
          student_id: Yup.number().required(),
          question: Yup.string().required(),
        });

        if (!(await schema.isValid(body))) {
          return false;
        }

        return true;
      },
      UPDATE: async () => {
        const schema = Yup.object().shape({
          answer: Yup.string().required(),
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
