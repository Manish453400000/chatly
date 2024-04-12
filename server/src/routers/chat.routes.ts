import { Router } from 'express';
import { verifyJwt } from '../middleware/auth.middleware';
import { createGroupChat, getAllChats, getAllGroupChats } from '../controllers/chat.controller';

const chatRouter = Router();

chatRouter.use(verifyJwt);

chatRouter.route('/get-all').get(getAllChats)
chatRouter.route('/group/get-all').get(getAllGroupChats)
chatRouter.route('/group/create').post(createGroupChat)


export { chatRouter };