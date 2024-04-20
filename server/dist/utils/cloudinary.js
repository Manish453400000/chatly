"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const cloudinaryUpload = async (localFilePath) => {
    try {
        if (!localFilePath)
            return null;
        const response = await cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        return response;
        fs_1.default.unlinkSync(localFilePath); // remove temporary files 
    }
    catch (error) {
        fs_1.default.unlinkSync(localFilePath); // remove temporary files 
    }
};
exports.cloudinaryUpload = cloudinaryUpload;
