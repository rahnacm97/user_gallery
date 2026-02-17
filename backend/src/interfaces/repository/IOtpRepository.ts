import { IOtp } from "../schema/IOtp";

export interface IOtpRepository {
  upsert(
    email: string,
    otp: string,
    purpose: "signup" | "forgot-password",
  ): Promise<IOtp>;
  findValid(
    email: string,
    otp: string,
    purpose: "signup" | "forgot-password",
  ): Promise<IOtp | null>;
  findValidByOtp(otp: string, purpose: "forgot-password"): Promise<IOtp | null>;
  deleteById(id: string): Promise<boolean>;
}
