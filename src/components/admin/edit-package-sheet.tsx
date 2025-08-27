
"use client";

import { useState } from "react";
import type { Package } from "@/lib/types";
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
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Trash } from "lucide-react";
import { Switch } from "../ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";

interface EditPackageSheetProps {
  pkg?: Package;
  onSave: (pkg: Package) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
  children?: React.ReactNode;
}

export function EditPackageSheet({ pkg, onSave, onDelete, onToggleStatus, children }: EditPackageSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [editedPackage, setEditedPackage] = useState<Partial<Package>>(pkg || { isActive: true });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const isNumber = type === 'number';
    setEditedPackage((prev) => ({ ...prev, [id]: isNumber ? Number(value) : value }));
  };

  const handleActiveChange = (checked: boolean) => {
    setEditedPackage((prev) => ({ ...prev, isActive: checked }));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const totalReturn = (editedPackage.dailyReturn || 0) * (editedPackage.durationDays || 0);
    
    onSave({ ...editedPackage, totalReturn } as Package);
    toast({
        title: pkg ? "Package Updated" : "Package Created",
        description: `Package "${editedPackage.name}" has been saved.`,
    })
    setIsOpen(false);
    if (!pkg) {
        setEditedPackage({ isActive: true });
    }
  };

  const handleDelete = () => {
    if(pkg && onDelete) {
        onDelete(pkg.id);
         toast({
            title: "Package Deleted",
            description: `Package "${pkg.name}" has been deleted.`,
            variant: "destructive"
        })
        setIsOpen(false);
    }
  }

  const handleToggle = () => {
      if(pkg && onToggleStatus) {
          onToggleStatus(pkg.id);
          toast({
            title: "Status Toggled",
            description: `Status for "${pkg.name}" has been changed.`,
        })
      }
  }

  const trigger = children ? (
    <SheetTrigger asChild>{children}</SheetTrigger>
  ) : (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsOpen(true)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggle}>Toggle Status</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {trigger}
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{pkg ? "Edit Package" : "Add New Package"}</SheetTitle>
            <SheetDescription>
              {pkg ? "Modify the package details below." : "Fill in the details for the new package."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Package Name</Label>
              <Input id="name" value={editedPackage.name || ""} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={editedPackage.description || ""} onChange={handleInputChange} required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (Ksh)</Label>
                    <Input id="price" type="number" value={editedPackage.price || ""} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dailyReturn">Daily Return (Ksh)</Label>
                    <Input id="dailyReturn" type="number" value={editedPackage.dailyReturn || ""} onChange={handleInputChange} required />
                </div>
             </div>
             <div className="space-y-2">
                <Label htmlFor="durationDays">Duration (Days)</Label>
                <Input id="durationDays" type="number" value={editedPackage.durationDays || ""} onChange={handleInputChange} required />
             </div>
             <div className="flex items-center gap-4">
              <Label htmlFor="is-active" className="text-right">
                Active
              </Label>
              <Switch id="is-active" checked={editedPackage.isActive} onCheckedChange={handleActiveChange} />
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

