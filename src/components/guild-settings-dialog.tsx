
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
import { useToast } from "@/hooks/use-toast";

interface GuildSettingsDialogProps {
  guild: Guild;
  // TODO: A real app would check user permissions before rendering this component
  // isManager: boolean;
}

export function GuildSettingsDialog({ guild }: GuildSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updatedData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      // File uploads would be handled here in a real implementation
    };

    try {
      const guildDocRef = doc(db, 'guilds', guild.id);
      await updateDoc(guildDocRef, updatedData);

      toast({
        title: "Settings Saved",
        description: "Your guild's details have been updated.",
      });

      setOpen(false);
      router.refresh(); // Re-fetches data on the current page
    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <Input id="icon" name="icon" type="file" className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="banner" className="text-right">
                New Banner
              </Label>
              <Input id="banner" name="banner" type="file" className="col-span-3" disabled />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
