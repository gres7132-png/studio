'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Link as LinkIcon } from 'lucide-react';
import { QrCode } from '../icons';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import Link from 'next/link';

export function DepositForm() {
  const [method, setMethod] = useState('airtel');
  const cryptoAddress = '0x737f077D9F12f3c1DFf624f69046635C82b4A466';
  const minipayLink = 'https://link.minipay.xyz/invite?ref=lgBQTxG8';

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline font-bold">Make a Deposit</CardTitle>
        <CardDescription>
          Choose a payment method and enter the amount you wish to deposit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Payment Method</Label>
          <RadioGroup
            defaultValue="airtel"
            onValueChange={setMethod}
            className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="airtel" id="airtel" />
              <Label htmlFor="airtel">Airtel Money</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="minipay" id="minipay" />
              <Label htmlFor="minipay">MiniPay</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="crypto" id="crypto" />
              <Label htmlFor="crypto">Cryptocurrency (USDT)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (KES)</Label>
          <Input id="amount" type="number" placeholder="e.g., 1300" />
        </div>

        {method === 'airtel' && (
          <div className="space-y-4">
            <Alert>
              <AlertTitle className="font-headline font-bold">Airtel Money Instructions</AlertTitle>
              <AlertDescription>
                Send the exact amount to our Airtel number: <strong>0781309701</strong>.
                <br/>
                Then, paste the confirmation message below for verification.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
                <Label htmlFor="confirmation">Paste Airtel Confirmation Message</Label>
                <Textarea id="confirmation" placeholder="Paste the full Airtel Money confirmation message here for verification." />
            </div>
          </div>
        )}

        {method === 'minipay' && (
            <div className="space-y-4">
                <Alert>
                <AlertTitle className="font-headline font-bold">MiniPay Instructions</AlertTitle>
                <AlertDescription>
                    Click the link below to pay with MiniPay. The number <strong>0781309701</strong> can receive from MiniPay.
                </AlertDescription>
                </Alert>
                <Button asChild className="w-full">
                    <Link href={minipayLink} target="_blank">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Pay with MiniPay
                    </Link>
                </Button>
            </div>
        )}

        {method === 'crypto' && (
          <div className="space-y-4">
             <Alert>
              <AlertTitle className="font-headline font-bold">Cryptocurrency (USDT) Payment</AlertTitle>
              <AlertDescription>
                Send the exact USDT amount to the wallet address below (Celo Network).
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
