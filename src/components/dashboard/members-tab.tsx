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

interface MembersTabProps {
  members: Member[];
}

export function MembersTab({ members }: MembersTabProps) {
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
              <TableHead className="text-right">Guild Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
