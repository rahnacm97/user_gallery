import bcrypt from "bcryptjs";
import { IPasswordService } from "../interfaces/services/IPasswordService";

export class PasswordService implements IPasswordService {
  //hash password
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  //Compare password
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
