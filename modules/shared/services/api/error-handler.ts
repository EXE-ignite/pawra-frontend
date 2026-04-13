import type { ApiError } from '../../types/api.types';

export function handleApiError(error: any): ApiError {
  if (!error || typeof error !== 'object') {
    return { message: String(error) || 'An unexpected error occurred', status: 0 };
  }
  console.log('🔍 [ERROR-HANDLER] Raw error:', error);
  console.log('🔍 [ERROR-HANDLER] Error type:', typeof error);
  console.log('🔍 [ERROR-HANDLER] Error keys:', Object.keys(error));
  
  if (error.response) {
    console.log('📡 [ERROR-HANDLER] Status:', error.response.status);
    console.log('📡 [ERROR-HANDLER] Response data:', JSON.stringify(error.response.data));
    console.log('📡 [ERROR-HANDLER] URL:', error.config?.url);
    
    // Handle validation errors (400)
    if (error.response.data?.errors) {
      const validationErrors = error.response.data.errors;
      // Extract first error message from errors object
      const firstErrorKey = Object.keys(validationErrors)[0];
      const firstErrorMessage = validationErrors[firstErrorKey]?.[0];
      
      console.log('⚠️ [ERROR-HANDLER] Validation errors:', validationErrors);
      
      return {
        message: firstErrorMessage || error.response.data?.title || 'Validation error',
        status: error.response.status,
        errors: validationErrors,
      };
    }
    
    return {
      message: error.response.data?.message || error.response.data?.title || 'An error occurred',
      status: error.response.status,
      errors: error.response.data?.errors,
    };
  } else if (error.request) {
    console.log('📤 [ERROR-HANDLER] Request error (no response):', error.request);
    return {
      message: 'No response from server',
      status: 0,
    };
  }
  console.log('⚠️ [ERROR-HANDLER] Other error:', error.message);
  return {
    message: error.message || 'An unexpected error occurred',
    status: 0,
  };
}
