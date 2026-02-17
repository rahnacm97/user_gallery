export class RegisterDTO {
  email!: string;
  phone!: string;
  password!: string;
  confirmPassword!: string;
}

export class LoginDTO {
  email!: string;
  password!: string;
}

export class UserDTO {
  id!: string;
  email!: string;
  phone!: string;
  createdAt!: Date;
}

export class AuthResponseDTO {
  token!: string;
  user!: UserDTO;
}

export class VerifyOtpDTO {
  email!: string;
  otp!: string;
  purpose!: "signup" | "forgot-password";
}
