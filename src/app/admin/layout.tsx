
import { Logo } from "@/components/icons";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
       <header className="p-4 md:p-6">
        <div className="container mx-auto flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-semibold">Balenciaga - Admin</span>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
