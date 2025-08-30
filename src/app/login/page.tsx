
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
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { PREDETERMINED_ADMIN } from "@/lib/config";

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        // Check for predetermined admin credentials
        if (email === PREDETERMINED_ADMIN.email && password === PREDETERMINED_ADMIN.password) {
            // In a real app, you'd set a secure session/token here.
            // For this prototype, we'll use sessionStorage to simulate an admin login.
            sessionStorage.setItem('isAdmin', 'true');
            toast({
                title: "Admin Login Successful",
                description: `Welcome, ${PREDETERMINED_ADMIN.name}!`,
            });
            router.push('/admin/dashboard');
            setLoading(false);
            return;
        }


        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={login}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline text-primary">
                Sign up
              </Link>
            </div>
             <div className="mt-4 text-center text-xs text-muted-foreground">
              Admins can log in using their predetermined credentials.
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
