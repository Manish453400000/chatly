"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const message_controller_1 = require("../controllers/message.controller");
const multer_middleware_1 = require("../middleware/multer.middleware");
const messageRouter = (0, express_1.Router)();
exports.messageRouter = messageRouter;
messageRouter.use(auth_middleware_1.verifyJwt);
messageRouter.route('/get').get(message_controller_1.getAllMessages);
messageRouter.route('/send').post(multer_middleware_1.upload.fields([{ name: "attachments", maxCount: 5 }]), message_controller_1.sendMessage);
