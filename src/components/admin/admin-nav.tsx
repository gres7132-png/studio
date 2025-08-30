
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Users, ListCollapse } from "lucide-react";
import { cn } from "@/lib/utils";


const adminNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/packages", label: "Packages", icon: Package },
    { href: "/admin/transactions", label: "Transactions", icon: ListCollapse },
];

export function AdminNav() {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col gap-2 p-4">
            {adminNavItems.map(item => (
                <Link 
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href && "bg-muted text-primary"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
