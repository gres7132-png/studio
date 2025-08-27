'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface WithdrawFormProps {
    currentBalance: number;
}

export function WithdrawForm({ currentBalance }: WithdrawFormProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline">Request a Withdrawal</CardTitle>
        <CardDescription>
          Withdraw funds to your Airtel or Crypto wallet. Minimum withdrawal is Ksh 100. A 15% facilitation fee applies to all withdrawals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="withdraw-amount">Amount (KES)</Label>
          <Input id="withdraw-amount" type="number" placeholder="e.g., 5000" />
          <p className="text-sm text-muted-foreground">
            Available for withdrawal: Ksh {currentBalance.toLocaleString()}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="withdraw-details">Withdrawal Details</Label>
          <Input id="withdraw-details" placeholder="Enter your Airtel number or USDT address" />
        </div>
        <Button className="w-full" size="lg">Request Withdrawal</Button>
      </CardContent>
    </Card>
  );
}
