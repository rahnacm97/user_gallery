import { IMailTemplate } from "../../interfaces/services/IMailTemplate";

export class OTPTemplate implements IMailTemplate<string> {
  getSubject(): string {
    return "Your OTP Verification Code";
  }

  getText(otp: string): string {
    return `Your OTP code for user gallery is: ${otp}. It will expire in 1 minute.`;
  }

  getHtml(otp: string): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #22c55e;">OTP Verification</h2>
        <p>Your verification code for user gallery is:</p>
        <h1 style="letter-spacing: 5px; color: #166534;">${otp}</h1>
        <p>This code will expire in <b>1 minute</b>.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
  }
}
