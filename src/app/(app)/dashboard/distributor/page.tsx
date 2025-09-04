
"use client";

import { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { distributorTiers } from "@/lib/config";

// In a real application, these values would be fetched from your backend.
const referredUsersCount = 0; 
const userBalance = 0; 

type Tier = typeof distributorTiers[0];

export default function DistributorPage() {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  
  // These values should be fetched from your backend.
  const totalDividends = 0;
  const pendingDividends = 0;

  const handleApplyClick = (tier: Tier) => {
    if (userBalance < tier.deposit) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: "Please make a deposit to apply for this level.",
      });
    } else {
      setSelectedTier(tier);
    }
  };

  const handleConfirmApply = async () => {
    if (!selectedTier) return;

    setIsApplying(true);
    
    // --- Backend Logic Placeholder ---
    // Here you would call a backend function to:
    // 1. Deduct the deposit from the user's balance.
    // 2. Mark the user as having applied for the distributor level.
    // 3. Handle any potential errors from the backend.
    // e.g., await applyForDistributor(selectedTier.level);
    console.log(`Processing application for ${selectedTier.level}...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsApplying(false);
    setSelectedTier(null);

    toast({
      title: "Application Successful!",
      description: `You have applied for the ${selectedTier.level} distributor level. Your application is now pending approval.`,
    });
  };

  const handleCancelApply = () => {
    setSelectedTier(null);
  };

  return (
    <>
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
                        onClick={() => handleApplyClick(tier)}
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
      
      {selectedTier && (
        <AlertDialog open onOpenChange={handleCancelApply}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to apply for the <span className="font-bold">{selectedTier.level}</span> distributor level? The deposit of <span className="font-bold">{formatCurrency(selectedTier.deposit)}</span> will be deducted from your available balance. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancelApply} disabled={isApplying}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmApply} disabled={isApplying}>
                  {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isApplying ? "Applying..." : "Confirm & Apply"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
