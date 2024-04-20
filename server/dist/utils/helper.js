"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalPath = exports.getStaticFilePath = void 0;
const getStaticFilePath = (req, fileName) => {
    return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};
exports.getStaticFilePath = getStaticFilePath;
const getLocalPath = (fileName) => {
    return `public/images/${fileName}`;
};
exports.getLocalPath = getLocalPath;
