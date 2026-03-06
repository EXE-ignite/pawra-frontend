import { apiService } from './api';
import type { LoginRequest, LoginResponse, RegisterRequest, GoogleLoginRequest, User } from '../types/auth.types';

const USER_STORAGE_KEY = 'pawra_user';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  console.log('🔐 [AUTH] Starting login with:', credentials.email);
  
  try {
    const response = await apiService.post<any>('/Auth/login', credentials);
    console.log('📥 [AUTH] Full API Response:', JSON.stringify(response, null, 2));
    console.log('📥 [AUTH] Response type:', typeof response);
    console.log('📥 [AUTH] Response keys:', Object.keys(response || {}));
    
    // Handle different response structures
    // Case 1: response.data contains the user info
    // Case 2: response itself contains the user info
    const responseData = response.data || response;
    console.log('📦 [AUTH] Response data:', responseData);
    
    if (responseData?.token) {
      console.log('✅ [AUTH] Token found, saving...');
      apiService.setToken(responseData.token);
      
      // Lưu thông tin user
      const user: User = {
        email: responseData.email,
        fullName: responseData.fullName,
        role: responseData.role,
        expiresAt: responseData.expiresAt,
      };
      console.log('👤 [AUTH] Saving user:', user);
      saveUser(user);
      
      console.log('✨ [AUTH] Login successful!');
      return {
        success: true,
        message: response.message || 'Đã đăng nhập',
        data: responseData,
      };
    } else {
      console.error('⚠️ [AUTH] No token in response');
      return {
        success: false,
        message: 'Không tìm thấy token trong response',
      };
    }
  } catch (error: any) {
    console.error('❌ [AUTH] Login error:', error);
    
    // Error is already formatted by handleApiError in interceptor
    const errorMessage = error?.message || 'Đã có lỗi xảy ra';
    
    console.error('📊 [AUTH] Error message:', errorMessage);
    console.error('📊 [AUTH] Error status:', error?.status);
    
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
    console.log('📥 [GOOGLE] Full API Response:', JSON.stringify(response, null, 2));
    
    // Handle different response structures
    const responseData = response.data || response;
    console.log('📦 [GOOGLE] Response data:', responseData);
    
    if (responseData?.token) {
      console.log('✅ [GOOGLE] Token found, saving...');
      apiService.setToken(responseData.token);
      
      // Lưu thông tin user
      const user: User = {
        email: responseData.email,
        fullName: responseData.fullName,
        role: responseData.role,
        expiresAt: responseData.expiresAt,
      };
      console.log('👤 [GOOGLE] Saving user:', user);
      saveUser(user);
      
      console.log('✨ [GOOGLE] Login successful!');
      return {
        success: true,
        message: response.message || 'Đã đăng nhập với Google',
        data: responseData,
      };
    } else {
      console.error('⚠️ [GOOGLE] No token in response');
      return {
        success: false,
        message: 'Không tìm thấy token trong response',
      };
    }
  } catch (error: any) {
    console.error('❌ [GOOGLE] Login error:', error);
    
    // Error is already formatted by handleApiError in interceptor
    const errorMessage = error?.message || 'Đã có lỗi xảy ra khi đăng nhập với Google';
    
    console.error('📊 [GOOGLE] Error message:', errorMessage);
    console.error('📊 [GOOGLE] Error status:', error?.status);
    
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
    console.warn('⚠️ [AUTH] Error message:', error?.message);
    console.warn('⚠️ [AUTH] Error status:', error?.status);
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
    console.log('📥 [AUTH] Full API Response:', JSON.stringify(response, null, 2));
    
    // Handle different response structures
    const responseData = response.data || response;
    console.log('📦 [AUTH] Response data:', responseData);
    
    if (responseData?.token) {
      console.log('✅ [AUTH] Token found, saving...');
      apiService.setToken(responseData.token);
      
      // Lưu thông tin user
      const user: User = {
        email: responseData.email,
        fullName: responseData.fullName,
        role: responseData.role,
        expiresAt: responseData.expiresAt,
      };
      console.log('👤 [AUTH] Saving user:', user);
      saveUser(user);
      
      console.log('✨ [AUTH] Registration successful!');
      return {
        success: true,
        message: response.message || 'Đã đăng ký thành công',
        data: responseData,
      };
    } else {
      console.error('⚠️ [AUTH] No token in response');
      return {
        success: false,
        message: 'Không tìm thấy token trong response',
      };
    }
  } catch (error: any) {
    console.error('❌ [AUTH] Registration error:', error);
    
    // Error is already formatted by handleApiError in interceptor
    const errorMessage = error?.message || 'Đã có lỗi xảy ra';
    
    console.error('📊 [AUTH] Error message:', errorMessage);
    console.error('📊 [AUTH] Error status:', error?.status);
    console.error('📊 [AUTH] Full error:', JSON.stringify(error, null, 2));
    
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
