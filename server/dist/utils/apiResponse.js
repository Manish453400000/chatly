"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    statusCode;
    data;
    message;
    success;
    constructor(statusCode, data, message, success) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success || statusCode < 400;
    }
}
exports.ApiResponse = ApiResponse;
