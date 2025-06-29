
import { GuildCard } from '@/components/guild-card';
import { getGuilds } from '@/lib/data';
import { CreateGuildDialog } from '@/components/create-guild-dialog';


export default async function GuildSelectionPage() {
  const guilds = await getGuilds();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-headline text-primary">GuildHQ</h1>
          <CreateGuildDialog />
        </header>
        <main>
          <h2 className="text-3xl font-headline mb-6">Select Your Guild</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {guilds.map((guild) => (
              <GuildCard key={guild.id} guild={guild} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
