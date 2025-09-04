
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

const distributorTiers = [
  { level: 'V1', monthlyIncome: 6500, purchasedProducts: 2, deposit: 39000 },
  { level: 'V2', monthlyIncome: 13000, purchasedProducts: 3, deposit: 78000 },
  { level: 'V3', monthlyIncome: 26000, purchasedProducts: 4, deposit: 156000 },
  { level: 'V4', monthlyIncome: 43333, purchasedProducts: 5, deposit: 260000 },
  { level: 'V5', monthlyIncome: 108333, purchasedProducts: 6, deposit: 650000 },
];

export default function ReferralsPage() {
  const totalDividends = 0;
  const pendingDividends = 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Dividends</h1>
        <p className="text-muted-foreground">
          View distributor levels and apply to become one.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-red-500 text-white">
          <CardHeader>
            <CardTitle>TOTAL DIVIDENDS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{formatCurrency(totalDividends)}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500 text-white">
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
          <CardTitle>Distributor</CardTitle>
          <CardDescription>
            Select a distributor level to apply for.
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
                    <Button variant="outline" size="sm">Apply</Button>
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
