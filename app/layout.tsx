'use client';

import type { Metadata } from "next";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "@/modules/shared";
import { usePathname } from 'next/navigation';
import { AppShell } from '@/modules/shared/layouts/AppShell';
import "@/styles/globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const pathname = usePathname();

  const shouldHideShell =
    pathname?.startsWith('/auth') || pathname?.startsWith('/api');
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            {shouldHideShell ? children : <AppShell>{children}</AppShell>}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
