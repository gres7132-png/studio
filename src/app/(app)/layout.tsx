import DashboardLayout from '@/components/dashboard-layout';
import { AuthProvider } from '@/hooks/use-auth';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}
