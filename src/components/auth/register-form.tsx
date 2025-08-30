
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
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { signUpUser } from "@/lib/actions";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [referrerCode, setReferrerCode] = useState('');

    useEffect(() => {
        setReferrerCode(searchParams.get('ref') || '');
    }, [searchParams]);

    async function register(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        
        const result = await signUpUser({
            email,
            password,
            name,
            mobile,
            referredBy: referrerCode || null,
        });

        if (result.success) {
            toast({
                title: "Account Created",
                description: "Welcome! We're signing you in.",
            });
            // Sign in the user after successful registration
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } else {
             toast({
                title: "Registration Failed",
                description: result.error,
                variant: "destructive"
            });
        }
        
        setLoading(false);
    }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={register}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Join us to start investing in marketing rights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" type="tel" placeholder="+254712345678" required value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="referrer">Referrer Code (Optional)</Label>
              <Input id="referrer" placeholder="Enter referrer ID" value={referrerCode} onChange={(e) => setReferrerCode(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline text-primary">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
