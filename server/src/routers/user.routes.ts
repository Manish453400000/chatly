import { Router } from "express";
// import { upload } from "../middleware/multer.middleware";
import { registerUser, loginUser, logoutUser, refreshAccessToken, getUser } from "../controllers/user.controller";
import { verifyJwt } from "../middleware/auth.middleware";

const userRouter = Router();
  // public routes
userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/refresh-access-token').post(refreshAccessToken)
  // private routes
userRouter.route('/logout').post(verifyJwt, logoutUser)
userRouter.route('/get-user').post(verifyJwt, getUser)

export { userRouter };