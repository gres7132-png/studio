
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
        // Check sessionStorage for our special admin flag
        const isPredeterminedAdmin = sessionStorage.getItem('isAdmin') === 'true';
        
        // Check firebase-authenticated user's email
        const isEmailAdmin = !loading && user?.email && ADMIN_EMAILS.includes(user.email);

        const hasAdminAccess = isPredeterminedAdmin || isEmailAdmin;
        setIsAdmin(hasAdminAccess);

        if (!loading && !hasAdminAccess) {
           router.push('/dashboard');
        }
    }, [user, loading, router]);
    
    // While loading or if user is not determined to be admin yet, show loading
    if (loading || !isAdmin) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
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
