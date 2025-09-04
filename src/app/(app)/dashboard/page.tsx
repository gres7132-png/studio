
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/lib/utils";
import {
  Activity,
  AlertOctagon,
  ArrowDown,
  ArrowUp,
  DollarSign,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Mock data, in a real app, you would fetch this from your backend/API.
  const stats = {
    availableBalance: 0,
    todaysEarnings: 0,
    rechargeAmount: 1300,
    withdrawalAmount: 2336,
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Control Panel</h1>
        <Button variant="outline">Return to Official Website</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.availableBalance)}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.todaysEarnings)}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recharge Amount</CardTitle>
                <ArrowUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.rechargeAmount)}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Withdrawal Amount</CardTitle>
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.withdrawalAmount)}</div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5" />
            Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            1: After waiting for 24 hours, you can withdraw the income from purchasing company products, and you can withdraw cash immediately without any requirements.
          </p>
          <p>
            2: The company's withdrawal fee needs to deduct 10% tax, because the company is an American company and needs to pay taxes to the United States. However, the company will set a tax-free day for all members on the 23rd of each month. No fees will be deducted on this day.
          </p>
          <p>
            3: You only need to have one account in the company, and multiple accounts are not allowed. The system will automatically block members with multiple accounts.
          </p>
           <p>
            4: Becoming a promoter of the company will get the necessary generous benefits. Interested personnel can contact the manager.
          </p>
           <p>
            5: Since the company is large with more than one million members, there will be many scammers targeting company members for fraud. Please do not trust anyone other than the customer service of the official website. Recharge and withdrawal must be done at the official website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
