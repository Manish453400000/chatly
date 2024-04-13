import { Router } from 'express';
import { verifyJwt } from '../middleware/auth.middleware';
import { createGroupChat, editGroupAvatar, getAllChats, getAllGroupChats } from '../controllers/chat.controller';
import { upload } from '../middleware/multer.middleware';

const chatRouter = Router();

chatRouter.use(verifyJwt);

chatRouter.route('/get-all').get(getAllChats)
chatRouter.route('/group/get-all').get(getAllGroupChats)
chatRouter.route('/group/create').post(createGroupChat)
chatRouter.route('/group/edit/avatar').post(upload.single('avatar'),editGroupAvatar)


export { chatRouter };