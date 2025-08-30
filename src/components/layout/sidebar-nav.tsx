
'use client';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Wallet,
  HandCoins,
  Settings,
  Landmark,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '../ui/skeleton';

interface SidebarNavProps {}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/investments', label: 'Investments', icon: Package },
  { href: '/commissions', label: 'Commissions', icon: HandCoins },
  { href: '/dividends', label: 'Company Dividends', icon: Landmark },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/account', label: 'Account', icon: Settings },
];

export function SidebarNav({}: SidebarNavProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { loading } = useAuth();
  
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
    </SidebarMenu>
  );
}
