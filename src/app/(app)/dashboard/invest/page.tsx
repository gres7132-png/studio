
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { silverLevelPackages } from "@/lib/config";

const userBalance = 0; // This should be fetched from your backend.

export default function InvestPage() {
  const { toast } = useToast();

  const handleInvestment = (packageName: string, price: number) => {
    if (userBalance < price) {
        toast({
            variant: "destructive",
            title: "Insufficient Funds",
            description: "Please make a deposit to invest in this package.",
        });
    } else {
        // This is where you would open a confirmation popup/modal.
        // The modal would call a backend function to process the investment.
        console.log("Proceeding with investment...");
        // For now, we will just log it and show a success toast.
        toast({
            title: "Investment Successful!",
            description: `You have invested in ${packageName}.`,
        });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Center</h1>
        <p className="text-muted-foreground">
          Invest in a Silver Level package to start earning daily.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {silverLevelPackages.map((pkg) => (
          <Card
            key={pkg.name}
            className="flex flex-col transform hover:scale-105 transition-transform duration-300"
          >
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription>
                Invest {formatCurrency(pkg.price)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4 text-sm">
                <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Daily Return</span>
                    <span className="font-bold text-lg text-primary">{formatCurrency(pkg.dailyReturn)}</span>
                </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">{pkg.duration} Days</span>
                </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Total Earnings</span>
                    <span className="font-bold text-accent">{formatCurrency(pkg.totalReturn)}</span>
                </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-foreground text-background hover:bg-foreground/90"
                onClick={() => handleInvestment(pkg.name, pkg.price)}
              >
                Invest Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {silverLevelPackages.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Investment packages will be available soon. Please check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
