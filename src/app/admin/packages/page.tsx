
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
import { PlusCircle } from "lucide-react";
import { EditPackageSheet } from "@/components/admin/edit-package-sheet";
import { useState, useEffect } from "react";
import type { Package } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "packages"), (snapshot) => {
        const packagesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Package));
        setPackages(packagesData);
    });
    return () => unsubscribe();
  }, []);


  const handleSave = async (newPackage: Package) => {
    try {
        if(newPackage.id) {
            const packageDocRef = doc(db, "packages", newPackage.id);
            const { id, ...packageData } = newPackage;
            await setDoc(packageDocRef, packageData);
        } else {
            await addDoc(collection(db, "packages"), newPackage);
        }
        toast({
            title: newPackage.id ? "Package Updated" : "Package Created",
            description: `Package "${newPackage.name}" has been saved.`,
        });
    } catch(e) {
        console.error("Error saving package: ", e);
        toast({ title: "Save Failed", variant: "destructive" });
    }
  }

  const handleDelete = async (packageId: string) => {
     try {
        await deleteDoc(doc(db, "packages", packageId));
        toast({ title: "Package Deleted", variant: "destructive" });
    } catch (e) {
        console.error("Error deleting package: ", e);
        toast({ title: "Delete Failed", variant: "destructive" });
    }
  }

  const handleToggleStatus = async (pkg: Package) => {
      try {
        const packageDocRef = doc(db, "packages", pkg.id);
        await updateDoc(packageDocRef, { isActive: !pkg.isActive });
        toast({ title: "Status Toggled"});
      } catch (e) {
        console.error("Error toggling status: ", e);
        toast({ title: "Toggle Failed", variant: "destructive" });
      }
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
                        onToggleStatus={() => handleToggleStatus(pkg)}
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
