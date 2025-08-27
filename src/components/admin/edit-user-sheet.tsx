
"use client";

import { useState, useEffect } from "react";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal } from "lucide-react";

interface EditUserSheetProps {
  user?: User;
  onSave: (user: User) => void;
  children?: React.ReactNode;
}

export function EditUserSheet({ user, onSave, children }: EditUserSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [editedUser, setEditedUser] = useState<Partial<User>>(user || {});
  const [editedBalance, setEditedBalance] = useState(user?.wallet.balance || 0);
  const [isAdmin, setIsAdmin] = useState(user?.isAdmin || false);

  useEffect(() => {
    if (isOpen) {
        setEditedUser(user || {});
        setEditedBalance(user?.wallet.balance || 0);
        setIsAdmin(user?.isAdmin || false);
    }
  }, [isOpen, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [id]: value }));
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedBalance(Number(e.target.value));
  };
  
  const handleAdminChange = (checked: boolean) => {
    setIsAdmin(checked);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const finalUser = {
        ...(user || {}),
        ...editedUser,
        isAdmin,
        wallet: {
            ...(user?.wallet || { id: 0, userId: 0, totalRecharge: 0, totalWithdrawal: 0 }),
            balance: editedBalance
        }
    } as User

    onSave(finalUser);

    toast({
        title: user ? "User Updated" : "User Created",
        description: `Details for ${finalUser.name} have been saved.`,
    })
    setIsOpen(false);
  };
  
   const trigger = children ? (
    <SheetTrigger asChild>{children}</SheetTrigger>
  ) : (
    <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
        </Button>
    </SheetTrigger>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {trigger}
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{user ? `Edit User: ${user.name}` : "Add New User"}</SheetTitle>
            <SheetDescription>
              {user ? "Modify the user's details below." : "Fill in the details for the new user."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={editedUser.name || ''} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" value={editedUser.email || ''} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">
                Mobile
              </Label>
              <Input id="mobile" value={editedUser.mobile || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Balance (Ksh)
              </Label>
              <Input id="balance" type="number" value={editedBalance} onChange={handleBalanceChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-admin" className="text-right">
                Admin
              </Label>
              <Switch id="is-admin" checked={isAdmin} onCheckedChange={handleAdminChange} />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit">Save Changes</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
