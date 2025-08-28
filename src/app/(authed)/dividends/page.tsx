

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { distributorLevels, mockUser } from "@/lib/data";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function DividendsPage() {
    const [pendingDividends, setPendingDividends] = useState(5000); // Mocked pending dividends
    const { toast } = useToast();

    const handleReleaseDividends = () => {
        if (pendingDividends > 0) {
            // In a real app, this would trigger an API call to process the withdrawal.
            // For now, we just simulate it.
            toast({
                title: "Withdrawal Initiated",
                description: `Your request to withdraw Ksh ${pendingDividends.toLocaleString()} has been submitted. It may take up to 4 working days to process.`,
            });
            setPendingDividends(0);
        } else {
            toast({
                title: "No Pending Dividends",
                description: "You have no pending dividends to withdraw.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-headline font-bold md:text-3xl">Company Dividends</h1>
                <p className="text-muted-foreground">
                    View and manage your distributor dividends.
                </p>
            </div>

            <Alert>
                <AlertDescription>
                    Please note: Dividend releases may take up to 4 working days to process.
                </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-md bg-red-600 text-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold">TOTAL DIVIDENDS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">
                            KSH 0
                        </p>
                    </CardContent>
                </Card>
                 <Card className="shadow-md bg-green-500 text-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold">PENDING DIVIDENDS</CardTitle>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white" disabled={pendingDividends === 0}>
                                    Apply for Release
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Dividend Withdrawal</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to withdraw your pending dividends of Ksh {pendingDividends.toLocaleString()}? This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleReleaseDividends}>
                                    Confirm Withdrawal
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                         </AlertDialog>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">
                            KSH {pendingDividends.toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="font-headline font-bold">Distributor Levels</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Level</TableHead>
                                <TableHead>Monthly Dividend</TableHead>
                                <TableHead>Purchased Products</TableHead>
                                <TableHead>Deposit</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {distributorLevels.map((level) => (
                                <TableRow key={level.level}>
                                    <TableCell className="font-medium">{level.level}</TableCell>
                                    <TableCell>Ksh {level.monthlyDividend.toLocaleString()}</TableCell>
                                    <TableCell>{level.purchasedProducts}</TableCell>
                                    <TableCell>Ksh {level.deposit.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                            <Link href="/wallet">Apply</Link>
                                        </Button>
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
