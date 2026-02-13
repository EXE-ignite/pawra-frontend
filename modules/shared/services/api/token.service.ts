class TokenService {
  private readonly TOKEN_KEY = 'authToken';

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      // Lưu vào cookie để server components có thể đọc được
      document.cookie = `authToken=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      // Xóa cookie
      document.cookie = 'authToken=; path=/; max-age=0';
    }
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}

export const tokenService = new TokenService();
