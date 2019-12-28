import Student from '../models/Student';

import validations from '../../validator/students';

class StudentController {
  async store(req, res) {
    try {
      const schema = await validations.validateSchema('STORE', req.body);

      if (!schema)
        return res
          .status(400)
          .json({ success: false, error: 'Validation failed' });

      const studentExists = await Student.findOne({
        where: { email: req.body.email },
      });

      if (studentExists)
        return res
          .status(400)
          .json({ success: false, error: 'Email already exists.' });

      const { id, name, email, age, weight, height } = await Student.create(
        req.body
      );

      return res.json({
        student: {
          id,
          name,
          email,
          age,
          weight,
          height,
        },
        success: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async update(req, res) {
    try {
      const schema = await validations.validateSchema('UPDATE', req.body);

      if (!schema)
        return res
          .status(400)
          .json({ success: false, error: 'Validation failed.' });

      const student = await Student.findByPk(req.params.id);

      if (!student)
        return res
          .status(400)
          .json({ success: false, error: 'Student not found.' });

      if (req.body.email !== student.email) {
        const studentExists = await Student.findOne({
          where: { email: req.body.email },
        });

        if (studentExists)
          return res
            .status(400)
            .json({ success: false, error: 'Email already exists.' });
      }

      const { id, name, email, age, weight, height } = await student.update(
        req.body
      );

      return res.json({
        student: {
          id,
          name,
          email,
          age,
          weight,
          height,
        },
        success: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new StudentController();
