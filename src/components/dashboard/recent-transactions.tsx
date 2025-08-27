import type { Transaction } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface RecentTransactionsProps {
  transactions: Transaction[];
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

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="mt-4 shadow-md">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium capitalize">{tx.type}</TableCell>
                <TableCell>{tx.paymentMethod}</TableCell>
                <TableCell>Ksh {tx.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(tx.status)} className="capitalize">
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(parseISO(tx.createdAt), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
