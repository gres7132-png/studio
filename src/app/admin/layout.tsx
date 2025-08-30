
'use client';
import { useRouter } from "next/navigation";
import React from "react";
import { Logo } from "@/components/icons";
import { Toaster } from "@/components/ui/toaster";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // For this special admin flow, we only check session storage.
        const isSessionAdmin = sessionStorage.getItem('isAdmin') === 'true';

        if (isSessionAdmin) {
            setIsAdmin(true);
        } else {
            // If not an admin, redirect away.
            router.push('/login');
        }
        setLoading(false);
    }, [router]);
    
    if (loading || !isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <p>Loading Admin Panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
            <div className="flex h-16 items-center border-b px-6">
                 <div className="flex items-center gap-2">
                    <Logo className="size-6 text-primary" />
                    <span className="font-headline text-lg font-semibold">
                        Balenciaga
                    </span>
                </div>
            </div>
            <AdminNav />
          </aside>
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <div>
                     <h1 className="text-2xl font-headline font-bold md:text-3xl">Admin Panel</h1>
                </div>
                 <a href="/login" onClick={() => sessionStorage.removeItem('isAdmin')} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Logout
                </a>
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
               {children}
            </main>
          </div>
           <Toaster />
        </div>
    );
}
