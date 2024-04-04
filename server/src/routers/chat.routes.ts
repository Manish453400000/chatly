import { Router } from 'express';
import { verifyJwt } from '../middleware/auth.middleware';

const chatRouter = Router();

chatRouter.use(verifyJwt);

chatRouter.route('/').get()

export { chatRouter };