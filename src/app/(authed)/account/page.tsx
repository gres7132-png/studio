
'use client';
import { mockUser } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

export default function AccountPage() {
  const user = mockUser;
  const { toast } = useToast();

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your personal information has been successfully updated.",
    });
  }

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    });
  }


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
                    <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="font-headline text-2xl font-bold">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <Separator />
            <form className="space-y-4" onSubmit={handleProfileUpdate}>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" defaultValue={user.mobile} />
                </div>
                <Button>Save Changes</Button>
            </form>
            <Separator />
             <form className="space-y-4" onSubmit={handlePasswordUpdate}>
                <h3 className="text-lg font-headline font-bold">Change Password</h3>
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                </div>
                <Button>Update Password</Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
