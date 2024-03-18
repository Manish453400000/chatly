import { Request, Response, NextFunction } from "express"

export const asyncHandler = (func:(req:Request, res:Response, next:NextFunction) => Promise<void>) => async (req:Request, res:Response, next:NextFunction): Promise<void> => {
  try {
    await func(req, res, next);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      response: err instanceof Error ? err.message: 'Unexpected error occurred',
    })
  }
}