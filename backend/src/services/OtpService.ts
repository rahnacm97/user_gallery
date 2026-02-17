import { IOtpService } from "../interfaces/services/IOtpService";
import { IMailService } from "../interfaces/services/IMailService";
import { IOtpRepository } from "../interfaces/repository/IOtpRepository";
import { ApiError } from "../shared/utils/ApiError";
import { HttpStatus } from "../shared/constants/httpStatus";
import { logger } from "../shared/utils/logger";
import { ErrorMessages } from "../shared/constants/messages";

export class OtpService implements IOtpService {
  constructor(
    private _mailService: IMailService,
    private _otpRepository: IOtpRepository,
  ) {}

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  //Otp send
  async sendOTP(
    email: string,
    purpose: "signup" | "forgot-password",
  ): Promise<void> {
    const otp = this.generateOTP();
    logger.info(`Generated OTP for ${email} (${purpose}): ${otp}`);

    await this._otpRepository.upsert(email, otp, purpose);

    await this._mailService.sendOTP(email, otp);
  }
  //Otp verification
  async verifyOTP(
    email: string,
    otp: string,
    purpose: "signup" | "forgot-password",
  ): Promise<void> {
    const otpDoc = await this._otpRepository.findValid(email, otp, purpose);

    if (!otpDoc) {
      throw new ApiError(HttpStatus.BAD_REQUEST, ErrorMessages.INVALID_OTP);
    }

    if (purpose === "signup") {
      await this._otpRepository.deleteById(otpDoc._id.toString());
    }
  }
  //Resend otp
  async resendOTP(
    email: string,
    purpose: "signup" | "forgot-password",
  ): Promise<void> {
    await this.sendOTP(email, purpose);
  }
  //Otp validation
  async validateOTP(otp: string, purpose: "forgot-password"): Promise<string> {
    const otpDoc = await this._otpRepository.findValidByOtp(otp, purpose);

    if (!otpDoc) {
      throw new ApiError(HttpStatus.BAD_REQUEST, ErrorMessages.INVALID_OTP);
    }

    const email = otpDoc.email;
    await this._otpRepository.deleteById(otpDoc._id.toString());
    return email;
  }
}
