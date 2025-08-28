import type { Package } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PackagesListProps {
  packages: Package[];
}

export function PackagesList({ packages }: PackagesListProps) {
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
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/wallet">
                Purchase Rights <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
