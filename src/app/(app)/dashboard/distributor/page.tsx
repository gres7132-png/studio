
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// The figures are now in KES and will be converted to USD for display.
const distributorTiers = [
  { level: 'V1', monthlyIncome: 6500, purchasedProducts: 2, deposit: 39000 },
  { level: 'V2', monthlyIncome: 13000, purchasedProducts: 3, deposit: 78000 },
  { level: 'V3', monthlyIncome: 26000, purchasedProducts: 4, deposit: 156000 },
  { level: 'V4', monthlyIncome: 43333, purchasedProducts: 5, deposit: 260000 },
  { level: 'V5', monthlyIncome: 108333, purchasedProducts: 6, deposit: 650000 },
];

// Mock data to simulate whether the user has met the prerequisite.
// In a real application, this would be determined by checking the database.
const referredUsersCount = 2; // Change to 1 or 0 to see the prerequisite message.

// This should be fetched from your backend.
const userBalance = 0; 

export default function DistributorPage() {
  const { toast } = useToast();
  const totalDividends = 0;
  const pendingDividends = 0;

  const handleApply = (level: string, deposit: number) => {
    if (userBalance < deposit) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: "Please make a deposit to apply for this level.",
      });
    } else {
      // This is where you would open a confirmation popup/modal.
      // The modal would call a backend function to process the application.
      console.log(`Proceeding with application for ${level}...`);
      toast({
        title: "Application Successful!",
        description: `You have applied for the ${level} distributor level.`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Golden Level Distributor Program</h1>
        <p className="text-muted-foreground">
          View Golden Level distributor levels and apply to become one for monthly dividends.
        </p>
      </div>

      {referredUsersCount < 2 && (
        <Alert>
            <Users className="h-4 w-4" />
            <AlertTitle>Prerequisite Not Met</AlertTitle>
            <AlertDescription>
                You must refer at least two users who have made an investment before you can apply to become a distributor.
            </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>TOTAL DIVIDENDS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{formatCurrency(totalDividends)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PENDING DIVIDENDS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{formatCurrency(pendingDividends)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Golden Level Tiers</CardTitle>
          <CardDescription>
            Select a distributor level to apply for. Your application is subject to approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Monthly Income</TableHead>
                <TableHead>Purchased Products</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributorTiers.map((tier) => (
                <TableRow key={tier.level}>
                  <TableCell className="font-medium">
                    <Badge variant="secondary">{tier.level}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(tier.monthlyIncome)}</TableCell>
                  <TableCell>{tier.purchasedProducts}</TableCell>
                  <TableCell>{formatCurrency(tier.deposit)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={referredUsersCount < 2}
                      onClick={() => handleApply(tier.level, tier.deposit)}
                    >
                      Apply
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
