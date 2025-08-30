
'use client';
import { useRouter } from "next/navigation";
import React from "react";
import { Logo } from "@/components/icons";
import { Toaster } from "@/components/ui/toaster";

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
        <div className="flex min-h-screen flex-col">
             <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <Logo className="size-6 text-primary" />
                    <span className="font-headline text-lg font-semibold">
                    Balenciaga - Admin
                    </span>
                </div>
                <div className="flex-1" />
                 <a href="/login" onClick={() => sessionStorage.removeItem('isAdmin')} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Logout
                </a>
            </header>
            <main className="flex-1 p-4 sm:p-6">
                 <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-headline md:text-4xl text-primary">Admin Panel</h1>
                        <p className="text-muted-foreground">
                            Manage users, packages, and view site statistics.
                        </p>
                    </div>
                    {children}
                </div>
            </main>
            <Toaster />
        </div>
    );
}
