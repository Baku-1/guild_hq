
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Team, Member } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Shield, UserCheck, UserX, KeyRound, Check } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";

interface TeamsTabProps {
  guildId: string;
  initialTeams: Team[];
  members: Member[];
  currentUserId: string;
}

export function TeamsTab({ guildId, initialTeams, members, currentUserId }: TeamsTabProps) {
  const [teams, setTeams] = useState(initialTeams);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const membersMap = new Map(members.map(m => [m.id, m]));
  const currentUser = membersMap.get(currentUserId);
  const isManager = currentUser?.role === 'Guild Master' || currentUser?.role === 'Officer';

  const updateTeamInFirestore = async (teamId: string, updates: Partial<Team>) => {
    setLoading(true);
    const guildDocRef = doc(db, 'guilds', guildId);
    try {
      const docSnap = await getDoc(guildDocRef);
      if (!docSnap.exists()) throw new Error("Guild not found");

      const currentTeams = docSnap.data().teams as Team[];
      const updatedTeams = currentTeams.map(t =>
        t.id === teamId ? { ...t, ...updates } : t
      );
      await updateDoc(guildDocRef, { teams: updatedTeams });
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error updating team:", error);
      toast({ title: "Error", description: "Failed to update team.", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (teamId: string) => {
    const success = await updateTeamInFirestore(teamId, { 
        applicants: arrayUnion(currentUserId) as any 
    });
    if (success) toast({ title: "Applied!", description: "Your application has been submitted." });
  };

  const handleApprove = async (teamId: string, applicantId: string) => {
    const success = await updateTeamInFirestore(teamId, { scholarId: applicantId, applicants: [] });
    if (success) toast({ title: "Scholar Approved", description: "The team has been assigned." });
  };

  const handleUnassign = async (teamId: string) => {
    const success = await updateTeamInFirestore(teamId, { scholarId: undefined });
    if (success) toast({ title: "Scholar Unassigned", description: "The team is now available." });
  };

  const handleCreateTeam = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: formData.get('name') as string,
      managerId: currentUserId,
      walletAddress: formData.get('walletAddress') as string,
      encryptedPassword: formData.get('password') as string,
      axies: (formData.get('axies') as string)
              .split(',')
              .map(id => ({ id: id.trim(), name: `Axie ${id.trim()}`, imageUrl: 'https://placehold.co/150x150.png' })),
      applicants: [],
    };

    const guildDocRef = doc(db, 'guilds', guildId);
    try {
        await updateDoc(guildDocRef, { teams: arrayUnion(newTeam) });
        toast({ title: "Team Created", description: "The new team is ready for applicants." });
        setCreateDialogOpen(false);
        router.refresh();
    } catch (error) {
        console.error("Error creating team:", error);
        toast({ title: "Error", description: "Failed to create team.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline">Axie Teams</h2>
        {isManager && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
                <Button disabled={loading}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Team
                </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateTeam}>
                <DialogHeader>
                    <DialogTitle className="font-headline">Assemble a new Team</DialogTitle>
                    <DialogDescription>
                        Create a new Axie team wallet for a scholar.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Team Name</Label>
                        <Input id="name" name="name" placeholder="e.g. Aqua Raiders" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="walletAddress" className="text-right">Wallet</Label>
                        <Input id="walletAddress" name="walletAddress" placeholder="ronin:..." className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="axies" className="text-right">Axie IDs</Label>
                        <Input id="axies" name="axies" placeholder="1234, 5678, 9101" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="Wallet password" className="col-span-3" required/>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Team"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
        </Dialog>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team) => {
          const manager = membersMap.get(team.managerId);
          const scholar = team.scholarId ? membersMap.get(team.scholarId) : null;
          const isCurrentUserApplicant = team.applicants.includes(currentUserId);
          const isCurrentUserScholar = team.scholarId === currentUserId;
          const isCurrentUserManager = team.managerId === currentUserId;

          return (
            <Card key={team.id} className="flex flex-col">
              <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-headline flex items-center gap-2"><Shield />{team.name}</CardTitle>
                      <CardDescription>Managed by {manager?.name || 'Unknown'}</CardDescription>
                      <CardDescription className="font-mono text-xs pt-1">{team.walletAddress}</CardDescription>
                    </div>
                    {scholar ? (
                       <div className="text-right">
                         <div className="text-sm font-semibold text-green-400 flex items-center gap-2"><UserCheck />Assigned</div>
                         <div className="text-xs text-muted-foreground">{scholar.name}</div>
                       </div>
                    ) : (
                      <div className="text-sm font-semibold text-yellow-400">Available</div>
                    )}
                  </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <h4 className="font-semibold text-sm mb-2">Axies</h4>
                <div className="flex gap-4">
                  {team.axies.map((axie) => (
                    <div key={axie.id} className="text-center">
                      <Image
                        src={axie.imageUrl}
                        alt={axie.name}
                        width={80}
                        height={80}
                        className="rounded-lg bg-muted"
                        data-ai-hint="axie character"
                      />
                      <p className="text-xs mt-2 font-medium">{axie.name}</p>
                    </div>
                  ))}
                </div>
                
                {isCurrentUserManager && !scholar && team.applicants.length > 0 && (
                  <div className="mt-4">
                    <Separator className="my-2" />
                    <h4 className="font-semibold text-sm mb-2">Applicants</h4>
                    <div className="space-y-2">
                      {team.applicants.map(applicantId => {
                        const applicant = membersMap.get(applicantId);
                        return (
                          <div key={applicantId} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={applicant?.avatarUrl} />
                                <AvatarFallback>{applicant?.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{applicant?.name}</span>
                            </div>
                            <Button size="sm" onClick={() => handleApprove(team.id, applicantId)} disabled={loading}><Check className="mr-2 h-4 w-4"/>Approve</Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/30 p-4">
                {isCurrentUserManager ? (
                    scholar ? (
                      <Button variant="destructive" className="w-full" onClick={() => handleUnassign(team.id)} disabled={loading}><UserX className="mr-2"/>Unassign Scholar</Button>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center w-full">Awaiting applications from scholars.</p>
                    )
                ) : scholar ? (
                    isCurrentUserScholar ? (
                       <Button className="w-full" variant="secondary" onClick={() => alert(`Password: ${team.encryptedPassword}`)}><KeyRound className="mr-2"/>View Credentials</Button>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center w-full">This team is currently assigned.</p>
                    )
                ) : isCurrentUserApplicant ? (
                  <Button className="w-full" disabled>Application Pending</Button>
                ) : (
                  <Button className="w-full" onClick={() => handleApply(team.id)} disabled={loading}>Apply for this Team</Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
        {teams.length === 0 && <p className="text-muted-foreground col-span-full">No teams have been created yet.</p>}
      </div>
    </div>
  );
}
