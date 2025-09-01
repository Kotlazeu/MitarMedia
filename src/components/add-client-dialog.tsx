
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucideProps } from 'lucide-react';

interface AddClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (newClient: { name: string; icon: string }) => void;
  icons: { [key: string]: React.FC<LucideProps> };
}

export function AddClientDialog({ isOpen, onClose, onAddClient, icons }: AddClientDialogProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  const handleSubmit = () => {
    if (name && icon) {
      onAddClient({ name, icon });
      onClose();
      setName('');
      setIcon('');
    } else {
      alert('Please fill out all fields.');
    }
  };

  const iconEntries = Object.entries(icons);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter the details for the new client. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <Select onValueChange={setIcon} value={icon}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                    {iconEntries.map(([iconName, IconComponent]) => (
                        <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                                <IconComponent className="h-5 w-5" />
                                <span>{iconName}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmit}>Save Client</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    