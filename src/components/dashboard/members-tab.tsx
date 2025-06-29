
"use client";

import { useState } from "react";
import type { Member } from "@/lib/data";
import { getRoleIcon } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronUp, ChevronDown, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MembersTabProps {
  guildId: string;
  members: Member[];
  currentUser?: Member;
}

export function MembersTab({ guildId, members, currentUser }: MembersTabProps) {
  const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const isManager = currentUser?.role === 'Guild Master' || currentUser?.role === 'Officer';

  const handleAction = async (action: 'Promote' | 'Demote' | 'Kick', member: Member) => {
    setLoadingMemberId(member.id);
    toast({
        title: "Feature Not Implemented",
        description: `The '${action}' action is not connected to the backend API yet.`,
        variant: "destructive"
    });
    // In a real implementation, you would make an API call here.
    // e.g., PATCH /api/guilds/{guildId}/members/{memberId}
    setLoadingMemberId(null);
  };

  const sortedMembers = [...members].sort((a, b) => b.guildScore - a.guildScore);

  return (
    <div>
      <h2 className="text-2xl font-headline mb-4">Guild Roster</h2>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Guild Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              const canPromote = member.role === 'Member';
              const canDemote = member.role === 'Officer';
              const isLoading = loadingMemberId === member.id;

              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="fantasy character" />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'Guild Master' ? 'default' : 'secondary'} className="bg-accent/20 text-accent-foreground hover:bg-accent/40">
                      <RoleIcon className="mr-2 h-4 w-4" />
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{member.guildScore}</TableCell>
                  <TableCell className="text-right">
                    {isManager && currentUser && member.id !== currentUser.id && member.role !== 'Guild Master' ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isLoading}>
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Member Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled={!canPromote || isLoading} onSelect={() => handleAction('Promote', member)}>
                            <ChevronUp className="mr-2 h-4 w-4" />
                            <span>Promote to Officer</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={!canDemote || isLoading} onSelect={() => handleAction('Demote', member)}>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            <span>Demote to Member</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled={isLoading} onSelect={() => handleAction('Kick', member)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            <span>Kick Member</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
