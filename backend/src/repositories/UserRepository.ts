import mongoose from "mongoose";
import { IUser } from "interfaces/schema/IUser";
import { IUserRepository } from "../interfaces/repository/IUserRepository";
import User from "../models/User";

export class UserRepository implements IUserRepository {
  async create(item: Partial<IUser>): Promise<IUser> {
    const user = new User(item);
    return await user.save();
  }

  async update(id: string, item: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, item, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }

  async find(item: Partial<IUser>): Promise<IUser[]> {
    return await User.find(item as mongoose.QueryFilter<IUser>).sort({
      createdAt: -1,
    });
  }

  async findOne(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByOTP(otp: string): Promise<IUser | null> {
    return await User.findOne({
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: new Date() },
    });
  }
}
