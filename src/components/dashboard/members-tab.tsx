
"use client";

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
import { useState } from "react";

interface MembersTabProps {
  members: Member[];
  currentUserId: string;
}

export function MembersTab({ members: initialMembers, currentUserId }: MembersTabProps) {
  const [members, setMembers] = useState(initialMembers);
  const { toast } = useToast();
  
  const currentUser = members.find(m => m.id === currentUserId);
  const isManager = currentUser?.role === 'Guild Master' || currentUser?.role === 'Officer';

  const handleAction = (action: string, memberId: string, memberName: string) => {
    // TODO: Replace with your API call to perform the action.
    // e.g., api.kickMember(memberId).then(() => { ... });
    // After the API call is successful, you should refetch the member list
    // or update the local state to reflect the change.

    console.log(`${action} on member ${memberId}. In a real app, this would call a backend API.`);
    toast({
      title: `${action} Successful`,
      description: `${memberName} has been ${action.toLowerCase()}.`,
    });

    // Note: State updates would be more complex in a real app and
    // should ideally be a result of refetching data after a successful API call.
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
                    {isManager && member.id !== currentUserId ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Member Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled={!canPromote} onSelect={() => handleAction('Promote', member.id, member.name)}>
                            <ChevronUp className="mr-2 h-4 w-4" />
                            <span>Promote to Officer</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={!canDemote} onSelect={() => handleAction('Demote', member.id, member.name)}>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            <span>Demote to Member</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={() => handleAction('Kick', member.id, member.name)}>
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
