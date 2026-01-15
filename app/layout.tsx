import type { Metadata } from "next";
import { MainLayout, AuthProvider } from "@/modules/shared";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Pawra - Pet Healthcare Management",
  description: "Comprehensive pet healthcare management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
