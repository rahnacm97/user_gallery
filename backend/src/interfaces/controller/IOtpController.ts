import { Request, Response } from "express";

export interface IOtpController {
  resendOTP(req: Request, res: Response): Promise<void>;
}
