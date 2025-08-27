
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface EditUserSheetProps {
  user: User;
  children: React.ReactNode;
}

export function EditUserSheet({ user, children }: EditUserSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically handle form submission, e.g., call an API
    console.log("Form submitted for user:", user.id);
    toast({
        title: "User Updated",
        description: `Details for ${user.name} have been saved.`,
    })
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
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
              <Input id="name" defaultValue={user.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" defaultValue={user.email} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">
                Mobile
              </Label>
              <Input id="mobile" defaultValue={user.mobile} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Balance (Ksh)
              </Label>
              <Input id="balance" type="number" defaultValue={user.wallet.balance} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-admin" className="text-right">
                Admin
              </Label>
              <Switch id="is-admin" defaultChecked={user.isAdmin} />
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
