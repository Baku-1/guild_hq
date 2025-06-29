"use client";

import { useState } from 'react';
import type { Proposal } from "@/lib/data";
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

interface ProposalsTabProps {
  proposals: Proposal[];
}

export function ProposalsTab({ proposals: initialProposals }: ProposalsTabProps) {
  const [proposals, setProposals] = useState(initialProposals);
  const [voted, setVoted] = useState<Record<string, 'for' | 'against' | null>>({});

  const handleVote = (id: string, vote: 'for' | 'against') => {
    if (voted[id]) return;

    setProposals(proposals.map(p => {
      if (p.id === id) {
        return {
          ...p,
          votesFor: vote === 'for' ? p.votesFor + 1 : p.votesFor,
          votesAgainst: vote === 'against' ? p.votesAgainst + 1 : p.votesAgainst,
        };
      }
      return p;
    }));
    setVoted({ ...voted, [id]: vote });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline">Governance</h2>
         <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Proposal
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline">Create a new Proposal</DialogTitle>
                    <DialogDescription>
                        Propose a change for the guild to vote on.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" placeholder="Proposal title" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2">Description</Label>
                        <Textarea id="description" placeholder="Describe your proposal in detail..." className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Submit for Voting</Button>
                </DialogFooter>
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
                    disabled={p.status !== 'active' || !!voted[p.id]}
                    variant={voted[p.id] === 'for' ? 'default' : 'outline'}
                    className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30 hover:text-green-300 disabled:opacity-50"
                >
                  <ThumbsUp className="mr-2 h-4 w-4" /> For
                </Button>
                <Button 
                    size="sm" 
                    onClick={() => handleVote(p.id, 'against')} 
                    disabled={p.status !== 'active' || !!voted[p.id]}
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
