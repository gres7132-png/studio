
'use client';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Wallet,
  Users,
  HandCoins,
  Shield,
  UserCog,
  Settings,
  Landmark,
  Receipt,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '../ui/skeleton';
import { ADMIN_EMAILS } from '@/lib/config';

interface SidebarNavProps {}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/investments', label: 'Investments', icon: Package },
  { href: '/commissions', label: 'Commissions', icon: HandCoins },
  { href: '/dividends', label: 'Company Dividends', icon: Landmark },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/account', label: 'Account', icon: Settings },
];

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Admin Dashboard', icon: Shield },
  { href: '/admin/users', label: 'Manage Users', icon: UserCog },
  { href: '/admin/packages', label: 'Manage Packages', icon: Package },
  { href: '/admin/transactions', label: 'Transactions', icon: Receipt },
];

export function SidebarNav({}: SidebarNavProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { user, loading } = useAuth();
  
  // A real implementation would check a user's role from a database.
  // For now, we'll check against a hardcoded list of admin emails.
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

  const handleLinkClick = () => {
    setOpenMobile(false);
  }

  if (loading) {
    return (
        <div className="p-2 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
  }

  return (
    <SidebarMenu>
      <SidebarGroup>
        <SidebarGroupLabel>User Menu</SidebarGroupLabel>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              size="lg"
              isActive={pathname === item.href}
              tooltip={item.label}
              onClick={handleLinkClick}
            >
              <Link href={item.href}>
                <item.icon />
                <span className="text-base font-medium">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>
      {isAdmin && (
        <>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  onClick={handleLinkClick}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        </>
      )}
    </SidebarMenu>
  );
}
