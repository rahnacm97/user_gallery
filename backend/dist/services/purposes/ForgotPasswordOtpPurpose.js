export class ForgotPasswordOtpPurpose {
    async onVerified(email, otpDoc) {
        // No action needed - just validate the OTP
        // OTP will be deleted after password reset is completed
    }
    shouldDeleteOtpImmediately() {
        return false; // Keep OTP until password reset is completed
    }
}
