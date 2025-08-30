
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { Referral } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function CommissionsPage() {
  const { user, authUser } = useAuth();
  const { toast } = useToast();
  
  const referralsMade: Referral[] = user?.referralsMade || [];
  const referralLink = authUser ? `${window.location.origin}/register?ref=${authUser.uid}` : '';
  
  const totalCommissions = referralsMade.reduce(
    (sum, ref) => sum + ref.commissionAmount,
    0
  );

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      toast({
        title: "Copied to clipboard!",
        description: "Your referral link has been copied.",
      });
    }
  }
  
  if (!user || !authUser) {
    return (
       <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80 mt-2" />
        </div>
         <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
         </div>
         <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-headline font-bold md:text-3xl">Agent Commissions</h1>
        <p className="text-muted-foreground">
          Track your referral earnings and grow your network.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl font-bold">Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input value={referralLink} readOnly />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Share this link to earn a 5% commission on their first investment.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md bg-gradient-to-r from-primary to-blue-800 text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-headline text-xl font-bold">Total Commission Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              Ksh {totalCommissions.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-primary-foreground/80">
              From {referralsMade.length} referrals.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl font-bold">Referred Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead className="text-right">Commission Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referralsMade.length > 0 ? (
                referralsMade.map((ref) => (
                  <TableRow key={ref.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <Avatar className="h-9 w-9">
                           <AvatarFallback>{ref.referred.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div>
                           <div className="font-medium">{ref.referred.name}</div>
                           <div className="text-sm text-muted-foreground">{ref.referred.email}</div>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(ref.createdAt), 'PPP')}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      +Ksh {ref.commissionAmount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                        You haven&apos;t referred any users yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
