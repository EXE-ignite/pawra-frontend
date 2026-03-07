import { cookies } from 'next/headers';

export async function getServerAuthToken(): Promise<string | null> {
  // Đọc cookie authToken từ request (Next.js App Router, Next 16)
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken');
  return token?.value || null;
}

/**
 * Decode JWT payload server-side and extract the user's role claim.
 * Only used for UI routing decisions — real auth is enforced by the backend.
 */
export async function getServerAuthRole(): Promise<string | null> {
  const token = await getServerAuthToken();
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
    );
    return (
      decoded['role'] ||
      decoded['Role'] ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      null
    );
  } catch {
    return null;
  }
}
