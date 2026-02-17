import { IUser } from "../../interfaces/schema/IUser";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByOTP(otp: string): Promise<IUser | null>;
}
