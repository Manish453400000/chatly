"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const connectDB_1 = require("./db/connectDB");
dotenv_1.default.config({
    path: "./.env",
});
const nodeVersion = +process.version?.slice(1).split(".")[0] || 0;
const startServer = async () => {
    app_1.server.listen(process.env.PORT || 8080, () => {
        console.info(`✅ server is running at: http://localhost:${process.env.PORT}`);
        console.log('😁 you are good to go now');
    });
};
(async () => {
    if (nodeVersion >= 14) {
        try {
            await (0, connectDB_1.connectDB)();
            startServer();
        }
        catch (err) {
            console.log("mongoDB connection error: ", err);
        }
    }
    else {
        (0, connectDB_1.connectDB)()
            .then(() => {
            startServer();
        })
            .catch((err) => {
            console.log("mongoDB connection error: ", err);
        });
    }
})();
