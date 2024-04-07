import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware";
import { acceptRequest, getAllFriends, getAllRequest, rejectRequest, searchUsers, sentRequest } from "../controllers/request.controller";

const requestRouter = Router();

requestRouter.use(verifyJwt)

requestRouter.route('/search').get(searchUsers);
requestRouter.route('/request/sent').post(sentRequest)
requestRouter.route('/request/get-requests').get(getAllRequest)
requestRouter.route('/request/accept').get(acceptRequest)
requestRouter.route('/request/reject').get(rejectRequest)
requestRouter.route('/get-friends').get(getAllFriends)



export { requestRouter }