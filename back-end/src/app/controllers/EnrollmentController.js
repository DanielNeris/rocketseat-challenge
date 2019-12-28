import moment from 'moment';

import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';

import RegisteredMail from '../jobs/RegisteredMail';
import checkDate from '../../helpers/isBeforeDate';
import validations from '../../validator/enrollments';

class EnrollmentController {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;

      const enrollment = await Enrollment.findAll({
        where: { deleted_at: null },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'start_date', 'end_date', 'price'],
        limit: 10,
        offset: (page - 1) * 10,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
          },
          {
            model: Plan,
            as: 'plan',
            attributes: ['id', 'title', 'duration', 'price'],
          },
        ],
      });

      return res.json({
        enrollment,
        success: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async store(req, res) {
    try {
      const schema = await validations.validateSchema('STORE', req.body);

      if (!schema)
        return res
          .status(400)
          .json({ success: false, error: 'Validation failed' });

      const { student_id, plan_id, start_date } = req.body;

      const checkStudent = await Student.findOne({ where: { id: student_id } });

      if (!checkStudent)
        return res
          .status(400)
          .json({ success: false, error: 'Student not found.' });

      const checkPlan = await Plan.findOne({ where: { id: plan_id } });

      if (!checkPlan)
        return res
          .status(400)
          .json({ success: false, error: 'Plan not found.' });

      const dateIsBefore = checkDate(start_date);

      if (dateIsBefore)
        return res
          .status(400)
          .json({ success: false, error: 'Past dates are not permitted' });

      const end_date = moment(start_date).add(checkPlan.duration, 'M');
      const price = checkPlan.price * checkPlan.duration;

      const { id } = await Enrollment.create({
        student_id,
        plan_id,
        start_date,
        end_date,
        price,
      });

      await Queue.add(RegisteredMail.key, {
        checkStudent,
        checkPlan,
        price,
        start_date,
        end_date,
      });

      return res.json({
        student: {
          id,
          student_id,
          plan_id,
          start_date: moment(start_date),
          end_date,
          price,
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
          .json({ success: false, error: 'Validation failed' });

      const enrollment = await Enrollment.findByPk(req.params.id);

      if (!enrollment)
        return res
          .status(400)
          .json({ success: false, error: 'Enrollment not found.' });

      const { student_id, plan_id, start_date } = req.body;

      const checkStudent = await Student.findOne({ where: { id: student_id } });

      if (!checkStudent)
        return res
          .status(400)
          .json({ success: false, error: 'Student not found.' });

      const checkPlan = await Plan.findOne({ where: { id: plan_id } });

      if (!checkPlan)
        return res
          .status(400)
          .json({ success: false, error: 'Plan not found.' });

      const dateIsBefore = checkDate(start_date);

      if (dateIsBefore)
        return res
          .status(400)
          .json({ success: false, error: 'Past dates are not permitted' });

      const end_date = moment(start_date).add(checkPlan.duration, 'M');
      const price = checkPlan.price * checkPlan.duration;

      const { id } = await enrollment.update({
        student_id,
        plan_id,
        start_date,
        end_date,
        price,
      });

      return res.json({
        student: {
          id,
          student_id,
          plan_id,
          start_date: moment(start_date),
          end_date,
          price,
        },
        success: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async delete(req, res) {
    try {
      const enrollment = await Enrollment.findByPk(req.params.id);

      if (!enrollment)
        return res
          .status(400)
          .json({ success: false, error: 'Enrollment not found.' });

      enrollment.deleted_at = new Date();

      await enrollment.save();

      return res.json({ enrollment, success: true });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new EnrollmentController();
