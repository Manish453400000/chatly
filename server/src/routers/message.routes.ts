import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware";
import { getAllMessages, sendMessage } from "../controllers/message.controller";
import { upload } from "../middleware/multer.middleware";

const messageRouter = Router();

messageRouter.use(verifyJwt);

messageRouter.route('/get').get(getAllMessages)
messageRouter.route('/send').post(
  upload.fields([{name: "attachments", maxCount: 5}]),
  sendMessage,
)

export { messageRouter }