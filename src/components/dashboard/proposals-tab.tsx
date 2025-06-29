
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Proposal, Member } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, PlusCircle, Clock } from "lucide-react";
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
import { formatDistanceToNowStrict } from 'date-fns';

interface ProposalsTabProps {
  guildId: string;
  proposals: Proposal[];
  currentUser?: Member;
  memberCount: number;
}

export function ProposalsTab({ guildId, proposals, currentUser, memberCount }: ProposalsTabProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    if (!currentUser) return;

    setLoading(true);
    const guildDocRef = doc(db, 'guilds', guildId);
    try {
        const docSnap = await getDoc(guildDocRef);
        if (!docSnap.exists()) throw new Error("Guild not found");
        
        const currentProposals = docSnap.data().proposals as Proposal[];
        
        const proposalIndex = currentProposals.findIndex(p => p.id === proposalId);
        if (proposalIndex === -1) throw new Error("Proposal not found");

        const proposal = currentProposals[proposalIndex];
        
        // Server-side checks
        if (proposal.votes[currentUser.id]) {
            toast({ title: "Already Voted", description: "You have already cast your vote on this proposal.", variant: "destructive" });
            setLoading(false);
            return;
        }
        if (new Date() > new Date(proposal.expiresAt)) {
             toast({ title: "Voting Closed", description: "This proposal has already expired.", variant: "destructive" });
            setLoading(false);
            return;
        }

        const updatedProposals = [...currentProposals];
        updatedProposals[proposalIndex].votes[currentUser.id] = vote;
        
        await updateDoc(guildDocRef, { proposals: updatedProposals });

        toast({
            title: "Vote Cast!",
            description: "Your vote has been recorded."
        });
        router.refresh();

    } catch(error: any) {
        console.error("Error casting vote:", error);
        toast({
            title: "Error",
            description: error.message || "Failed to cast vote. Please try again.",
            variant: "destructive"
        });
    } finally {
        setLoading(false);
    }
  };

  const handleCreateProposal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const now = new Date();
    const expires = new Date(now.setDate(now.getDate() + 3)); // 3-day voting period

    const newProposal: Proposal = {
        id: `prop-${Date.now()}`,
        title,
        description,
        proposer: currentUser.name,
        votes: {},
        status: 'active',
        createdAt: new Date().toISOString(),
        expiresAt: expires.toISOString(),
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
                            Propose a change for the guild to vote on. It will be active for 3 days.
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
          const votesFor = Object.values(p.votes).filter(v => v === 'for').length;
          const votesAgainst = Object.values(p.votes).filter(v => v === 'against').length;
          const totalVotes = votesFor + votesAgainst;
          const forPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
          
          const userVote = currentUser ? p.votes[currentUser.id] : null;
          const isExpired = new Date() > new Date(p.expiresAt);

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
                        <span>For: {votesFor}</span>
                        <span>Against: {votesAgainst}</span>
                    </div>
                  <Progress value={forPercentage} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        onClick={() => handleVote(p.id, 'for')} 
                        disabled={isExpired || !!userVote || !currentUser || loading}
                        variant={userVote === 'for' ? 'default' : 'outline'}
                        className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30 hover:text-green-300 disabled:opacity-50"
                    >
                    <ThumbsUp className="mr-2 h-4 w-4" /> For
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={() => handleVote(p.id, 'against')} 
                        disabled={isExpired || !!userVote || !currentUser || loading}
                        variant={userVote === 'against' ? 'default' : 'outline'}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30 hover:text-red-300 disabled:opacity-50"
                    >
                    <ThumbsDown className="mr-2 h-4 w-4" /> Against
                    </Button>
                </div>
                <div className={`text-sm flex items-center gap-2 ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                    <Clock className="h-4 w-4" />
                    {isExpired ? 'Expired' : `${formatDistanceToNowStrict(new Date(p.expiresAt))} left`}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
