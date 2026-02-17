import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import type { EditItemModalProps } from "../types/modal";

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
  isUpdating = false,
}) => {
  const [title, setTitle] = useState(item?.title || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(item?.imageUrl || "");

  useEffect(() => {
    return () => {
      if (preview && preview !== item?.imageUrl) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, item]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (preview && preview !== item?.imageUrl) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSave = async () => {
    await onSave(title, file);
  };

  const handleClose = () => {
    if (preview && preview !== item?.imageUrl) {
      URL.revokeObjectURL(preview);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Photo</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your photo details or replace the image
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-bold gap-2">
                    <Upload className="w-5 h-5" />
                    <span>Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter photo title..."
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-green/10 focus:border-primary-green outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating || !title.trim()}
                className="px-8 py-2.5 bg-primary-green hover:bg-dark-green text-white font-bold rounded-xl shadow-lg shadow-primary-green/30 hover:shadow-dark-green/40 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    <span>Save Changes</span>
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
