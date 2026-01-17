import { apiService } from './api';
import type { LoginRequest, LoginResponse, RegisterRequest, GoogleLoginRequest, User } from '../types/auth.types';

const USER_STORAGE_KEY = 'pawra_user';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  console.log('🔐 [AUTH] Starting login with:', credentials.email);
  
  try {
    const response = await apiService.post<any>('/Auth/login', credentials);
    console.log('📥 [AUTH] API Response:', response);
    
    if (response.data?.token) {
      console.log('✅ [AUTH] Token found, saving...');
      apiService.setToken(response.data.token);
      
      // Lưu thông tin user
      const user: User = {
        email: response.data.email,
        fullName: response.data.fullName,
        role: response.data.role,
        expiresAt: response.data.expiresAt,
      };
      console.log('👤 [AUTH] Saving user:', user);
      saveUser(user);
    }
    
    console.log('✨ [AUTH] Login successful!');
    return {
      success: response.success || false,
      message: response.message || 'Đã đăng nhập',
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ [AUTH] Login error:', error);
    console.error('📊 [AUTH] Error details:', {
      message: error?.message,
      response: error?.response,
      responseData: error?.response?.data,
      status: error?.response?.status,
      stack: error?.stack,
    });
    
    // Extract error message from validation errors or general error
    let errorMessage = 'Đã có lỗi xảy ra';
    
    if (error.response?.data?.errors) {
      // Get first validation error message
      const errors = error.response.data.errors;
      const firstKey = Object.keys(errors)[0];
      errorMessage = errors[firstKey]?.[0] || errorMessage;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function loginWithGoogle(request: GoogleLoginRequest): Promise<LoginResponse> {
  console.log('🔵 [GOOGLE] Starting Google login...');
  
  try {
    const response = await apiService.post<any>('/Auth/google/callback', request);
    console.log('📥 [GOOGLE] API Response:', response);
    
    if (response.data?.token) {
      console.log('✅ [GOOGLE] Token found, saving...');
      apiService.setToken(response.data.token);
      
      // Lưu thông tin user
      const user: User = {
        email: response.data.email,
        fullName: response.data.fullName,
        role: response.data.role,
        expiresAt: response.data.expiresAt,
      };
      console.log('👤 [GOOGLE] Saving user:', user);
      saveUser(user);
    }
    
    console.log('✨ [GOOGLE] Login successful!');
    return {
      success: response.success || true,
      message: response.message || 'Đã đăng nhập với Google',
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ [GOOGLE] Login error:', error);
    console.error('📊 [GOOGLE] Error details:', {
      message: error?.message,
      response: error?.response,
      responseData: error?.response?.data,
      status: error?.response?.status,
    });
    
    let errorMessage = 'Đã có lỗi xảy ra khi đăng nhập với Google';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function logout(): Promise<void> {
  console.log('👋 [AUTH] Starting logout...');
  try {
    // Call logout API (optional, not critical if it fails)
    await apiService.post('/Auth/logout');
    console.log('✅ [AUTH] Logout API called successfully');
  } catch (error: any) {
    console.warn('⚠️ [AUTH] Logout API error (continuing anyway):', error);
    console.warn('⚠️ [AUTH] Error details:', {
      message: error.message,
      status: error.status,
      response: error.response
    });
    // Don't throw - we still want to clear local data even if API fails
  } finally {
    console.log('🧹 [AUTH] Clearing local data...');
    apiService.clearToken();
    clearUser();
    console.log('✅ [AUTH] Logout completed');
  }
}

export async function register(data: RegisterRequest): Promise<LoginResponse> {
  console.log('📝 [AUTH] Starting registration with:', data.email);
  console.log('📤 [AUTH] Full request data:', data);
  
  try {
    const response = await apiService.post<any>('/Auth/register', data);
    console.log('📥 [AUTH] API Response:', response);
    
    if (response.data?.token) {
      console.log('✅ [AUTH] Token found, saving...');
      apiService.setToken(response.data.token);
      
      // Lưu thông tin user
      const user: User = {
        email: response.data.email,
        fullName: response.data.fullName,
        role: response.data.role,
        expiresAt: response.data.expiresAt,
      };
      console.log('👤 [AUTH] Saving user:', user);
      saveUser(user);
    }
    
    console.log('✨ [AUTH] Registration successful!');
    return {
      success: response.success || false,
      message: response.message || 'Đã đăng ký thành công',
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ [AUTH] Registration error:', error);
    console.error('❌ [AUTH] Error details:', {
      message: error.message,
      response: error.response,
      status: error.status,
      full: JSON.stringify(error, null, 2)
    });
    
    // Extract error message from validation errors or general error
    let errorMessage = 'Đã có lỗi xảy ra';
    
    if (error.response?.data?.errors) {
      // Get first validation error message
      const errors = error.response.data.errors;
      const firstKey = Object.keys(errors)[0];
      errorMessage = errors[firstKey]?.[0] || errorMessage;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export function saveUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
}

export function clearUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!apiService.getToken() && !!getUser();
}
