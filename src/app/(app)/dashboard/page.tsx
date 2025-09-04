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
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Users,
  Copy,
  ArrowRight,
} from "lucide-react";
import { useMemo } from "react";

export default function DashboardPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const referralLink = useMemo(() => {
    if (typeof window !== 'undefined' && user?.uid) {
      return `${window.location.origin}/auth?ref=${user.uid}`;
    }
    return "";
  }, [user?.uid]);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "Your referral link has been copied.",
      });
    });
  };

  // Mock data removed. In a real app, you would fetch this from your backend/API.
  const stats: any[] = [];
  const recentActivity: any[] = [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-muted-foreground">
          Here's a summary of your investment portfolio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.length === 0 && (
           <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Capital</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(0)}</div>
                    <p className="text-xs text-muted-foreground">Make your first investment</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(0)}</div>
                    <p className="text-xs text-muted-foreground">Grows with your capital</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Withdrawable Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(0)}</div>
                    <p className="text-xs text-muted-foreground">Updated daily</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Referral Capital</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(0)}</div>
                    <p className="text-xs text-muted-foreground">Invite friends to earn</p>
                </CardContent>
            </Card>
           </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Grow Your Network</CardTitle>
            <CardDescription>
              Invite friends and earn commissions from their investments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your unique referral link:
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Generating your link..."
              />
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!referralLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>A log of your recent transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
                <ul className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{activity.type}</p>
                        <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">{activity.date}</div>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground text-center">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
