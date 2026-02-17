export interface User {
  id: string;
  email: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  orderIndex: number;
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = "Something went wrong",
): string => {
  const apiError = error as ApiErrorResponse;
  return apiError.response?.data?.message || defaultMessage;
};
