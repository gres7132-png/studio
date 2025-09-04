
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Wallet,
  User,
  LogOut,
  Settings,
  LineChart,
  Briefcase,
  DollarSign,
  UserPlus,
  Gift,
} from "lucide-react";

import { signOut } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
  SidebarGroup,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Logo } from "./logo";
import type { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/invest", icon: Briefcase, label: "Product Center" },
  { href: "/dashboard/wallet", icon: Wallet, label: "Withdraw/Deposit" },
  { href: "/dashboard/referrals", icon: UserPlus, label: "Referral Program" },
  { href: "/dashboard/distributor", icon: Gift, label: "Distributor Program" },
  { href: "/dashboard/commissions", icon: DollarSign, label: "Agent Commissions" },
];

function NavMenu() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            disabled={item.disabled}
            isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true)}
            tooltip={item.label}
            onClick={handleLinkClick}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

function UserProfileNav() {
    const { user, loading, auth, isAdmin } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/auth");
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 p-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photoURL ?? `https://avatar.vercel.sh/${user?.email}.png`} data-ai-hint="person avatar" alt={user?.displayName ?? "User"} />
                  <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">{user?.displayName ?? 'User'}</p>
                    {isAdmin && <Badge variant="secondary">Admin</Badge>}
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
    )
}

function UserInfo() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="p-2 space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
            </div>
        )
    }
    
    // A simple way to generate a somewhat unique ID for display
    const displayId = user?.uid.substring(0, 5).toUpperCase() ?? 'N/A';

    return (
        <div className="p-2 text-sm">
            <div className="font-bold text-sidebar-foreground">
                ID: {displayId}
            </div>
            <div className="text-muted-foreground">
                {user?.phoneNumber || "No phone number"}
            </div>
        </div>
    )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-primary">YieldLink</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                {user && <UserInfo />}
            </SidebarGroup>
          <NavMenu />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between lg:justify-end border-b px-4 lg:px-6">
          <SidebarTrigger className="lg:hidden" />
          <UserProfileNav />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
