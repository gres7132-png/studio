
'use client';
import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { authUser, user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !authUser) {
      router.push('/login');
    }
  }, [authUser, loading, router]);
  
  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  // If the auth state is loading OR the user object from firestore hasn't been loaded yet,
  // we can show a null state, and the loading screen from AuthProvider will be displayed.
  if (loading || !user || !authUser) {
    return null; 
  }

  const userInitial = user.name ? user.name.charAt(0) : (user.email ? user.email.charAt(0) : 'U');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-6 text-primary" />
            <span className="font-headline text-lg font-semibold text-sidebar-foreground">
              Balenciaga
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          <Button variant="ghost" className="w-full justify-start gap-2 text-base h-12" onClick={handleLogout}>
              <LogOut />
              <span className="group-data-[collapsible=icon]:hidden">
                Logout
              </span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className='font-normal'>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account"><UserIcon className='mr-2 size-4' />Account</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                 <LogOut className='mr-2 size-4' />Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
        </AuthProvider>
    )
}
