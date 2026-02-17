import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";
import { getErrorMessage } from "../types";
import { FRONTEND_ROUTES, API_ROUTES } from "../shared/constants/constants";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { resetPasswordSchema } from "../shared/validations/authValidation";

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const stateOtp = location.state?.otp || "";
  const [otp, setOtp] = useState(stateOtp);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    otp?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    if (name === "newPassword" || name === "confirmPassword") {
      const pass = name === "newPassword" ? value : newPassword;
      const confirm = name === "confirmPassword" ? value : confirmPassword;

      if (name === "newPassword") {
        const result = z
          .string()
          .trim()
          .min(6, "Password must be at least 6 characters")
          .regex(/^\S*$/, "Password cannot contain spaces")
          .safeParse(value);
        if (!result.success) {
          setErrors((prev) => ({
            ...prev,
            newPassword: result.error.issues[0].message,
          }));
        } else {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.newPassword;
            return next;
          });
        }
      }

      if (confirm && pass !== confirm) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords don't match",
        }));
      } else if (confirm && pass === confirm) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.confirmPassword;
          return next;
        });
      }
      return;
    }

    if (name === "otp") {
      if (value.length !== 6) {
        setErrors((prev) => ({ ...prev, otp: "OTP must be 6 digits" }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.otp;
          return next;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = resetPasswordSchema.safeParse({
      otp,
      newPassword,
      confirmPassword,
    });
    if (!validation.success) {
      const fieldErrors: {
        otp?: string;
        newPassword?: string;
        confirmPassword?: string;
      } = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof typeof fieldErrors;
        if (path) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(API_ROUTES.AUTH_RESET_PASSWORD, {
        otp,
        newPassword,
      });
      toast.success(response.data.message || "Password reset successfully!");
      setTimeout(() => {
        navigate(FRONTEND_ROUTES.LOGIN);
      }, 2000);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Invalid or expired OTP"));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: KeyRound, text: "Enter 6-digit OTP code" },
    { icon: Lock, text: "Create a strong password" },
    { icon: CheckCircle2, text: "Regain account access" },
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
            <KeyRound
              className="w-16 h-16 text-white transform rotate-6"
              strokeWidth={2}
            />
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              You're almost there! Enter the OTP code we sent to your email and
              create a new secure password.
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

        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Header Section - Mobile Only */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-green shadow-lg shadow-primary-green/30 mb-6 transform hover:scale-105 transition-transform duration-300">
              <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-base text-gray-600">
              Create your new secure password
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="hidden lg:flex items-center justify-center w-20 h-20 rounded-2xl from-primary-green/10 to-light-green/10 mx-auto mb-6">
                <Shield
                  className="w-10 h-10 text-primary-green"
                  strokeWidth={2}
                />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-gray-600">
                  Enter the 6-digit OTP and your new password
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {!stateOtp && (
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      OTP Code
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                          errors.otp ? "border-red-500" : "border-gray-200"
                        } rounded-xl text-gray-900 placeholder-gray-400 text-center text-lg tracking-widest focus:bg-white focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 outline-none transition-all duration-200`}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setOtp(val);
                          validateField("otp", val);
                        }}
                      />
                    </div>
                    {errors.otp && (
                      <p className="mt-1.5 text-xs font-medium text-red-500 text-center">
                        {errors.otp}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      Enter the 6-digit code sent to your email
                    </p>
                  </div>
                )}

                {/* New Password Field */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className={`w-full pl-11 pr-12 py-3 bg-gray-50 border ${
                        errors.newPassword
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 outline-none transition-all duration-200`}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        validateField("newPassword", e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full pl-11 pr-12 py-3 bg-gray-50 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 outline-none transition-all duration-200`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        validateField("confirmPassword", e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-3.5 px-4 bg-primary-green hover:bg-dark-green text-white font-semibold rounded-xl shadow-lg shadow-primary-green/30 hover:shadow-dark-green/40 focus:outline-none focus:ring-4 focus:ring-primary-green/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-primary-green transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
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
                      Resetting Password...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" />
                      Reset Password
                    </span>
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

          <div className="lg:hidden mt-8 space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg from-primary-green/10 to-light-green/10">
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
    </div>
  );
};

export default ResetPassword;
