
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { updateProfile, updatePassword as updateAuthPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AccountPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = React.useState(user?.displayName || '');
  const [mobile, setMobile] = React.useState(''); // Mobile isn't stored in Firebase auth by default

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user && auth.currentUser) {
        try {
            await updateProfile(auth.currentUser, { displayName: name });
            // In a real app, you would also update the mobile number in your database here.
            toast({
                title: "Profile Updated",
                description: "Your personal information has been successfully updated.",
            });
        } catch(error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive"
            });
        }
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPassword = (e.currentTarget.elements.namedItem('new-password') as HTMLInputElement).value;
    const confirmPassword = (e.currentTarget.elements.namedItem('confirm-password') as HTMLInputElement).value;
    
    if (newPassword !== confirmPassword) {
        toast({ title: "Passwords do not match", variant: "destructive" });
        return;
    }

    if (auth.currentUser) {
        try {
            await updateAuthPassword(auth.currentUser, newPassword);
            toast({
                title: "Password Updated",
                description: "Your password has been successfully changed.",
            });
        } catch (error: any) {
             toast({
                title: "Password Update Failed",
                description: "This is a sensitive operation and requires a recent login. Please log out and log back in to change your password.",
                variant: "destructive"
            });
        }
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-headline font-bold md:text-3xl">My Account</h1>
        <p className="text-muted-foreground">
          View and edit your personal information.
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="font-headline text-2xl font-bold">{user.displayName}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <Separator />
            <form className="space-y-4" onSubmit={handleProfileUpdate}>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </div>
                <Button>Save Changes</Button>
            </form>
            <Separator />
             <form className="space-y-4" onSubmit={handlePasswordUpdate}>
                <h3 className="text-lg font-headline font-bold">Change Password</h3>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" name="new-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" name="confirm-password" type="password" />
                </div>
                <Button>Update Password</Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
