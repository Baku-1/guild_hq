
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createGuild } from "@/lib/data";
import { useAuth } from "@/contexts/auth-context";

export function CreateGuildDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Not Authenticated", description: "You must be logged in to create a guild.", variant: "destructive" });
        return;
    }
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const guildName = formData.get('name') as string;
    const guildDescription = formData.get('description') as string;
    
    try {
      const token = await user.getIdToken();
      const newGuild = await createGuild(guildName, guildDescription, token);
      
      toast({
        title: "Guild Created!",
        description: `${guildName} is now ready.`,
      });
      
      setOpen(false);
      router.refresh(); 
      router.push(`/guilds/${newGuild.id}`);
    } catch (error: any) {
      console.error("Error creating guild: ", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create the guild. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!user}>
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !user}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
