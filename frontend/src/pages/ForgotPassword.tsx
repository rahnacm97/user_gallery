import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Lock, Shield } from "lucide-react";
import api from "../services/api";
import { getErrorMessage } from "../types";
import { FRONTEND_ROUTES, API_ROUTES } from "../shared/constants/constants";
import { toast } from "react-hot-toast";
import OtpModal from "../components/OtpModal";
import { z } from "zod";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate();

  const validateField = (value: string) => {
    const emailSchema = z.string().email("Invalid email format");
    const result = emailSchema.safeParse(value);
    if (!result.success) {
      setErrors({ email: result.error.issues[0].message });
    } else {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const emailSchema = z.string().email("Invalid email format");
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setErrors({ email: validation.error.issues[0].message });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(API_ROUTES.AUTH_FORGOT_PASSWORD, {
        email,
      });
      toast.success(response.data.message || "OTP sent to your email!");
      setShowOtpModal(true);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to send OTP"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otpValue: string) => {
    await api.post("/auth/verify-otp", {
      email,
      otp: otpValue,
      purpose: "forgot-password",
    });
    navigate(FRONTEND_ROUTES.RESET_PASSWORD, {
      state: { email, otp: otpValue },
    });
  };

  const handleResendOtp = async () => {
    await api.post("/auth/resend-otp", {
      email,
      purpose: "forgot-password",
    });
  };

  const steps = [
    { icon: Mail, text: "Receive OTP via email" },
    { icon: Shield, text: "Secure verification process" },
    { icon: Lock, text: "Set a new password" },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "var(--bg-gradient, linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%))",
      }}
    >
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Info Section */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-primary-green shadow-2xl shadow-primary-green/40 transform -rotate-6 mb-4">
            <Lock
              className="w-16 h-16 text-white transform rotate-6"
              strokeWidth={2}
            />
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-gray-900">
              Password Recovery
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Don't worry! It happens to the best of us. We'll help you reset
              your password quickly and securely.
            </p>
          </div>

          <div className="w-full max-w-sm space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-soft-green transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg from-primary-green/10 to-light-green/10">
                    <Icon
                      className="w-5 h-5 text-primary-green"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-gray-700 font-medium">{step.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Header Section - Mobile Only */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-green shadow-lg shadow-primary-green/30 mb-6 transform hover:scale-105 transition-transform duration-300">
              <Mail className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Password Recovery
            </h1>
            <p className="text-base text-gray-600">
              We'll help you reset your password
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              {/* Desktop Icon Header */}
              <div className="hidden lg:flex items-center justify-center w-20 h-20 rounded-2xl from-primary-green/10 to-light-green/10 mx-auto mb-6">
                <Mail
                  className="w-10 h-10 text-primary-green"
                  strokeWidth={2}
                />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600">
                  Enter your email to receive a 6-digit OTP
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 outline-none transition-all duration-200`}
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateField(e.target.value);
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-primary-green hover:bg-dark-green text-white font-semibold rounded-xl shadow-lg shadow-primary-green/30 hover:shadow-dark-green/40 focus:outline-none focus:ring-4 focus:ring-primary-green/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-primary-green transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            </div>

            {/* Back to Login Link */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
              <div className="text-center">
                <Link
                  to={FRONTEND_ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-green hover:text-dark-green transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Steps - Show below form on mobile */}
          <div className="lg:hidden mt-8 space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg  from-primary-green/10 to-light-green/10">
                    <Icon
                      className="w-5 h-5 text-primary-green"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {step.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={email}
        purpose="forgot-password"
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </div>
  );
};

export default ForgotPassword;
