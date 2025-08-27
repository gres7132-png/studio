
'use client';
import { allUsers as initialUsers } from "@/lib/data";
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
import { useState } from "react";
import type { User } from "@/lib/types";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);

    const handleSave = (newUser: User) => {
        if(newUser.id) {
            setUsers(users.map(u => u.id === newUser.id ? newUser : u));
        } else {
             // A real implementation would get a new ID from a database
            const newId = Math.max(...users.map(u => u.id)) + 1;
            const userWithId = {
                ...newUser,
                id: newId,
                wallet: { id: newId, userId: newId, balance: 0, totalRecharge: 0, totalWithdrawal: 0 },
                investments: [],
                transactions: [],
                referralsMade: [],
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
