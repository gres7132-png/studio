import type { Package } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Tag } from 'lucide-react';

interface PackagesListProps {
  packages: Package[];
}

export function PackagesList({ packages }: PackagesListProps) {
  return (
    <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <Card key={pkg.id} className="flex flex-col overflow-hidden shadow-lg transition-transform hover:scale-105">
          <div className="relative h-48 w-full">
            <Image
              src={`${pkg.image}/?random=${pkg.id}`}
              alt={pkg.name}
              fill
              className="object-cover"
              data-ai-hint="t-shirt fashion"
            />
             <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md">
                ${pkg.price.toLocaleString()}
            </div>
          </div>
          <CardHeader>
            <CardTitle className="font-headline text-xl">{pkg.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
            <p>{pkg.description}</p>
            <div className="flex justify-between border-t pt-2">
              <span>Daily Return:</span>
              <span className="font-semibold text-foreground">${pkg.dailyReturn}</span>
            </div>
             <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-semibold text-foreground">{pkg.durationDays} days</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total Return:</span>
              <span className="text-primary">${pkg.totalReturn.toLocaleString()}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Purchase Rights <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
