import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/auth', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);

export default routes;
