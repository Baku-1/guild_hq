import Link from 'next/link';
import Image from 'next/image';
import type { Guild } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface GuildCardProps {
  guild: Guild;
}

export function GuildCard({ guild }: GuildCardProps) {
  return (
    <Link href={`/guilds/${guild.id}`} className="block group">
      <Card className="h-full flex flex-col overflow-hidden bg-card hover:border-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/20">
        <CardHeader className="p-0">
          <div className="relative h-40 w-full">
            <Image
              src={guild.bannerUrl}
              alt={`${guild.name} banner`}
              fill
              className="object-cover"
              data-ai-hint="fantasy guild banner"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow relative">
          <div className="absolute -top-10 left-4">
             <Image src={guild.iconUrl} alt={`${guild.name} icon`} width={64} height={64} className="rounded-lg border-4 border-card shadow-md" data-ai-hint="fantasy guild icon" />
          </div>
          <div className="pt-8">
            <CardTitle className="font-headline text-xl mb-1 group-hover:text-primary transition-colors">{guild.name}</CardTitle>
            <CardDescription>{guild.description}</CardDescription>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{guild.members.length} Members</span>
          </div>
          <div className="flex gap-2">
            {guild.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
