import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware";
import { acceptRequest, rejectRequest, searchUsers, sentRequest } from "../controllers/request.controller";

const requestRouter = Router();

requestRouter.use(verifyJwt)

requestRouter.route('/search').get(searchUsers);
requestRouter.route('/sent').post(sentRequest)
requestRouter.route('/accept').post(acceptRequest)
requestRouter.route('/reject').post(rejectRequest)

export { requestRouter }