import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';

import AnswerMail from '../jobs/AnswerMail';
import validations from '../../validator/helpOrders';

class HelpOrderController {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;

      const helpOrders = await HelpOrder.findAll({
        where: { answer: null },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'student_id', 'question'],
        limit: 10,
        offset: (page - 1) * 10,
      });

      return res.json({
        helpOrders,
        success: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async show(req, res) {
    try {
      const { page = 1 } = req.query;
      const { student_id } = req.params;

      const checkStudent = await Student.findByPk(student_id);

      if (!checkStudent)
        return res
          .status(400)
          .json({ success: false, error: 'Student not found.' });

      const helpOrders = await HelpOrder.findAll({
        where: { student_id },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'student_id', 'question', 'answer', 'answer_at'],
        limit: 10,
        offset: (page - 1) * 10,
      });

      return res.json({
        helpOrders,
        success: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async store(req, res) {
    try {
      const { student_id } = req.params;
      const { question } = req.body;

      const schema = await validations.validateSchema('STORE', {
        student_id,
        question,
      });

      if (!schema)
        return res
          .status(400)
          .json({ success: false, error: 'Validation failed' });

      const checkStudent = await Student.findByPk(student_id);

      if (!checkStudent)
        return res
          .status(400)
          .json({ success: false, error: 'Student not found.' });

      const { id } = await HelpOrder.create({ student_id, question });

      return res.json({
        helpOrder: {
          id,
          student_id,
          question,
        },
        success: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const schema = await validations.validateSchema('UPDATE', {
        answer: req.body.answer,
      });

      if (!schema)
        return res
          .status(400)
          .json({ success: false, error: 'Validation failed' });

      const helpOrder = await HelpOrder.findOne({
        where: { id },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['name', 'email'],
          },
        ],
      });

      if (!helpOrder)
        return res
          .status(400)
          .json({ success: false, error: 'Help Order not found.' });

      const {
        question,
        answer,
        answer_at,
        student,
        student_id,
      } = await helpOrder.update({
        answer: req.body.answer,
        answer_at: new Date(),
      });

      await Queue.add(AnswerMail.key, {
        id,
        student,
        question,
        answer,
      });

      return res.json({
        helpOrder: {
          id,
          student_id,
          question,
          answer,
          answer_at,
        },
        success: true,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new HelpOrderController();
