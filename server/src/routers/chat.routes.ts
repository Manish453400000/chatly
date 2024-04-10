import { Router } from 'express';
import { verifyJwt } from '../middleware/auth.middleware';
import { getAllChats } from '../controllers/chat.controller';

const chatRouter = Router();

chatRouter.use(verifyJwt);

chatRouter.route('/get-all').get(getAllChats)

export { chatRouter };