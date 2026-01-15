import type { ApiError } from '../../types/api.types';

export function handleApiError(error: any): ApiError {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      errors: error.response.data?.errors,
    };
  } else if (error.request) {
    return {
      message: 'No response from server',
      status: 0,
    };
  }
  return {
    message: error.message || 'An unexpected error occurred',
    status: 0,
  };
}
