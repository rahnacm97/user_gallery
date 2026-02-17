import mongoose, { Schema } from "mongoose";
import { IUser } from "interfaces/schema/IUser";

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);
