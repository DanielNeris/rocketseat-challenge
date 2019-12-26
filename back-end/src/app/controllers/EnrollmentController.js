import moment from 'moment';

import Enrollment from '../models/Enrollment';
import Student from '../models/student';
import Plan from '../models/Plan';

import validations from '../../validations/enrollment';

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
      const schema = await validations.validateSchema('store', req.body);

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

      const end_date = moment(start_date).add(checkPlan.duration, 'M');
      const price = checkPlan.price * checkPlan.duration;

      const { id } = await Enrollment.create({
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

  async update(req, res) {
    try {
      const schema = await validations.validateSchema('update', req.body);

      if (!schema)
        return res
          .status(400)
          .json({ success: false, error: 'Validation failed.' });

      const plan = await Plan.findByPk(req.params.id);

      if (!plan)
        return res
          .status(400)
          .json({ success: false, error: 'Plan not found.' });

      if (req.body.title !== plan.title) {
        const planExists = await Plan.findOne({
          where: { title: req.body.title },
        });

        if (planExists)
          return res
            .status(400)
            .json({ success: false, error: 'Plan already exists.' });
      }

      const { id, title, duration, price } = await plan.update(req.body);

      return res.json({
        plan: {
          id,
          title,
          duration,
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
      const plan = await Plan.findByPk(req.params.id);

      if (!plan)
        return res
          .status(400)
          .json({ success: false, error: 'Plan not found.' });

      plan.deleted_at = new Date();

      await plan.save();

      return res.json({ plan, success: true });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new EnrollmentController();
