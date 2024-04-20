"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'lljfjlsaja';
exports.verifyJwt = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    try {
        const token = req.cookies?.accessToken ||
            req.body.headers?.Authorization?.replace("Bearer", "");
        if (!token) {
            throw new apiError_1.ApiError(401, "Unauthorized request", [token]);
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, accessTokenSecret);
        const user = await user_model_1.User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new apiError_1.ApiError(401, "Invalid access token");
        }
        req.body.user = user;
        next();
    }
    catch (error) {
        throw new apiError_1.ApiError(401, error?.message || "JWT verification failed");
    }
});
