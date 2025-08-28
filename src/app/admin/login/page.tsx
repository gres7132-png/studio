
'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.push('/admin/dashboard');
    }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={login}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Admin Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="balenciaga-admin"
                required
                defaultValue="balenciaga-admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required defaultValue="Rightson-2024" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">Sign In</Button>
             <div className="text-center text-sm">
              Not an admin?{' '}
              <Link href="/login" className="underline text-primary">
                User sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
