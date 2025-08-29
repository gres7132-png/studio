
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { differenceInDays, format, parseISO } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import type { Investment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function InvestmentsPage() {
  const { user } = useAuth();

  if (!user) {
      return (
          <div className="space-y-8">
              <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
          </div>
      )
  }
  
  const investments: Investment[] = user.investments;

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const today = new Date();
    const totalDuration = differenceInDays(end, start);
    const elapsed = differenceInDays(today, start);
    if (totalDuration <= 0) return 100;
    const progress = (elapsed / totalDuration) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getStatusVariant = (status: 'active' | 'completed' | 'pending' | 'cancelled') => {
      switch (status) {
          case 'active': return 'default';
          case 'completed': return 'secondary';
          case 'pending': return 'outline';
          case 'cancelled': return 'destructive';
      }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-headline font-bold md:text-3xl">My Investments</h1>
        <p className="text-muted-foreground">
          Track your marketing rights portfolio and earnings.
        </p>
      </div>

      <div className="space-y-6">
        {investments.length > 0 ? (
          investments.map((inv) => (
            <Card key={inv.id} className="shadow-md transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="font-headline text-xl font-bold">
                    {inv.package.name}
                  </CardTitle>
                   <p className="text-sm text-muted-foreground">
                    Purchased on {format(parseISO(inv.createdAt), 'PPP')}
                  </p>
                </div>
                <Badge variant={getStatusVariant(inv.status)} className="capitalize">{inv.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <div className="text-sm text-muted-foreground">Investment</div>
                        <div className="text-lg font-semibold">Ksh {inv.amount.toLocaleString()}</div>
                    </div>
                     <div>
                        <div className="text-sm text-muted-foreground">Total Earnings</div>
                        <div className="text-lg font-semibold text-green-600">Ksh {inv.earnings.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Expected Return</div>
                        <div className="text-lg font-semibold text-primary">Ksh {inv.package.totalReturn.toLocaleString()}</div>
                    </div>
                </div>
                {inv.status === 'active' && (
                    <div className='mt-4'>
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>Ends on {format(parseISO(inv.endDate), 'PPP')}</span>
                        </div>
                        <Progress value={calculateProgress(inv.startDate, inv.endDate)} />
                    </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="flex items-center justify-center p-10">
            <p className="text-muted-foreground">You have no investments yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
