'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { QrCode } from '../icons';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function DepositForm() {
  const [method, setMethod] = useState('mpesa');
  const cryptoAddress = '0xAbC...dE42Fg';

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline">Make a Deposit</CardTitle>
        <CardDescription>
          Choose a payment method and enter the amount you wish to deposit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Payment Method</Label>
          <RadioGroup
            defaultValue="mpesa"
            onValueChange={setMethod}
            className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mpesa" id="mpesa" />
              <Label htmlFor="mpesa">M-Pesa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="crypto" id="crypto" />
              <Label htmlFor="crypto">Cryptocurrency (USDT)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USD)</Label>
          <Input id="amount" type="number" placeholder="e.g., 100" />
        </div>

        {method === 'mpesa' && (
          <div className="space-y-4">
            <Alert>
              <AlertTitle className="font-headline">M-Pesa Payment Instructions</AlertTitle>
              <AlertDescription>
                1. Go to your M-Pesa menu.
                <br />
                2. Select "Lipa na M-Pesa".
                <br />
                3. Select "Pay Bill" and enter business number: <strong>400200</strong>.
                <br />
                4. Enter account number: <strong>BALENCIA</strong>.
                <br />
                5. Enter the equivalent amount in KES.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
                <Label htmlFor="confirmation">Paste M-Pesa Confirmation Message</Label>
                <Textarea id="confirmation" placeholder="Paste the full M-Pesa confirmation message here for verification." />
            </div>
          </div>
        )}

        {method === 'crypto' && (
          <div className="space-y-4">
             <Alert>
              <AlertTitle className="font-headline">Cryptocurrency (USDT) Payment</AlertTitle>
              <AlertDescription>
                Send the exact USDT amount to the wallet address below (TRC-20 Network).
              </AlertDescription>
            </Alert>
            <div className="flex flex-col items-center gap-4 rounded-lg border p-4">
                <QrCode className="size-32" />
                 <div className="flex w-full items-center space-x-2">
                    <Input value={cryptoAddress} readOnly className="font-mono"/>
                    <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="tx-hash">Transaction Hash (Optional)</Label>
                <Input id="tx-hash" placeholder="Paste transaction hash for faster confirmation" />
            </div>
          </div>
        )}
        
        <Button className="w-full" size="lg">Submit Deposit</Button>
      </CardContent>
    </Card>
  );
}
