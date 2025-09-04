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
import { Users, DollarSign, Percent } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const referrals = [
  {
    name: "Alice Johnson",
    date: "2023-10-15",
    capital: 5000,
    status: "Active",
  },
  {
    name: "Bob Williams",
    date: "2023-09-22",
    capital: 1000,
    status: "Active",
  },
  {
    name: "Charlie Brown",
    date: "2023-09-01",
    capital: 10000,
    status: "Active",
  },
  {
    name: "Diana Miller",
    date: "2023-08-19",
    capital: 0,
    status: "Pending",
  },
    {
    name: "Eve Davis",
    date: "2023-07-05",
    capital: 2500,
    status: "Active",
  },
];

const totalReferrals = referrals.length;
const totalReferralCapital = referrals.reduce((acc, ref) => acc + ref.capital, 0);

export default function ReferralsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referral Program</h1>
        <p className="text-muted-foreground">
          Track your referral network and earnings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              +2 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Referral Capital
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalReferralCapital)}
            </div>
            <p className="text-xs text-muted-foreground">
              Invested by your network
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Commission
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(925)}</div>
            <p className="text-xs text-muted-foreground">
              Earned this year
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>
            A list of users who joined using your link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invested Capital</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.name}>
                  <TableCell className="font-medium">{referral.name}</TableCell>
                  <TableCell>{referral.date}</TableCell>
                  <TableCell>
                    <Badge variant={referral.status === 'Active' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(referral.capital, true)}
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
