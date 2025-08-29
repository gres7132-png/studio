
'use client';
import { allUsers as initialUsersData } from "@/lib/data";
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
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
            setUsers(usersData);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = (newUser: User) => {
        // This would be handled by a server action or API route in a real app
        // For now, we update the local state to see the change immediately
        if(users.find(u => u.id === newUser.id)) {
            setUsers(users.map(u => u.id === newUser.id ? newUser : u));
        } else {
            // A real implementation would get a new ID from a database
            const userWithId = {
                ...newUser,
                id: Math.random(), // temporary ID
            };
            setUsers([...users, userWithId]);
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
