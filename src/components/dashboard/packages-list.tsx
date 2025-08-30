
'use client';

import type { Package } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { handleInvestment } from '@/lib/actions';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface PackagesListProps {
  packages: Package[];
}

export function PackagesList({ packages }: PackagesListProps) {
    const { authUser } = useAuth();
    const { toast } = useToast();
    const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);

    const onPurchase = async (pkg: Package) => {
        if (!authUser) {
            toast({ title: "Please log in to make a purchase.", variant: "destructive" });
            return;
        }

        setLoadingPackageId(pkg.id);
        const result = await handleInvestment({
            userId: authUser.uid,
            packageId: pkg.id,
        });

        if (result.success) {
            toast({
                title: "Purchase Successful!",
                description: `You have successfully purchased the ${pkg.name} package.`,
            });
        } else {
            toast({
                title: "Purchase Failed",
                description: result.error,
                variant: "destructive",
            });
        }
        setLoadingPackageId(null);
    }


  return (
    <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <Card key={pkg.id} className="flex flex-col overflow-hidden shadow-lg transition-transform hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline text-xl font-bold">{pkg.name}</CardTitle>
             <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md self-start">
                Ksh {pkg.price.toLocaleString()}
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
            <p>{pkg.description}</p>
            <div className="flex justify-between border-t pt-2">
              <span>Daily Return:</span>
              <span className="font-semibold text-foreground">Ksh {pkg.dailyReturn}</span>
            </div>
             <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-semibold text-foreground">{pkg.durationDays} days</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total Return:</span>
              <span className="text-primary">Ksh {pkg.totalReturn.toLocaleString()}</span>
            </div>
          </CardContent>
          <CardFooter>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loadingPackageId === pkg.id}>
                        {loadingPackageId === pkg.id ? 'Processing...' : 'Purchase Rights'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to purchase the "{pkg.name}" package for Ksh {pkg.price.toLocaleString()}? This amount will be deducted from your wallet balance.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onPurchase(pkg)}>
                        Confirm Purchase
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
