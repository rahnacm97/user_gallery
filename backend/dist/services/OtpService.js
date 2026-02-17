import { ApiError } from "../shared/utils/ApiError";
import { HttpStatus } from "../shared/constants/httpStatus";
import { logger } from "../shared/utils/logger";
import { ErrorMessages } from "shared/constants/messages";
export class OtpService {
    _mailService;
    _otpRepository;
    constructor(_mailService, _otpRepository) {
        this._mailService = _mailService;
        this._otpRepository = _otpRepository;
    }
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    //Otp send
    async sendOTP(email, purpose) {
        const otp = this.generateOTP();
        logger.info(`Generated OTP for ${email} (${purpose}): ${otp}`);
        await this._otpRepository.upsert(email, otp, purpose);
        await this._mailService.sendOTP(email, otp);
    }
    //Otp verification
    async verifyOTP(email, otp, purpose) {
        const otpDoc = await this._otpRepository.findValid(email, otp, purpose);
        if (!otpDoc) {
            throw new ApiError(HttpStatus.BAD_REQUEST, ErrorMessages.INVALID_OTP);
        }
        if (purpose === "signup") {
            await this._otpRepository.deleteById(otpDoc._id.toString());
        }
    }
    //Resend otp
    async resendOTP(email, purpose) {
        await this.sendOTP(email, purpose);
    }
    //Otp validation
    async validateOTP(otp, purpose) {
        const otpDoc = await this._otpRepository.findValidByOtp(otp, purpose);
        if (!otpDoc) {
            throw new ApiError(HttpStatus.BAD_REQUEST, ErrorMessages.INVALID_OTP);
        }
        const email = otpDoc.email;
        await this._otpRepository.deleteById(otpDoc._id.toString());
        return email;
    }
}
