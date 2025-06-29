
import { getGuildById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, Swords, Users, Vote, Shield, Coins, Store, MessageSquare, Newspaper, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { SummaryTab } from '@/components/dashboard/summary-tab';
import { TreasuryTab } from '@/components/dashboard/treasury-tab';
import { MembersTab } from '@/components/dashboard/members-tab';
import { QuestsTab } from '@/components/dashboard/quests-tab';
import { TeamsTab } from '@/components/dashboard/teams-tab';
import { ProposalsTab } from '@/components/dashboard/proposals-tab';
import { MarketplaceTab } from '@/components/dashboard/marketplace-tab';
import { ChatTab } from '@/components/dashboard/chat-tab';
import { PrayerTab } from '@/components/dashboard/prayer-tab';
import { GuildSettingsDialog } from '@/components/guild-settings-dialog';

export default async function GuildDashboardPage({ params }: { params: { id: string } }) {
  const guild = await getGuildById(params.id);

  if (!guild) {
    notFound();
  }

  // Mock the current user. In a real app, this would come from an auth context.
  // '1' is Aelar (Guild Master), '2' is Brynn (Officer), '4' is Lyra (Member/Scholar)
  const currentUserId = '1';

  const TABS = [
    { value: "summary", label: "Summary", icon: Newspaper },
    { value: "quests", label: "Quests", icon: Swords },
    { value: "members", label: "Members", icon: Users },
    { value: "proposals", label: "Proposals", icon: Vote },
    { value: "teams", label: "Teams", icon: Shield },
    { value: "treasury", label: "Treasury", icon: Coins },
    { value: "marketplace", label: "Marketplace", icon: Store },
    { value: "prayers", label: "Prayers", icon: Sparkles },
    { value: "chat", label: "Chat", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="relative h-48 md:h-64 w-full group">
        <Image src={guild.bannerUrl} alt={`${guild.name} banner`} fill className="object-cover" data-ai-hint="fantasy landscape"/>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute top-4 left-4">
            <Link href="/" aria-label="Back to guild selection">
              <Button variant="outline" size="icon" className="bg-background/50 hover:bg-background">
                  <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="outline" size="icon" className="bg-background/50 hover:bg-background">
                <Bell className="h-4 w-4" />
            </Button>
            <GuildSettingsDialog guild={guild} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="flex items-end gap-4 max-w-7xl mx-auto">
                <Image src={guild.iconUrl} alt={`${guild.name} icon`} width={96} height={96} className="rounded-xl border-4 border-background shadow-lg -mb-4" data-ai-hint="fantasy crest" />
                <div className="pb-2">
                    <h1 className="text-3xl md:text-5xl font-headline text-primary">{guild.name}</h1>
                    <p className="text-muted-foreground mt-1 max-w-2xl truncate">{guild.description}</p>
                </div>
            </div>
        </div>
      </header>
      
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="teams" className="w-full">
            <TabsList className="grid w-full grid-cols-5 md:grid-cols-9">
                {TABS.map(tab => (
                     <TabsTrigger key={tab.value} value={tab.value}>
                        <tab.icon className="w-4 h-4 mr-0 md:mr-2" />
                        <span className="hidden md:inline">{tab.label}</span>
                    </TabsTrigger>
                ))}
            </TabsList>
            
            <TabsContent value="summary" className="mt-6">
                <SummaryTab summary={guild.summary} />
            </TabsContent>
            <TabsContent value="quests" className="mt-6">
                <QuestsTab quests={guild.quests} />
            </TabsContent>
            <TabsContent value="members" className="mt-6">
                <MembersTab members={guild.members} />
            </TabsContent>
            <TabsContent value="proposals" className="mt-6">
                <ProposalsTab proposals={guild.proposals} />
            </TabsContent>
            <TabsContent value="teams" className="mt-6">
                <TeamsTab 
                  initialTeams={guild.teams} 
                  members={guild.members} 
                  currentUserId={currentUserId}
                />
            </TabsContent>
            <TabsContent value="treasury" className="mt-6">
                <TreasuryTab treasury={guild.treasury} />
            </TabsContent>
            <TabsContent value="marketplace" className="mt-6">
                <MarketplaceTab items={guild.marketplace} />
            </TabsContent>
             <TabsContent value="prayers" className="mt-6">
                <PrayerTab members={guild.members} currentUserId={currentUserId} />
            </TabsContent>
            <TabsContent value="chat" className="mt-6">
                <ChatTab messages={guild.chatMessages} />
            </TabsContent>
            </Tabs>
        </div>
      </main>
    </div>
  );
}
