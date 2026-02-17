import React, { useState, useEffect, useRef } from "react";
import { X, RefreshCw, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "../types";
import type { OtpModalProps } from "../types/modal";

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  email,
  purpose,
  onVerify,
  onResend,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: number | undefined;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, timer]);

  useEffect(() => {
    if (isOpen) {
      setOtp(new Array(6).fill(""));
      setTimer(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      await onVerify(otpValue);
      toast.success("Verification successful!");
      onClose();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Verification failed"));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendClick = async () => {
    setIsResending(true);
    try {
      await onResend();
      setTimer(60);
      toast.success("OTP resent successfully!");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to resend OTP"));
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>

          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-green-50 mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary-green" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {purpose === "signup" ? "Verify OTP" : "Reset Password OTP"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              We've sent a 6-digit code to{" "}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>

          <div className="flex justify-between gap-2 mb-8">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-100 rounded-xl focus:border-primary-green focus:outline-none transition-all bg-gray-50 focus:bg-white"
              />
            ))}
          </div>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-2">
              Didn't receive the code?
            </p>
            {timer > 0 ? (
              <p className="text-sm font-semibold text-primary-green">
                Resend code in {formatTime(timer)}
              </p>
            ) : (
              <button
                onClick={handleResendClick}
                disabled={isResending}
                className="flex items-center justify-center gap-2 mx-auto text-sm font-bold text-primary-green hover:text-dark-green transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`}
                />
                Resend OTP
              </button>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={isVerifying || otp.join("").length < 6}
            className="w-full py-4 bg-primary-green text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-dark-green transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isVerifying ? "Verifying..." : "Verify & Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
