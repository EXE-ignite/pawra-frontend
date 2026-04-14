'use client';

import { ReactNode, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, ThemeProvider, LanguageProvider, SubscriptionProvider } from '@/modules/shared';

export function Providers({ children }: { children: ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,        // 1 phút — data vẫn "fresh" trước khi refetch
            gcTime: 5 * 60 * 1000,       // 5 phút — giữ cache trong memory sau khi unmount
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          {googleClientId ? (
            <GoogleOAuthProvider clientId={googleClientId}>
              <AuthProvider>
                <SubscriptionProvider>
                  {children}
                </SubscriptionProvider>
              </AuthProvider>
            </GoogleOAuthProvider>
          ) : (
            <AuthProvider>
              <SubscriptionProvider>
                {children}
              </SubscriptionProvider>
            </AuthProvider>
          )}
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
