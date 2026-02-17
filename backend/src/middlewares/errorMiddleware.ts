import { Request, Response } from "express";
import { ApiError } from "../shared/utils/ApiError";
import { HttpStatus } from "../shared/constants/httpStatus";
import { ErrorMessages } from "../shared/constants/messages";
import { logger } from "../shared/utils/logger";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = ErrorMessages.INTERNAL_SERVER_ERROR as string;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  logger.error(`[Error] ${statusCode} - ${message}`);

  const response = {
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
