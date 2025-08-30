
'use client';
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import React from "react";
import { ADMIN_EMAILS } from "@/lib/config";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = React.useState(false);

    React.useEffect(() => {
        // Check sessionStorage for our special admin flag first.
        // This is set on the login page for the predetermined admin.
        const isSessionAdmin = sessionStorage.getItem('isAdmin') === 'true';

        // Then, check if the authenticated Firebase user has an admin email.
        const isEmailAdmin = !loading && user?.email && ADMIN_EMAILS.includes(user.email);
        
        const hasAdminAccess = isSessionAdmin || isEmailAdmin;

        if (!loading) {
            if (hasAdminAccess) {
                setIsAdmin(true);
            } else {
                // If not loading and not an admin, redirect away.
                router.push('/dashboard');
            }
        }
    }, [user, loading, router]);
    
    // While loading or if user is not determined to be admin yet, show a loading screen.
    // The useEffect hook will handle the redirect if they are not an admin.
    if (loading || !isAdmin) {
        return <div className="flex justify-center items-center h-screen">Loading Admin Panel...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                 <h1 className="text-3xl font-headline md:text-4xl text-primary">Admin Panel</h1>
                <p className="text-muted-foreground">
                    Manage users, packages, and view site statistics.
                </p>
            </div>
            {children}
        </div>
    );
}
