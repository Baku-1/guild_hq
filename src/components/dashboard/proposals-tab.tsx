
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Proposal, Member } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, PlusCircle } from "lucide-react";
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

interface ProposalsTabProps {
  guildId: string;
  proposals: Proposal[];
  currentUser?: Member;
}

export function ProposalsTab({ guildId, proposals, currentUser }: ProposalsTabProps) {
  const [voted, setVoted] = useState<Record<string, 'for' | 'against' | null>>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    if (voted[proposalId] || !currentUser) return;

    setVoted({ ...voted, [proposalId]: vote });

    const guildDocRef = doc(db, 'guilds', guildId);
    try {
        const docSnap = await getDoc(guildDocRef);
        if (!docSnap.exists()) throw new Error("Guild not found");
        
        const currentProposals = docSnap.data().proposals as Proposal[];
        const updatedProposals = currentProposals.map(p => {
            if (p.id === proposalId) {
                return {
                    ...p,
                    votesFor: vote === 'for' ? p.votesFor + 1 : p.votesFor,
                    votesAgainst: vote === 'against' ? p.votesAgainst + 1 : p.votesAgainst,
                };
            }
            return p;
        });

        await updateDoc(guildDocRef, { proposals: updatedProposals });

        toast({
            title: "Vote Cast!",
            description: "Your vote has been recorded."
        });
        router.refresh();

    } catch(error) {
        console.error("Error casting vote:", error);
        toast({
            title: "Error",
            description: "Failed to cast vote. Please try again.",
            variant: "destructive"
        });
        setVoted({ ...voted, [proposalId]: null });
    }
  };

  const handleCreateProposal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    const newProposal: Proposal = {
        id: `prop-${Date.now()}`,
        title,
        description,
        proposer: currentUser.name,
        votesFor: 0,
        votesAgainst: 0,
        status: 'active'
    };
    
    try {
        const guildDocRef = doc(db, "guilds", guildId);
        await updateDoc(guildDocRef, {
            proposals: arrayUnion(newProposal)
        });
        toast({
            title: "Proposal Created",
            description: "Your proposal is now live for voting."
        });
        setOpen(false);
        router.refresh();
    } catch(error) {
         console.error("Error creating proposal:", error);
        toast({
            title: "Error",
            description: "Failed to create proposal. Please try again.",
            variant: "destructive"
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline">Governance</h2>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={!currentUser}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Proposal
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleCreateProposal}>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Create a new Proposal</DialogTitle>
                        <DialogDescription>
                            Propose a change for the guild to vote on.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" name="title" placeholder="Proposal title" className="col-span-3" required/>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-right pt-2">Description</Label>
                            <Textarea id="description" name="description" placeholder="Describe your proposal in detail..." className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit for Voting"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {proposals.map((p) => {
          const totalVotes = p.votesFor + p.votesAgainst;
          const forPercentage = totalVotes > 0 ? (p.votesFor / totalVotes) * 100 : 0;
          return (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="font-headline">{p.title}</CardTitle>
                <CardDescription>Proposed by {p.proposer}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>For: {p.votesFor}</span>
                        <span>Against: {p.votesAgainst}</span>
                    </div>
                  <Progress value={forPercentage} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                    size="sm" 
                    onClick={() => handleVote(p.id, 'for')} 
                    disabled={p.status !== 'active' || !!voted[p.id] || !currentUser}
                    variant={voted[p.id] === 'for' ? 'default' : 'outline'}
                    className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30 hover:text-green-300 disabled:opacity-50"
                >
                  <ThumbsUp className="mr-2 h-4 w-4" /> For
                </Button>
                <Button 
                    size="sm" 
                    onClick={() => handleVote(p.id, 'against')} 
                    disabled={p.status !== 'active' || !!voted[p.id] || !currentUser}
                    variant={voted[p.id] === 'against' ? 'default' : 'outline'}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30 hover:text-red-300 disabled:opacity-50"
                >
                  <ThumbsDown className="mr-2 h-4 w-4" /> Against
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
