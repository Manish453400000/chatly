"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    }
    catch (err) {
        res.status(500).json({
            success: false,
            response: err instanceof Error ? err.message : 'Unexpected error occurred',
            details: { err: err }
        });
    }
};
exports.asyncHandler = asyncHandler;
