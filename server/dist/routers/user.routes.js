"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const multer_middleware_1 = require("../middleware/multer.middleware");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
// public routes
userRouter.route('/register').post(user_controller_1.registerUser);
userRouter.route('/login').post(user_controller_1.loginUser);
userRouter.route('/refresh-access-token').post(user_controller_1.refreshAccessToken);
// private routes
userRouter.route('/logout').post(auth_middleware_1.verifyJwt, user_controller_1.logoutUser);
userRouter.route('/edit/avatar').post(multer_middleware_1.upload.single('avatar'), auth_middleware_1.verifyJwt, user_controller_1.uploadAvatar);
userRouter.route('/get-user').post(auth_middleware_1.verifyJwt, user_controller_1.getUser);
