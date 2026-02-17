import { RegisterDTO, AuthResponseDTO, UserDTO } from "../../dtos/AuthDTO";

export interface IAuthService {
  register(userData: RegisterDTO): Promise<UserDTO>;
  login(email: string, password: string): Promise<AuthResponseDTO>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(otp: string, newPassword: string): Promise<void>;
  verifyOtp(
    email: string,
    otp: string,
    purpose: "signup" | "forgot-password",
  ): Promise<void>;
}
