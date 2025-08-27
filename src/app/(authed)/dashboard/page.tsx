import { getTodaysEarnings, mockUser, packages } from '@/lib/data';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { PackagesList } from '@/components/dashboard/packages-list';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export default function DashboardPage() {
  const user = mockUser;
  const todaysEarnings = getTodaysEarnings(user);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-headline md:text-3xl">
          Welcome back, {user.name}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a summary of your account activity.
        </p>
      </div>

      <StatsCards user={user} todaysEarnings={todaysEarnings} />

      <div>
        <h2 className="text-xl font-headline md:text-2xl">
          Available Marketing Packages
        </h2>
        <p className="text-muted-foreground">
          Purchase marketing rights to earn daily returns.
        </p>
        <PackagesList packages={packages} />
      </div>

      <div>
        <h2 className="text-xl font-headline md:text-2xl">Recent Transactions</h2>
        <RecentTransactions transactions={user.transactions.slice(0, 5)} />
      </div>
    </div>
  );
}
