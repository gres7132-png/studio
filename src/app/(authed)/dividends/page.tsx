
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { distributorLevels, getDistributorLevel } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { handleDistributorshipPurchase } from '@/lib/actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function DividendsPage() {
  const { user, authUser } = useAuth();
  const { toast } = useToast();
  const [loadingLevel, setLoadingLevel] = useState<string | null>(null);

  const handlePurchase = async (level: string) => {
    if (!authUser) return;
    setLoadingLevel(level);

    const result = await handleDistributorshipPurchase({ userId: authUser.uid, level });

    if (result.success) {
      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased the ${level} distributorship.`,
      });
    } else {
      toast({
        title: "Purchase Failed",
        description: result.error,
        variant: "destructive",
      });
    }
    setLoadingLevel(null);
  };

  if (!user) {
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

  const { currentLevel, nextLevel, progress } = getDistributorLevel(user);
  const referralCount = user.referralsMade?.length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-headline font-bold md:text-3xl">Company Dividends</h1>
        <p className="text-muted-foreground">
          Unlock exclusive distributorship levels by growing your team. Purchase your unlocked tier to start earning monthly dividends.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl font-bold">
              <Trophy className="text-yellow-500" />
              Your Current Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-5xl font-bold text-primary">{currentLevel.level}</p>
            <p className="text-muted-foreground">
              You have <span className="font-bold text-foreground">{referralCount}</span> direct referrals.
            </p>
             {user.purchasedDividendLevel ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold pt-2">
                    <CheckCircle2 />
                    <span>{user.purchasedDividendLevel} Distributorship Active</span>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground pt-2">You have not purchased a distributorship yet.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl font-bold">Next Level Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {nextLevel ? (
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <p className="text-2xl font-bold text-primary">{nextLevel.level}</p>
                  <p className="text-sm text-muted-foreground">
                    {referralCount} / {nextLevel.referralsNeeded} Referrals
                  </p>
                </div>
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground">
                  You need <span className="font-bold text-foreground">{nextLevel.referralsNeeded - referralCount}</span> more referrals to reach the next level and earn <span className="font-bold text-green-600">Ksh {nextLevel.monthlyDividend.toLocaleString()}</span> per month.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                 <Trophy className="size-12 text-yellow-500" />
                 <p className="mt-4 text-lg font-bold">Congratulations!</p>
                 <p className="text-muted-foreground">You have reached the highest distributor level.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl font-bold">Distributor Levels & Rewards</CardTitle>
          <CardDescription>
            Once you meet the referral requirement for a level, you can purchase the distributorship to start earning monthly dividends. You can only purchase one distributorship.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {distributorLevels.map((level) => {
            const isUnlocked = referralCount >= level.referralsNeeded;
            const isPurchased = user.purchasedDividendLevel === level.level;
            const canPurchase = isUnlocked && !user.purchasedDividendLevel && level.purchasePrice > 0;

            return (
                <Card key={level.level} className={cn(
                    "p-4 transition-all",
                    level.level === user.purchasedDividendLevel ? 'border-primary ring-2 ring-primary shadow-lg' : 'border-border'
                )}>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                    <div className="font-bold text-lg text-primary">{level.level}</div>
                    <div>
                    <div className="text-sm text-muted-foreground">Direct Referrals</div>
                    <div className="font-semibold">{level.referralsNeeded}</div>
                    </div>
                    <div>
                    <div className="text-sm text-muted-foreground">Purchase Price</div>
                    <div className="font-semibold">Ksh {level.purchasePrice.toLocaleString()}</div>
                    </div>
                    <div>
                    <div className="text-sm text-muted-foreground">Monthly Dividend</div>
                    <div className="font-semibold text-green-600">Ksh {level.monthlyDividend.toLocaleString()}</div>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                        {isPurchased ? (
                            <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                                <CheckCircle2 />
                                <span>Purchased</span>
                            </div>
                        ) : canPurchase ? (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" disabled={loadingLevel === level.level}>
                                        {loadingLevel === level.level ? "Processing..." : "Purchase"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to purchase the "{level.level}" distributorship for Ksh {level.purchasePrice.toLocaleString()}? This amount will be deducted from your wallet balance.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handlePurchase(level.level)}>
                                        Confirm Purchase
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ) : (
                           <Button size="sm" variant="outline" disabled>
                            {isUnlocked ? "Unavailable" : "Locked"}
                          </Button>
                        )}
                    </div>
                </div>
                </Card>
            )})}
        </CardContent>
      </Card>
    </div>
  );
}
