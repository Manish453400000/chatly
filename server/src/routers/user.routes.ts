import { Router } from "express";
// import { upload } from "../middleware/multer.middleware";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller";
import { verifyJwt } from "../middleware/auth.middleware";

const userRouter = Router();
  // public routes
userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)

  // private routes
userRouter.route('/logout').post(verifyJwt, logoutUser)

export { userRouter };