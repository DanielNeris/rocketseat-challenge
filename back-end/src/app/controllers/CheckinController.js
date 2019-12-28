import { Op } from 'sequelize';
import moment from 'moment';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

import validations from '../../validator/checkins';

class StudentController {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;
      const { student_id } = req.params;

      // const student = await Student.findByPk(student_id);

      const checkins = await Checkin.findAll({
        where: { student_id },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'created_at'],
        limit: 10,
        offset: (page - 1) * 10,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
          },
        ],
      });

      return res.json({ checkins, success: true });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async store(req, res) {
    try {
      const { student_id } = req.params;
      const schema = await validations.validateSchema('STORE', {
        student_id,
      });

      if (!schema)
        return res
          .status(400)
          .json({ success: false, error: 'Validation failed.' });

      const countCheckin = await Checkin.findAll({
        where: {
          student_id,
          created_at: {
            [Op.between]: [
              moment(new Date()).startOf('day'),
              moment(new Date())
                .startOf('day')
                .add(7, 'days'),
            ],
          },
        },
      });

      if (countCheckin.length >= 5)
        return res.status(400).json({
          success: false,
          error: 'You can only do 5 chenkins per week',
        });

      const { id } = await Checkin.create({ student_id });

      return res.json({
        checkin: {
          id,
          student_id,
        },
        success: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new StudentController();
