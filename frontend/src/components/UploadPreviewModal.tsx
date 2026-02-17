import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Upload } from "lucide-react";
import { type UploadPreviewModalProps } from "../types/modal";

export const UploadPreviewModal: React.FC<UploadPreviewModalProps> = ({
  isOpen,
  onClose,
  files,
  onUpload,
  onRemoveFile,
  onTitleChange,
  isUploading = false,
}) => {
  const handleUpload = async () => {
    await onUpload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Upload Previews
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Set titles for your {files.length} photos before uploading
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body - Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {files.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:shadow-lg hover:border-soft-green"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm">
                      <img
                        src={item.preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => onRemoveFile(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                        Photo Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => onTitleChange(index, e.target.value)}
                        placeholder="Enter image title..."
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-green/10 focus:border-primary-green outline-none transition-all font-medium text-gray-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={onClose}
                className="px-6 py-2.5 font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-8 py-2.5 bg-primary-green hover:bg-dark-green text-white font-bold rounded-xl shadow-lg shadow-primary-green/30 hover:shadow-dark-green/40 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload</span>
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
