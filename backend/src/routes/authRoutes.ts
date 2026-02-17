import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { OtpController } from "../controllers/OtpController";
import { OtpService } from "../services/OtpService";
import { UserRepository } from "../repositories/UserRepository";
import { OtpRepository } from "../repositories/OtpRepository";
import { validate } from "../middlewares/validationMiddleware";
import {
  registerSchema,
  loginSchema,
} from "../shared/validations/authValidation";
import { MailService } from "../services/MailService";
import { UserMapper } from "../mappers/UserMapper";

const router = Router();
//Dependencies
import { NodemailerConfig } from "../config/NodemailerConfig";

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const nodemailerConfig = new NodemailerConfig();
const mailService = new MailService(nodemailerConfig);
const userMapper = new UserMapper();


const otpService = new OtpService(mailService, otpRepository);
const otpController = new OtpController(otpService);

import { TokenService } from "../services/TokenService";
import { PasswordService } from "../services/PasswordService";

const tokenService = new TokenService();
const passwordService = new PasswordService();

const authService = new AuthService(
  userRepository,
  otpService,
  userMapper,
  tokenService,
  passwordService,
);
//Controller
const authController = new AuthController(authService);

//Routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", otpController.resendOTP);

export default router;
