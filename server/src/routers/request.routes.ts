import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware";
import { searchUsers } from "../controllers/request.controller";

const requestRouter = Router();

requestRouter.route('/search').get(verifyJwt ,searchUsers);

export { requestRouter }