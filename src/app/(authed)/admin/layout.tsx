
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

    React.useEffect(() => {
        if (!loading && (!user || (user.email && !ADMIN_EMAILS.includes(user.email)))) {
           router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || !user || (user.email && !ADMIN_EMAILS.includes(user.email))) {
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
