import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, PiggyBank, CircleArrowOutUpRight, Download, Upload } from 'lucide-react';

interface StatsCardsProps {
  user: User;
  todaysEarnings: number;
}

const formatCurrency = (amount: number) =>
  `Ksh ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;

export function StatsCards({ user, todaysEarnings }: StatsCardsProps) {
  const stats = [
    {
      title: 'Account Balance',
      value: formatCurrency(user.wallet.balance),
      icon: PiggyBank,
      color: 'text-blue-500',
    },
    {
      title: "Today's Earnings",
      value: formatCurrency(todaysEarnings),
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Total Recharge',
      value: formatCurrency(user.wallet.totalRecharge),
      icon: Download,
      color: 'text-yellow-500',
    },
    {
      title: 'Total Withdrawal',
      value: formatCurrency(user.wallet.totalWithdrawal),
      icon: Upload,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 text-muted-foreground ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              Updated just now
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
