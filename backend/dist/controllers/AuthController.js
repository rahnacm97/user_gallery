import { HttpStatus } from "../shared/constants/httpStatus";
import { SuccessMessages } from "../shared/constants/messages";
export class AuthController {
    _authService;
    constructor(_authService) {
        this._authService = _authService;
    }
    // User registration
    register = async (req, res) => {
        const user = await this._authService.register(req.body);
        res.status(HttpStatus.CREATED).json({
            message: SuccessMessages.REGISTER_SUCCESS,
            user: user,
        });
    };
    // user login
    login = async (req, res) => {
        const { email, password } = req.body;
        const authResponse = await this._authService.login(email, password);
        res.status(HttpStatus.OK).json({
            message: SuccessMessages.LOGIN_SUCCESS,
            token: authResponse.token,
            user: authResponse.user,
        });
    };
    // forgot password
    forgotPassword = async (req, res) => {
        const { email } = req.body;
        await this._authService.forgotPassword(email);
        res.status(HttpStatus.OK).json({ message: SuccessMessages.OTP_SENT });
    };
    // reset password
    resetPassword = async (req, res) => {
        const { otp, newPassword } = req.body;
        await this._authService.resetPassword(otp, newPassword);
        res
            .status(HttpStatus.OK)
            .json({ message: SuccessMessages.PASSWORD_RESET_SUCCESS });
    };
    // verify otp
    verifyOtp = async (req, res) => {
        const { email, otp, purpose } = req.body;
        await this._authService.verifyOtp(email, otp, purpose);
        res.status(HttpStatus.OK).json({ message: SuccessMessages.OTP_VERIFIED });
    };
}
