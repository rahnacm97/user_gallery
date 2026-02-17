import type { IGalleryItem } from "./gallery";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: "danger" | "primary";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  orderIndex: number;
}

export interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GalleryItem | null;
  onSave: (title: string, file: File | null) => void | Promise<void>;
  isUpdating?: boolean;
}

export interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  purpose: "signup" | "forgot-password";
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}

export interface Props {
  item: IGalleryItem;
  onEdit: (item: IGalleryItem) => void;
  onDelete: (id: string) => void;
}

export interface UploadFile {
  file: File;
  title: string;
  preview: string;
}

export interface UploadPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: UploadFile[];
  onUpload: () => void | Promise<void>;
  onRemoveFile: (index: number) => void;
  onTitleChange: (index: number, newTitle: string) => void;
  isUploading?: boolean;
}
