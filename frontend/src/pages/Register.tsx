import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Zap,
  Smile,
} from "lucide-react";
import api from "../services/api";
import { getErrorMessage } from "../types";
import { FRONTEND_ROUTES, API_ROUTES } from "../shared/constants/constants";
import { toast } from "react-hot-toast";
import { registerSchema } from "../shared/validations/authValidation";
import OtpModal from "../components/OtpModal";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate();

  const validateField = (name: keyof typeof formData, value: string) => {
    const fieldSchema =
      registerSchema.shape[name as keyof typeof registerSchema.shape];
    if (fieldSchema) {
      const result = fieldSchema.safeParse(value);
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          [name]: result.error.issues[0].message,
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }

    if (name === "password" || name === "confirmPassword") {
      const pass = name === "password" ? value : formData.password;
      const confirm =
        name === "confirmPassword" ? value : formData.confirmPassword;
      if (confirm && pass !== confirm) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords don't match",
        }));
      } else if (confirm && pass === confirm) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    }
  };

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: typeof errors = {};
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
      await api.post(API_ROUTES.AUTH_REGISTER, formData);
      setShowOtpModal(true);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otpValue: string) => {
    await api.post("/auth/verify-otp", {
      email: formData.email,
      otp: otpValue,
      purpose: "signup",
    });
    navigate(FRONTEND_ROUTES.LOGIN);
  };

  const handleResendOtp = async () => {
    await api.post("/auth/resend-otp", {
      email: formData.email,
      purpose: "signup",
    });
  };

  const features = [
    { icon: Shield, label: "Secure", color: "text-light-green" },
    { icon: Zap, label: "Fast", color: "text-light-green" },
    { icon: Smile, label: "Easy", color: "text-light-green" },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "var(--bg-gradient, linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%))",
      }}
    >
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-green shadow-lg shadow-primary-green/30 mb-6 transform hover:scale-105 transition-transform duration-300">
            <UserPlus className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-base text-gray-600">
            Start your journey with us today
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    id="phone"
                    type="tel"
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                      errors.phone ? "border-red-500" : "border-gray-200"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 outline-none transition-all duration-200`}
                    placeholder="1234567890"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-11 pr-12 py-3 bg-gray-50 border ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 outline-none transition-all duration-200`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <div className="w-5 h-5">
                        <EyeOff className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5">
                        <Eye className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                    {errors.password}
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
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <div className="w-5 h-5">
                        <EyeOff className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5">
                        <Eye className="w-5 h-5" />
                      </div>
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
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Create Account
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Sign In Link */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to={FRONTEND_ROUTES.LOGIN}
                className="font-semibold text-primary-green hover:text-dark-green transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.label}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md hover:border-soft-green transition-all duration-200"
              >
                <Icon className={`w-6 h-6 ${feature.color}`} strokeWidth={2} />
                <span className="text-xs font-semibold text-gray-700">
                  {feature.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={formData.email}
        purpose="signup"
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </div>
  );
};

export default Register;
