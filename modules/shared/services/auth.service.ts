import { apiService } from './api';
import type { LoginRequest, LoginResponse, User } from '../types/auth.types';

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
      message: response.message,
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ [AUTH] Login error:', error);
    return {
      success: false,
      message: error.message || 'Đã có lỗi xảy ra',
    };
  }
}

export async function logout(): Promise<void> {
  try {
    await apiService.post('/Auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    apiService.clearToken();
    clearUser();
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
