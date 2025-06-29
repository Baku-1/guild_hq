
"use client";

import { useEffect, useState } from 'react';
import { GuildCard } from '@/components/guild-card';
import { getGuilds } from '@/lib/data';
import type { Guild } from '@/lib/data';
import { CreateGuildDialog } from '@/components/create-guild-dialog';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Loader2, LogIn, LogOut } from 'lucide-react';

export default function GuildSelectionPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    async function fetchGuilds() {
      setLoadingGuilds(true);
      const fetchedGuilds = await getGuilds();
      setGuilds(fetchedGuilds);
      setLoadingGuilds(false);
    }
    fetchGuilds();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isLoading = authLoading || loadingGuilds;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-headline text-primary">GuildHQ</h1>
          {authLoading ? (
            <div className="h-10 w-24 rounded-md bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Welcome, {user.displayName?.split(' ')[0] || 'User'}!</span>
              <CreateGuildDialog />
              <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</Button>
            </div>
          ) : (
            <Button onClick={handleLogin}><LogIn className="mr-2 h-4 w-4" />Login with Google</Button>
          )}
        </header>
        <main>
          <h2 className="text-3xl font-headline mb-6">Select Your Guild</h2>
          {isLoading ? (
             <div className="text-center text-muted-foreground py-16">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p className="mt-2">Loading Guilds...</p>
            </div>
          ) : !user ? (
            <div className="text-center text-muted-foreground py-16">
                <h3 className="text-xl font-semibold">Please log in</h3>
                <p>Log in to see your guilds and manage them.</p>
            </div>
          ) : guilds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {guilds.map((guild) => (
                <GuildCard key={guild.id} guild={guild} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <h3 className="text-xl font-semibold">No Guilds Found</h3>
              <p>Create a guild to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
