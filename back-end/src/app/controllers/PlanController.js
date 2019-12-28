import Plan from '../models/Plan';

import validations from '../../validator/plans';

class PlanController {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;

      const plans = await Plan.findAll({
        where: { deleted_at: null },
        order: [['created_at', 'DESC']],
        attributes: ['id', 'title', 'duration', 'price'],
        limit: 10,
        offset: (page - 1) * 10,
      });

      return res.json({
        plans,
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

      const planExists = await Plan.findOne({
        where: { title: req.body.title },
      });

      if (planExists)
        return res
          .status(400)
          .json({ success: false, error: 'Plan already exists.' });

      const { id, title, duration, price } = await Plan.create(req.body);

      return res.json({
        student: {
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

  async update(req, res) {
    try {
      const schema = await validations.validateSchema('UPDATE', req.body);

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

export default new PlanController();
