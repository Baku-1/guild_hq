
"use client";

import { useState } from "react";
import type { Guild } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface GuildSettingsDialogProps {
  guild: Guild;
  // A real app would check user permissions before rendering this component
  // isManager: boolean;
}

export function GuildSettingsDialog({ guild }: GuildSettingsDialogProps) {
  const [open, setOpen] = useState(false);

  // In a real app, you would handle form submission to an API here.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // const formData = new FormData(e.currentTarget);
    // updateGuild(guild.id, formData);
    console.log("Updating guild settings...");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-background/50 hover:bg-background">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">Guild Settings</DialogTitle>
            <DialogDescription>
              Update your guild's details. Changes will be saved upon submission.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Guild Name
              </Label>
              <Input id="name" name="name" defaultValue={guild.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input id="description" name="description" defaultValue={guild.description} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                New Icon
              </Label>
              <Input id="icon" name="icon" type="file" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="banner" className="text-right">
                New Banner
              </Label>
              <Input id="banner" name="banner" type="file" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
