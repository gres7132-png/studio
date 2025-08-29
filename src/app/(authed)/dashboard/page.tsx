
'use client';
import { packages, testimonials } from '@/lib/data';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { PackagesList } from '@/components/dashboard/packages-list';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { TestimonialsCarousel } from '@/components/dashboard/testimonials-carousel';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { mockUser, getTodaysEarnings } from '@/lib/data'; // Still need some mock data for now

export default function DashboardPage() {
  const { user: authUser } = useAuth();
  
  // We'll continue to use some mock data for parts of the dashboard
  // until the database is fully integrated.
  const user = mockUser;
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
