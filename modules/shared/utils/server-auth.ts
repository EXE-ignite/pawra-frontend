import { cookies } from 'next/headers';

export async function getServerAuthToken(): Promise<string | null> {
  // Đọc cookie authToken từ request (Next.js App Router, Next 16)
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken');
  return token?.value || null;
}
