export enum SuccessMessages {
  LOGIN_SUCCESS = "Login successful",
  REGISTER_SUCCESS = "Registration successful",
  OTP_SENT = "OTP sent successfully",
  PASSWORD_RESET_SUCCESS = "Password reset successful",
  UPLOAD_SUCCESS = "Images uploaded successfully",
  UPDATE_SUCCESS = "Item updated successfully",
  DELETE_SUCCESS = "Item deleted successfully",
  ORDER_SAVED = "Order saved successfully",
  OTP_VERIFIED = "OTP verified successfully",
  OTP_RESENT = "OTP resent successfully",
}

export enum ErrorMessages {
  INVALID_CREDENTIALS = "Invalid email or password",
  VERIFY_EMAIL = 'Please verify your email first',
  USER_EXISTS = "User already exists",
  USER_NOT_FOUND = "User not found",
  AUTH_FAILED = "Authentication failed",
  UNAUTHORIZED = "Unauthorized access",
  INVALID_OTP = "Invalid or expired OTP",
  UPLOAD_FAILED = "Upload failed",
  FETCH_FAILED = "Failed to fetch items",
  UPDATE_FAILED = "Update failed",
  DELETE_FAILED = "Delete failed",
  ITEM_NOT_FOUND = "Item not found",
  INTERNAL_SERVER_ERROR = "Internal server error",
  NO_FILES = "No files uploaded",
}
