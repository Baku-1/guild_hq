"use client";

import type { Team } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Shield } from "lucide-react";
import Image from 'next/image';
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

interface TeamsTabProps {
  teams: Team[];
}

export function TeamsTab({ teams }: TeamsTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline">Axie Teams</h2>
         <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Team
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline">Assemble a new Team</DialogTitle>
                    <DialogDescription>
                        Create a new Axie team and delegate to a member.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Team Name</Label>
                        <Input id="name" placeholder="e.g. Aqua Raiders" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="axies" className="text-right">Axie IDs</Label>
                        <Input id="axies" placeholder="1234, 5678, 9101" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Create Team</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader className="flex flex-row items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle className="font-headline">{team.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              {team.axies.map((axie) => (
                <div key={axie.id} className="text-center">
                  <Image
                    src={axie.imageUrl}
                    alt={axie.name}
                    width={100}
                    height={100}
                    className="rounded-lg bg-muted"
                    data-ai-hint="axie character"
                  />
                  <p className="text-xs mt-2 font-medium">{axie.name}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        {teams.length === 0 && <p className="text-muted-foreground">No teams have been created yet.</p>}
      </div>
    </div>
  );
}
