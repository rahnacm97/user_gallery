import { HttpStatus } from "../shared/constants/httpStatus";
import { SuccessMessages } from "shared/constants/messages";
export class OtpController {
    _otpService;
    constructor(_otpService) {
        this._otpService = _otpService;
    }
    //resend otp
    resendOTP = async (req, res) => {
        const { email, purpose } = req.body;
        await this._otpService.resendOTP(email, purpose);
        res.status(HttpStatus.OK).json({ message: SuccessMessages.OTP_RESENT });
    };
}
