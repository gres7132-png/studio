
"use client";

import { useState } from "react";
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
  user: User;
}

export function EditUserSheet({ user }: EditUserSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [editedUser, setEditedUser] = useState<Partial<User>>(user);
  const [editedBalance, setEditedBalance] = useState(user.wallet.balance);
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);

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
    // Here you would typically handle form submission, e.g., call an API
    console.log("Form submitted for user:", user.id, {
        ...editedUser,
        wallet: {
            ...user.wallet,
            balance: editedBalance
        },
        isAdmin
    });
    toast({
        title: "User Updated",
        description: `Details for ${user.name} have been saved.`,
    })
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </SheetTrigger>
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Edit User: {user.name}</SheetTitle>
            <SheetDescription>
              Modify the user's details below. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={editedUser.name} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" value={editedUser.email} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">
                Mobile
              </Label>
              <Input id="mobile" value={editedUser.mobile} onChange={handleInputChange} className="col-span-3" />
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
