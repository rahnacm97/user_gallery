import { IMailService } from "../interfaces/services/IMailService";
import { logger } from "../shared/utils/logger";
import { NodemailerConfig } from "../config/NodemailerConfig";
import { OTPTemplate } from "../shared/templates/OTPTemplate";

export class MailService implements IMailService {
  constructor(private _nodemailerConfig: NodemailerConfig) {}

  //send otp
  async sendOTP(email: string, otp: string): Promise<void> {
    try {
      if (!this._nodemailerConfig.emailUser) {
        logger.warn(
          "Email credentials (EMAIL_USER) not found. Skipping email sending. OTP is: " + otp,
        );
        return;
      }

      const otpTemplate = new OTPTemplate();

      const mailOptions = {
        from: this._nodemailerConfig.emailUser,
        to: email,
        subject: otpTemplate.getSubject(),
        text: otpTemplate.getText(otp),
        html: otpTemplate.getHtml(otp),
      };

      logger.info(`Attempting to send OTP email to ${email}...`);
      await this._nodemailerConfig.transporter.sendMail(mailOptions);
      logger.info(`OTP email sent successfully to ${email}`);
    } catch (error) {
      logger.error(`Failed to send OTP email to ${email}:`, error);
    }
  }
}

