
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User, Transaction } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalInvestments, setTotalInvestments] = useState(0);
    const [totalTransactionValue, setTotalTransactionValue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            // Fetch all users
            const usersQuery = query(collection(db, "users"));
            const usersSnapshot = await getDocs(usersQuery);
            const usersData = usersSnapshot.docs.map(doc => doc.data() as User);
            
            const totalInvestmentsCount = usersData.reduce((acc, user) => acc + (user.investments?.length || 0), 0);
            setTotalUsers(usersData.length);
            setTotalInvestments(totalInvestmentsCount);

            // Fetch all successful transactions
            const transactionsQuery = query(collection(db, "transactions"));
            const transactionsSnapshot = await getDocs(transactionsQuery);
            const transactionValue = transactionsSnapshot.docs
                .map(doc => doc.data() as Transaction)
                .filter(tx => tx.status === 'success' && (tx.type === 'deposit' || tx.type === 'investment' || tx.type === 'distributorship'))
                .reduce((sum, tx) => sum + tx.amount, 0);

            setTotalTransactionValue(transactionValue);
            setLoading(false);
        };

        fetchStats();
        
        // Optional: Set up listeners for real-time updates
        const usersUnsub = onSnapshot(collection(db, "users"), (snapshot) => {
             const usersData = snapshot.docs.map(doc => doc.data() as User);
             const totalInvestmentsCount = usersData.reduce((acc, user) => acc + (user.investments?.length || 0), 0);
             setTotalUsers(snapshot.size);
             setTotalInvestments(totalInvestmentsCount);
        });

        const transUnsub = onSnapshot(collection(db, "transactions"), (snapshot) => {
            const transactionValue = snapshot.docs
                .map(doc => doc.data() as Transaction)
                .filter(tx => tx.status === 'success' && (tx.type === 'deposit' || tx.type === 'investment' || tx.type === 'distributorship'))
                .reduce((sum, tx) => sum + tx.amount, 0);
            setTotalTransactionValue(transactionValue);
        });


        return () => {
            usersUnsub();
            transUnsub();
        };

    }, []);

    const stats = [
        { title: "Total Users", value: totalUsers.toLocaleString(), icon: Users },
        { title: "Total Investments", value: totalInvestments.toLocaleString(), icon: Package },
        { title: "Total Revenue", value: `Ksh ${totalTransactionValue.toLocaleString()}`, icon: HandCoins },
    ];

    if (loading) {
        return (
             <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
            </div>
        )
    }

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
