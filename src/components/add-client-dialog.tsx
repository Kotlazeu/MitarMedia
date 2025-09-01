
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
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface AddClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (newClient: { name: string; logo: string }) => void;
}

export function AddClientDialog({ isOpen, onClose, onAddClient }: AddClientDialogProps) {
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = () => {
    if (name && logo) {
      onAddClient({ name, logo });
      onClose();
      setName('');
      setLogo(null);
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields and upload a logo.",
        variant: "destructive",
      });
    }
  };

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
            <Label htmlFor="logo" className="text-right">
              Logo
            </Label>
            <Input
              id="logo"
              type="file"
              onChange={handleFileChange}
              className="col-span-3"
              accept="image/svg+xml, image/png, image/jpeg"
            />
          </div>
          {logo && (
            <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                    <p className="text-sm text-muted-foreground mb-2">Logo Preview:</p>
                    <Image src={logo} alt="Logo preview" width={100} height={100} className="rounded-md border p-2" />
                </div>
            </div>
          )}
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

    