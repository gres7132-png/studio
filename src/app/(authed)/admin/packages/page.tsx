
'use client';
import { packages as initialPackages } from "@/lib/data";
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
import { PlusCircle } from "lucide-react";
import { EditPackageSheet } from "@/components/admin/edit-package-sheet";
import { useState } from "react";
import type { Package } from "@/lib/types";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>(initialPackages);

  const handleSave = (newPackage: Package) => {
    if(newPackage.id) {
        setPackages(packages.map(p => p.id === newPackage.id ? newPackage : p))
    } else {
        // A real implementation would get a new ID from a database
        const newId = Math.max(...packages.map(p => p.id)) + 1;
        setPackages([...packages, {...newPackage, id: newId}]);
    }
  }

  const handleDelete = (packageId: number) => {
    setPackages(packages.filter(p => p.id !== packageId));
  }

  const handleToggleStatus = (packageId: number) => {
      setPackages(packages.map(p => p.id === packageId ? {...p, isActive: !p.isActive} : p));
  }


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Marketing Packages</CardTitle>
        <EditPackageSheet onSave={handleSave}>
            <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Package
            </Button>
        </EditPackageSheet>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Daily Return</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>Ksh {pkg.price.toLocaleString()}</TableCell>
                <TableCell>Ksh {pkg.dailyReturn.toLocaleString()}</TableCell>
                <TableCell>{pkg.durationDays} days</TableCell>
                <TableCell>
                  <Badge variant={pkg.isActive ? 'default' : 'destructive'}>
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                   <EditPackageSheet 
                        pkg={pkg} 
                        onSave={handleSave} 
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                    />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
