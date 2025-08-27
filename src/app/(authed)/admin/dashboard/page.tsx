import { allUsers, packages } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, HandCoins } from "lucide-react";

export default function AdminDashboardPage() {
    const totalUsers = allUsers.length;
    const totalInvestments = allUsers.reduce((acc, user) => acc + user.investments.length, 0);
    const totalTransactionValue = allUsers.reduce((acc, user) => {
        return acc + user.transactions
            .filter(tx => tx.status === 'success')
            .reduce((sum, tx) => sum + tx.amount, 0);
    }, 0);


    const stats = [
        { title: "Total Users", value: totalUsers, icon: Users },
        { title: "Total Investments", value: totalInvestments, icon: Package },
        { title: "Successful Transactions", value: `$${totalTransactionValue.toLocaleString()}`, icon: HandCoins },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map(stat => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
