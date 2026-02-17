import { Request, Response } from "express";
import { IOtpController } from "../interfaces/controller/IOtpController";
import { IOtpService } from "../interfaces/services/IOtpService";
import { HttpStatus } from "../shared/constants/httpStatus";
import { SuccessMessages } from "shared/constants/messages";

export class OtpController implements IOtpController {
  constructor(private _otpService: IOtpService) {}

  //resend otp
  resendOTP = async (req: Request, res: Response): Promise<void> => {
    const { email, purpose } = req.body;
    await this._otpService.resendOTP(email, purpose);
    res.status(HttpStatus.OK).json({ message: SuccessMessages.OTP_RESENT });
  };
}
