import { Router } from "express";
import { upload } from "../middleware/multer.middleware";
import { registerUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.route('/sign-up').post(upload.single("avatar"), registerUser)
userRouter.post('/sign-in')

export { userRouter };