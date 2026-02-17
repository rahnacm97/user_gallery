import { IUserRepository } from "../interfaces/repository/IUserRepository";
import { IUser } from "interfaces/schema/IUser";
import { ApiError } from "../shared/utils/ApiError";
import { HttpStatus } from "../shared/constants/httpStatus";
import { ErrorMessages } from "../shared/constants/messages";
import { IAuthService } from "../interfaces/services/IAuthService";
import { IUserMapper } from "../interfaces/mappers/IUserMapper";
import { RegisterDTO, AuthResponseDTO, UserDTO } from "../dtos/AuthDTO";
import { IOtpService } from "../interfaces/services/IOtpService";
import { ITokenService } from "../interfaces/services/ITokenService";
import { IPasswordService } from "../interfaces/services/IPasswordService";

export class AuthService implements IAuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _otpService: IOtpService,
    private _userMapper: IUserMapper,
    private _tokenService: ITokenService,
    private _passwordService: IPasswordService,
  ) {}

  // User registration
  async register(userData: RegisterDTO): Promise<UserDTO> {
    const existingUser = await this._userRepository.findByEmail(userData.email);
    if (existingUser) {
      if (existingUser.isVerified) {
        throw new ApiError(HttpStatus.BAD_REQUEST, ErrorMessages.USER_EXISTS);
      }
    }

    const hashedPassword = await this._passwordService.hash(userData.password);
    let user;
    if (existingUser) {
      user = await this._userRepository.update(existingUser._id.toString(), {
        phone: userData.phone,
        password: hashedPassword,
      });
    } else {
      user = await this._userRepository.create({
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        isVerified: false,
      } as IUser);
    }

    await this._otpService.sendOTP(userData.email, "signup");

    return this._userMapper.toDTO(user!);
  }

  //Login
  async login(email: string, password: string): Promise<AuthResponseDTO> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        ErrorMessages.INVALID_CREDENTIALS,
      );
    }

    if (!user.isVerified) {
      throw new ApiError(HttpStatus.FORBIDDEN, ErrorMessages.VERIFY_EMAIL);
    }

    const isMatch = await this._passwordService.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        ErrorMessages.INVALID_CREDENTIALS,
      );
    }

    const token = this._tokenService.generateToken({ userId: user._id });

    return {
      token,
      user: this._userMapper.toDTO(user),
    };
  }

  //Forgot password
  async forgotPassword(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }

    await this._otpService.sendOTP(email, "forgot-password");
  }

  //Reset password
  async resetPassword(otp: string, newPassword: string): Promise<void> {
    const email = await this._otpService.validateOTP(otp, "forgot-password");

    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }

    const hashedPassword = await this._passwordService.hash(newPassword);
    await this._userRepository.update(user._id.toString(), {
      password: hashedPassword,
    });
  }

  //Verify OTP
  async verifyOtp(
    email: string,
    otp: string,
    purpose: "signup" | "forgot-password",
  ): Promise<void> {
    await this._otpService.verifyOTP(email, otp, purpose);

    if (purpose === "signup") {
      const user = await this._userRepository.findByEmail(email);
      if (!user) {
        throw new ApiError(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
      }

      await this._userRepository.update(user._id.toString(), {
        isVerified: true,
      });
    }
  }
}
