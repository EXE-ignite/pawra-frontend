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

  /**
   * Decode JWT payload to extract claims (client-side only)
   */
  getTokenClaims(): Record<string, any> | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Extract customerId from JWT claims
   * .NET BE stores it as "customerId" or similar custom claim
   */
  getCustomerIdFromToken(): string | null {
    const claims = this.getTokenClaims();
    if (!claims) return null;
    return (
      claims['customerId'] ||
      claims['CustomerId'] ||
      claims['customer_id'] ||
      null
    );
  }
}

export const tokenService = new TokenService();
