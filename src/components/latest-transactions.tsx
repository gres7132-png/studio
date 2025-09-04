
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

// This would be fetched from your backend
interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  userName: string;
  amountKsh: number;
  amountUsd: number;
  timestamp: string;
  avatar: string;
}

// In a real app, you would fetch this data from your backend
// e.g., const { data } = useSWR('/api/transactions', fetcher)
const getLatestTransactions = async (): Promise<Transaction[]> => {
    // --- Backend Data Fetching Placeholder ---
    // Simulating a network request
    // await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real implementation, you would make a fetch call:
    // const response = await fetch('/api/latest-transactions');
    // if (!response.ok) throw new Error('Network response was not ok');
    // return await response.json();

    return []; // Start with an empty list
};


const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
    const isDeposit = transaction.type === 'deposit';
    
    return (
        <div className="flex items-center gap-4 py-3 border-b last:border-b-0">
            <Avatar className="h-10 w-10">
                <AvatarImage src={transaction.avatar} data-ai-hint="person avatar"/>
                <AvatarFallback>{transaction.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="font-semibold">{transaction.userName}</p>
                <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
            </div>
            <div className="text-right">
                <p className={`font-bold flex items-center gap-1.5 ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
                    {isDeposit ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />}
                    {formatCurrency(transaction.amountKsh, transaction.amountUsd, true)}
                </p>
                <p className="text-xs text-muted-foreground">
                    {isDeposit ? "Just Deposited" : "Just Withdrew"}
                </p>
            </div>
        </div>
    )
}

export default function LatestTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await getLatestTransactions();
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            // Optionally set an error state here
        } finally {
            setLoading(false);
        }
    };

    fetchTransactions();
  }, []);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Latest Transactions</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                {loading && (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <div className="text-right space-y-1">
                                <Skeleton className="h-4 w-20 ml-auto" />
                                <Skeleton className="h-3 w-14 ml-auto" />
                            </div>
                        </div>
                    ))
                )}
                {!loading && transactions.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                        No recent transactions to display.
                    </p>
                )}
                {!loading && transactions.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
