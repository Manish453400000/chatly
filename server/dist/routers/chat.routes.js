"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const chat_controller_1 = require("../controllers/chat.controller");
const multer_middleware_1 = require("../middleware/multer.middleware");
const chatRouter = (0, express_1.Router)();
exports.chatRouter = chatRouter;
chatRouter.use(auth_middleware_1.verifyJwt);
chatRouter.route('/get-all').get(chat_controller_1.getAllChats);
chatRouter.route('/group/get-all').get(chat_controller_1.getAllGroupChats);
chatRouter.route('/group/create').post(chat_controller_1.createGroupChat);
chatRouter.route('/group/edit/avatar').post(multer_middleware_1.upload.single('avatar'), chat_controller_1.editGroupAvatar);
