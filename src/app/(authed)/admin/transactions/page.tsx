
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import type { Transaction, User } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, getDoc, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import { handleTransactionApproval } from "@/lib/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";

type TransactionWithUser = Transaction & { userName: string; userEmail: string };

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionWithUser[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
        setLoading(true);
        const transactionsData: TransactionWithUser[] = [];
        for(const transactionDoc of snapshot.docs) {
            const data = transactionDoc.data() as Transaction;
            data.id = transactionDoc.id;
            
            // Fetch user info for each transaction
            let userName = "Unknown User";
            let userEmail = "N/A";
            if(data.userId) {
                const userRef = doc(db, "users", data.userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data() as User;
                    userName = userData.name;
                    userEmail = userData.email;
                }
            }
            transactionsData.push({ ...data, userName, userEmail });
        }
        setTransactions(transactionsData);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onAction = async (transactionId: string, newStatus: 'success' | 'failed') => {
    const result = await handleTransactionApproval({ transactionId, newStatus });
    if(result.success) {
        toast({ title: "Transaction Updated", description: `Transaction has been marked as ${newStatus}.`});
    } else {
        toast({ title: "Update Failed", description: result.error, variant: "destructive" });
    }
  }

   const getStatusVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading transactions...</TableCell>
                </TableRow>
            ) : transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                    <div className="font-medium">{tx.userName}</div>
                    <div className="text-sm text-muted-foreground">{tx.userEmail}</div>
                </TableCell>
                <TableCell className="font-medium capitalize">{tx.type}</TableCell>
                <TableCell>Ksh {tx.amount.toLocaleString()}</TableCell>
                <TableCell>{format(parseISO(tx.createdAt), 'PPp')}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(tx.status)} className="capitalize">
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell>
                    {tx.status === 'pending' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onAction(tx.id!, 'success')}>
                                Approve
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => onAction(tx.id!, 'failed')}>
                                Reject
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
