

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { distributorLevels } from "@/lib/data";

export default function DividendsPage() {

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-headline md:text-3xl">Company Dividends</h1>
                <p className="text-muted-foreground">
                    View and manage your distributor dividends.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-md bg-red-600 text-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">TOTAL DIVIDENDS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">
                            KSH 0
                        </p>
                    </CardContent>
                </Card>
                 <Card className="shadow-md bg-green-500 text-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold">PENDING DIVIDENDS</CardTitle>
                         <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">Apply for Release</Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">
                            KSH 0
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="font-headline">Distributor Levels</CardTitle>
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
                                        <Button variant="secondary" size="sm">Apply</Button>
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
