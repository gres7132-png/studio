
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { handleTransaction } from '@/lib/actions';


interface WithdrawFormProps {
    currentBalance: number;
}

export function WithdrawForm({ currentBalance }: WithdrawFormProps) {
  const { authUser } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!authUser || !amount || !details) {
      toast({ title: "Please fill all fields.", variant: "destructive" });
      return;
    }
     if (parseFloat(amount) > currentBalance) {
      toast({ title: "Insufficient balance.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    const result = await handleTransaction({
      userId: authUser.uid,
      type: 'withdrawal',
      amount: parseFloat(amount),
      paymentMethod: details,
    });

    if (result.success) {
      toast({
        title: "Withdrawal Submitted",
        description: "Your withdrawal request has been received and is being processed.",
      });
      setAmount('');
      setDetails('');
    } else {
      toast({
        title: "Withdrawal Failed",
        description: result.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline font-bold">Request a Withdrawal</CardTitle>
        <CardDescription>
          Withdraw funds to your Airtel or Crypto wallet. Minimum withdrawal is Ksh 100. A 15% facilitation fee applies to all withdrawals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Amount (KES)</Label>
            <Input 
              id="withdraw-amount" 
              type="number" 
              placeholder="e.g., 5000" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Available for withdrawal: Ksh {currentBalance.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="withdraw-details">Withdrawal Details</Label>
            <Input 
              id="withdraw-details" 
              placeholder="Enter your Airtel number or USDT address" 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" size="lg" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Request Withdrawal'}
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}
