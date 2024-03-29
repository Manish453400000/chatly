import { Request, Response, NextFunction} from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/apiError'
import { User } from '../models/user.model'
import jwt from 'jsonwebtoken'

const accessTokenSecret:string = process.env.ACCESS_TOKEN_SECRET || 'lljfjlsaja';

export const verifyJwt = asyncHandler(
  async (req:Request, _res:Response, next:NextFunction) => {
    try {
      const token:string = req.cookies?.accessToken || 
      req.body.headers.Authorization?.replace("Bearer", "");
      if(!token) {
        throw new ApiError(401, "Unauthorized request")
      }
      const decodedToken:any = jwt.verify(token, accessTokenSecret)
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
      if(!user) {
        throw new ApiError(401, "Invalid access token");
      }
      req.body.user = user;
      next();

    } catch (error:any) {
      throw new ApiError(401, error?.message || "JWT verification failed")
    }
  }
)
