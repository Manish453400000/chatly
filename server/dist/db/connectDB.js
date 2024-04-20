"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.dbInstance = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../utils/constants");
exports.dbInstance = '';
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose_1.default.connect(`${process.env.MONGO_URI}/${constants_1.DB_NAME}`);
        exports.dbInstance = connectionInstance.connection.host;
        console.log(`\n☘️ MongoDB connected! Db host: ${exports.dbInstance} \n`);
    }
    catch (error) {
        console.log("MongoDB connection");
        process.exit(1);
    }
};
exports.connectDB = connectDB;
