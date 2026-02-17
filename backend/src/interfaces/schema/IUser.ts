import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  phone: string;
  password: string;
  isVerified: boolean;
  resetPasswordOTP?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
}
