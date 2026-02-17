import { Request, Response } from "express";
import { HttpStatus } from "../shared/constants/httpStatus";
import { SuccessMessages } from "../shared/constants/messages";
import { IAuthController } from "../interfaces/controller/IAuthController";
import { IAuthService } from "../interfaces/services/IAuthService";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}

  // User registration
  register = async (req: Request, res: Response): Promise<void> => {
    const user = await this._authService.register(req.body);
    res.status(HttpStatus.CREATED).json({
      message: SuccessMessages.REGISTER_SUCCESS,
      user: user,
    });
  };

  // user login
  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const authResponse = await this._authService.login(email, password);
    res.status(HttpStatus.OK).json({
      message: SuccessMessages.LOGIN_SUCCESS,
      token: authResponse.token,
      user: authResponse.user,
    });
  };

  // forgot password
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this._authService.forgotPassword(email);
    res.status(HttpStatus.OK).json({ message: SuccessMessages.OTP_SENT });
  };

  // reset password
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { otp, newPassword } = req.body;
    await this._authService.resetPassword(otp, newPassword);
    res
      .status(HttpStatus.OK)
      .json({ message: SuccessMessages.PASSWORD_RESET_SUCCESS });
  };

  // verify otp
  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { email, otp, purpose } = req.body;
    await this._authService.verifyOtp(email, otp, purpose);
    res.status(HttpStatus.OK).json({ message: SuccessMessages.OTP_VERIFIED });
  };
}
