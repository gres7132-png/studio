
'use client';
import type { User } from '@/lib/types';
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
} from 'lucide-react';

interface SidebarNavProps {
  user: User;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/investments', label: 'Investments', icon: Package },
  { href: '/dividends', label: 'Company Dividends', icon: Landmark },
  { href: '/commissions', label: 'Commissions', icon: HandCoins },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/account', label: 'Account', icon: Settings },
];

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Admin Dashboard', icon: Shield },
  { href: '/admin/packages', label: 'Manage Packages', icon: Package },
  { href: '/admin/users', label: 'Manage Users', icon: UserCog },
];

export function SidebarNav({ user }: SidebarNavProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
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
      {user.isAdmin && (
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
