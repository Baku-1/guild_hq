"use client";

import { useState } from 'react';
import type { Quest } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlusCircle, Coins } from "lucide-react";
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


interface QuestsTabProps {
  quests: Quest[];
}

export function QuestsTab({ quests: initialQuests }: QuestsTabProps) {
    const [quests, setQuests] = useState(initialQuests);

    const handleClaim = (id: string) => {
        // In a real app, this would be the current user's name
        const claimant = "You"; 
        setQuests(quests.map(q => q.id === id ? {...q, claimedBy: claimant} : q));
    };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline">Quest Board</h2>
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Quest
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline">Create a new Quest</DialogTitle>
                    <DialogDescription>
                        Set a new challenge for your guild members.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" placeholder="Quest title" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2">Description</Label>
                        <Textarea id="description" placeholder="Describe the quest in detail..." className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reward" className="text-right">Reward</Label>
                        <Input id="reward" type="number" placeholder="e.g. 500" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Post Quest</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <Card key={quest.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{quest.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-yellow-400">
                <Coins className="h-4 w-4" /> {quest.reward} Gold
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{quest.description}</p>
            </CardContent>
            <CardFooter>
              {quest.claimedBy ? (
                <div className="flex items-center text-green-400">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Claimed by {quest.claimedBy}
                </div>
              ) : (
                <Button onClick={() => handleClaim(quest.id)} className="w-full">
                  Claim Quest
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
