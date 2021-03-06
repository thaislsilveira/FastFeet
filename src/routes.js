import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import RecipientController from './app/controllers/RecipientController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import ScheduleController from './app/controllers/ScheduleController';
import DeliveyProblemController from './app/controllers/DeliveryProblemController';
import ProblemController from './app/controllers/ProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/recipients/:id', RecipientController.findOne);

routes.get('/deliverymen/:id', DeliverymanController.findOne);

routes.get('/orders/:id', OrderController.findOne);

routes.put('/schedule/:deliverymanId/:id', ScheduleController.update);
routes.get('/schedule/:id', ScheduleController.index);
routes.get('/schedule/:id/deliveries', DeliveryController.index);

routes.post('/deliveryproblems', DeliveyProblemController.store);

routes.post('/deliveryproblems/:id/problems', ProblemController.store);
routes.get('/deliveryproblems/:id/problems', ProblemController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.post('/deliverymen', DeliverymanController.store);
routes.get('/deliverymen', DeliverymanController.index);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.get('/orders/:id', OrderController.findOne);
routes.get('/orders', OrderController.index);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/deliveryproblems', DeliveyProblemController.store);
routes.get('/deliveryproblems', DeliveyProblemController.index);
routes.get('/deliveryproblems/:id', DeliveyProblemController.findOne);
routes.delete('/deliveryproblems/:id', DeliveyProblemController.delete);

export default routes;
