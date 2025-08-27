import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUser } from '@/lib/data';
import { DepositForm } from '@/components/wallet/deposit-form';
import { WithdrawForm } from '@/components/wallet/withdraw-form';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet as WalletIcon } from 'lucide-react';

export default function WalletPage() {
  const { wallet, transactions } = mockUser;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-headline md:text-3xl">My Wallet</h1>
        <p className="text-muted-foreground">
          Manage your funds, deposits, and withdrawals.
        </p>
      </div>

       <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                <WalletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-primary">Ksh {wallet.balance.toLocaleString()}</div>
            </CardContent>
        </Card>

      <Tabs defaultValue="deposit">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdrawal">Withdraw</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
            <DepositForm />
        </TabsContent>
        <TabsContent value="withdrawal">
            <WithdrawForm currentBalance={wallet.balance} />
        </TabsContent>
      </Tabs>
      
       <div>
        <h2 className="text-xl font-headline md:text-2xl">Wallet History</h2>
        <RecentTransactions transactions={transactions} />
      </div>

    </div>
  );
}
