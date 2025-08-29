
'use client';
import { packages, testimonials } from '@/lib/data';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { PackagesList } from '@/components/dashboard/packages-list';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { TestimonialsCarousel } from '@/components/dashboard/testimonials-carousel';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { getTodaysEarnings } from '@/lib/data'; 
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { authUser, user } = useAuth();
  
  if (!user || !authUser) {
    return (
      <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
          </div>
          <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Separator />
           <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
      </div>
    );
  }

  const todaysEarnings = getTodaysEarnings(user);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-headline font-bold md:text-3xl">
          Welcome back, {authUser?.displayName || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a summary of your account activity.
        </p>
      </div>

      <StatsCards user={user} todaysEarnings={todaysEarnings} />
      
      <div>
        <h2 className="text-xl font-headline font-bold md:text-2xl">
          Community Activity
        </h2>
         <p className="text-muted-foreground mb-4">
          See what other members are doing right now.
        </p>
        <TestimonialsCarousel testimonials={testimonials} />
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-headline font-bold md:text-2xl">
          Available Marketing Packages
        </h2>
        <p className="text-muted-foreground">
          Purchase marketing rights to earn daily returns.
        </p>
        <PackagesList packages={packages} />
      </div>
      
      <Separator />

      <div>
        <h2 className="text-xl font-headline font-bold md:text-2xl">Recent Transactions</h2>
        <RecentTransactions transactions={user.transactions.slice(0, 5)} />
      </div>
    </div>
  );
}
