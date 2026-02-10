import { StaffLayout } from '@/modules/shared/layouts/StaffLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffLayout>{children}</StaffLayout>;
}
