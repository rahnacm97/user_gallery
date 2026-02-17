export class RegisterDTO {
    email;
    phone;
    password;
    confirmPassword;
}
export class LoginDTO {
    email;
    password;
}
export class UserDTO {
    id;
    email;
    phone;
    createdAt;
}
export class AuthResponseDTO {
    token;
    user;
}
export class VerifyOtpDTO {
    email;
    otp;
    purpose;
}
