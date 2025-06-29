
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Quest, Member } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlusCircle, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast';


interface QuestsTabProps {
  guildId: string;
  quests: Quest[];
  currentUser?: Member;
}

export function QuestsTab({ guildId, quests, currentUser }: QuestsTabProps) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const isManager = currentUser?.role === 'Guild Master' || currentUser?.role === 'Officer';

    const handleClaim = async (questId: string) => {
        if (!currentUser) return;
        
        const quest = quests.find(q => q.id === questId);
        if (quest?.claimedBy?.includes(currentUser.id)) {
            toast({ title: "Already Claimed", description: "You have already claimed this quest.", variant: "destructive" });
            return;
        }

        setLoading(true);
        const guildDocRef = doc(db, 'guilds', guildId);
        try {
            const docSnap = await getDoc(guildDocRef);
            if (!docSnap.exists()) throw new Error("Guild not found");

            const currentQuests = docSnap.data().quests as Quest[];
            const updatedQuests = currentQuests.map(q => {
                if (q.id === questId) {
                    const claimants = new Set(q.claimedBy || []);
                    claimants.add(currentUser.id);
                    return { ...q, claimedBy: Array.from(claimants) };
                }
                return q;
            });
            
            await updateDoc(guildDocRef, { quests: updatedQuests });

            toast({ title: "Quest Claimed!", description: "Your reward has been noted." });
            router.refresh();
        } catch (error) {
            console.error("Error claiming quest:", error);
            toast({ title: "Error", description: "Failed to claim quest.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateQuest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        const newQuest: Quest = {
            id: `quest-${Date.now()}`,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            reward: Number(formData.get('reward')),
            claimedBy: []
        };

        try {
            const guildDocRef = doc(db, 'guilds', guildId);
            await updateDoc(guildDocRef, {
                quests: arrayUnion(newQuest)
            });
            toast({ title: "Quest Created", description: "The new quest is now on the board." });
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error creating quest:", error);
            toast({ title: "Error", description: "Failed to create quest.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline">Quest Board</h2>
        {isManager && (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Quest
                    </Button>
                </DialogTrigger>
                <DialogContent>
                <form onSubmit={handleCreateQuest}>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Create a new Quest</DialogTitle>
                        <DialogDescription>
                            Set a new challenge for your guild members.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" name="title" placeholder="Quest title" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-right pt-2">Description</Label>
                            <Textarea id="description" name="description" placeholder="Describe the quest in detail..." className="col-span-3" required/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reward" className="text-right">Reward (GS)</Label>
                            <Input id="reward" name="reward" type="number" placeholder="e.g. 500" className="col-span-3" required/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Post Quest"}</Button>
                    </DialogFooter>
                </form>
                </DialogContent>
            </Dialog>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.length > 0 ? quests.map((quest) => {
          const isClaimedByUser = currentUser && quest.claimedBy?.includes(currentUser.id);
          return (
            <Card key={quest.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">{quest.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-yellow-400">
                  <Star className="h-4 w-4" /> {quest.reward} GS
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{quest.description}</p>
              </CardContent>
              <CardFooter>
                {isClaimedByUser ? (
                  <Button variant="outline" disabled className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Claimed
                  </Button>
                ) : (
                  <Button onClick={() => handleClaim(quest.id)} className="w-full" disabled={loading || !currentUser}>
                    Claim Quest
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        }) : <p className="text-muted-foreground col-span-full">The quest board is empty.</p>}
      </div>
    </div>
  );
}
