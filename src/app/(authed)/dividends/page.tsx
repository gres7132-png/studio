
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { distributorLevels, getDistributorLevel } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DividendsPage() {
  const { user } = useAuth();

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
          Advance through distributor levels by growing your team and earn monthly rewards.
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
            <p className="text-lg">
              Monthly Dividend: <span className="font-bold text-green-600">Ksh {currentLevel.monthlyDividend.toLocaleString()}</span>
            </p>
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
            Each level has specific requirements for direct referrals and team size.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {distributorLevels.map((level) => (
            <Card key={level.level} className={cn(
                "p-4 transition-all",
                level.level === currentLevel.level ? 'border-primary ring-2 ring-primary shadow-lg' : 'border-border'
            )}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div className="font-bold text-lg text-primary">{level.level}</div>
                <div>
                  <div className="text-sm text-muted-foreground">Direct Referrals</div>
                  <div className="font-semibold">{level.referralsNeeded}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Required Team Size</div>
                  <div className="font-semibold">{level.requiredTeamSize}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Monthly Dividend</div>
                  <div className="font-semibold text-green-600">Ksh {level.monthlyDividend.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
