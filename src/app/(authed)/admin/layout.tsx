
import { mockUser } from "@/lib/data";
import { redirect } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = mockUser;

    if (!user.isAdmin) {
       redirect('/admin/login');
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
