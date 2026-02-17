import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Smile,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../types";
import { FRONTEND_ROUTES, API_ROUTES } from "../shared/constants/constants";
import { toast } from "react-hot-toast";
import { loginSchema } from "../shared/validations/authValidation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (name: "email" | "password", value: string) => {
    const fieldSchema = loginSchema.shape[name];
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
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
      const response = await api.post(API_ROUTES.AUTH_LOGIN, {
        email,
        password,
      });
      login(response.data.token, response.data.user);
      toast.success("Welcome back!");
      navigate(FRONTEND_ROUTES.ROOT);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
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
            <LogIn className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-base text-gray-600">
            Sign in to manage your gallery
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateField("email", e.target.value);
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                    {errors.email}
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validateField("password", e.target.value);
                    }}
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
                <div className="mt-2 text-right">
                  <Link
                    to={FRONTEND_ROUTES.FORGOT_PASSWORD}
                    className="text-sm font-semibold text-primary-green hover:text-dark-green transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
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
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to={FRONTEND_ROUTES.REGISTER}
                className="font-semibold text-primary-green hover:text-dark-green transition-colors"
              >
                Create one
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
    </div>
  );
};

export default Login;
