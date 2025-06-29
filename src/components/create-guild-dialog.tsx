
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Guild } from "@/lib/data";

export function CreateGuildDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const guildName = formData.get('name') as string;
    const guildDescription = formData.get('description') as string;

    // In a real app, you would handle file uploads to Firebase Storage
    // and get the download URLs. For now, we'll use placeholders.
    const newGuildData: Omit<Guild, 'id'> = {
      name: guildName,
      description: guildDescription,
      iconUrl: 'https://placehold.co/128x128.png',
      bannerUrl: 'https://placehold.co/600x240.png',
      tags: ['New', 'PvE'],
      summary: `Welcome to ${guildName}! This is a brand new guild. Start by recruiting members and creating quests.`,
      // TODO: The creating user should be added as the Guild Master
      members: [], 
      quests: [],
      teams: [],
      proposals: [],
      marketplace: [],
      chatMessages: [],
      treasury: {
        tokens: [],
        nfts: [],
      },
    };

    try {
      const docRef = await addDoc(collection(db, "guilds"), newGuildData);
      console.log("Document written with ID: ", docRef.id);
      
      toast({
        title: "Guild Created!",
        description: `${guildName} is now ready.`,
      });
      
      setOpen(false);
      router.refresh(); // Refresh the page to show the new guild
      router.push(`/guilds/${docRef.id}`); // Optional: redirect to the new guild's page
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "Error",
        description: "Failed to create the guild. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Guild
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">Create a new Guild</DialogTitle>
            <DialogDescription>
              Start a new community. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Guild Name
              </Label>
              <Input id="name" name="name" placeholder="The Crimson Vanguards" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input id="description" name="description" placeholder="A guild for elite adventurers." className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Guild Icon
              </Label>
              <Input id="icon" name="icon" type="file" className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="banner" className="text-right">
                Banner
              </Label>
              <Input id="banner" name="banner" type="file" className="col-span-3" disabled />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
