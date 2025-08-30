
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EditUserSheet } from "@/components/admin/edit-user-sheet";
import { useState, useEffect } from "react";
import type { User } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, addDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
            setUsers(usersData);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (updatedUser: User) => {
        try {
            if (updatedUser.id) {
                 const userDocRef = doc(db, "users", updatedUser.id as string);
                 // We remove the id from the object before saving to firestore
                 const { id, ...userData } = updatedUser;
                 await setDoc(userDocRef, userData, { merge: true });
            } else {
                // In a real app, adding users would be more complex (e.g. need auth credentials)
                // This is a simplified version for adding users manually.
                await addDoc(collection(db, "users"), updatedUser);
            }
             toast({
                title: "User Saved",
                description: `Details for ${updatedUser.name} have been successfully saved.`,
            });
        } catch (error) {
            console.error("Error saving user: ", error);
             toast({
                title: "Save Failed",
                description: "There was an error saving the user details.",
                variant: "destructive",
            });
        }
    }


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <EditUserSheet onSave={handleSave}>
            <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
            </Button>
        </EditUserSheet>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                    <div className="flex items-center gap-3">
                       <Avatar className="h-9 w-9">
                         <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div className="font-medium">
                        {user.name}
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                       </div>
                    </div>
                </TableCell>
                <TableCell>
                    {user.isAdmin ? (
                        <Badge variant="destructive">Admin</Badge>
                    ) : (
                        <Badge variant="outline">User</Badge>
                    )}
                </TableCell>
                <TableCell>Ksh {user.wallet.balance.toLocaleString()}</TableCell>
                <TableCell>
                    <EditUserSheet user={user} onSave={handleSave} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
