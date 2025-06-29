
import { getGuildById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { GuildDashboardClient } from '@/components/guild-dashboard-client';

export default async function GuildDashboardPage({ params }: { params: { id: string } }) {
  const guild = await getGuildById(params.id);

  if (!guild) {
    notFound();
  }

  // The Server Component fetches the data and passes it to the Client Component
  // which will handle user-specific logic and context.
  return <GuildDashboardClient guild={guild} />;
}
