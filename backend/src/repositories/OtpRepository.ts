import { IOtpRepository } from "../interfaces/repository/IOtpRepository";
import { IOtp } from "../interfaces/schema/IOtp";
import OtpModel from "../models/Otp";

export class OtpRepository implements IOtpRepository {
  async upsert(
    email: string,
    otp: string,
    purpose: "signup" | "forgot-password",
  ): Promise<IOtp> {
    const result = await OtpModel.findOneAndUpdate(
      { email, purpose },
      { otp, createdAt: new Date() },
      { upsert: true, returnDocument: "after" },
    );
    return result as IOtp;
  }

  async findValid(
    email: string,
    otp: string,
    purpose: "signup" | "forgot-password",
  ): Promise<IOtp | null> {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    return await OtpModel.findOne({
      email,
      otp,
      purpose,
      createdAt: { $gt: oneMinuteAgo },
    });
  }

  async findValidByOtp(
    otp: string,
    purpose: "forgot-password",
  ): Promise<IOtp | null> {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    return await OtpModel.findOne({
      otp,
      purpose,
      createdAt: { $gt: oneMinuteAgo },
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await OtpModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
