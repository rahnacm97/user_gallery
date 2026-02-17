export interface IOtpService {
  generateOTP(): string;
  sendOTP(email: string, purpose: "signup" | "forgot-password"): Promise<void>;
  verifyOTP(email: string, otp: string, purpose: "signup" | "forgot-password"): Promise<void>;
  resendOTP(email: string, purpose: "signup" | "forgot-password"): Promise<void>;
  validateOTP(otp: string, purpose: "forgot-password"): Promise<string>;
}
