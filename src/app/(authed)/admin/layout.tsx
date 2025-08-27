import { mockUser } from "@/lib/data";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = mockUser;

    if (!user.isAdmin) {
       return (
        <div className="p-4">
             <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    You do not have permission to view this page.
                </AlertDescription>
             </Alert>
        </div>
       )
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
