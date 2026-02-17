import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Loader2, Trash2 } from "lucide-react";
import { type ConfirmationModalProps } from "../types/modal";

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  confirmVariant = "danger",
  isLoading = false,
  icon,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const variantStyles = {
    danger: {
      bg: "bg-red-500 hover:bg-red-600",
      shadow: "shadow-red-500/30 hover:shadow-red-600/40",
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    primary: {
      bg: "bg-primary-green hover:bg-dark-green",
      shadow: "shadow-primary-green/30 hover:shadow-dark-green/40",
      iconBg: "bg-green-50",
      iconColor: "text-primary-green",
    },
  };

  const styles = variantStyles[confirmVariant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${styles.iconBg} rounded-xl`}>
                  {icon || (
                    <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <p className="text-gray-700 text-center">{message}</p>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`px-8 py-2.5 ${styles.bg} text-white font-bold rounded-xl shadow-lg ${styles.shadow} transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {confirmVariant === "danger" && (
                      <Trash2 className="w-5 h-5" />
                    )}
                    <span>{confirmText}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
