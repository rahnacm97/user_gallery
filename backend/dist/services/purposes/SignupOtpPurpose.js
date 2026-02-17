export class SignupOtpPurpose {
    _userRepository;
    _otpRepository;
    constructor(_userRepository, _otpRepository) {
        this._userRepository = _userRepository;
        this._otpRepository = _otpRepository;
    }
    async onVerified(email, otpDoc) {
        const user = await this._userRepository.findByEmail(email);
        if (user) {
            await this._userRepository.update(user._id.toString(), {
                isVerified: true,
            });
        }
    }
    shouldDeleteOtpImmediately() {
        return true; // Delete OTP immediately after signup verification
    }
}
