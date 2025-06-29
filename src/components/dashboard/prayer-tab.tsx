
"use client";

import { useState, useEffect } from "react";
import type { Member } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Check, Users } from "lucide-react";

// --- Atia's Blessing Contract Details ---
const ATIA_CONTRACT_ADDRESS = '0x9d3936dbd9a794ee31ef9f13814233d435bd806c';
const ATIA_ABI = [
  { inputs: [{ internalType: 'address', name: 'to', type: 'address' }], name: 'activateStreak', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getStreak',
    outputs: [
      { internalType: 'uint256', name: 'currentStreakCount', type: 'uint256' },
      { internalType: 'uint256', name: 'lastActivated', type: 'uint256' },
      { internalType: 'uint256', name: 'longestStreakCount', type: 'uint256' },
      { internalType: 'uint256', name: 'lostStreakCount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getActivationStatus',
    outputs: [
      { internalType: 'bool', name: 'isLostStreak', type: 'bool' },
      { internalType: 'bool', name: 'hasPrayedToday', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];


interface PrayerTabProps {
  members: Member[];
  currentUserId: string;
}

interface PrayerStatus {
  streak: number;
  hasPrayed: boolean;
}

export function PrayerTab({ members, currentUserId }: PrayerTabProps) {
  const [prayerStatus, setPrayerStatus] = useState<Record<string, PrayerStatus>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const currentUser = members.find(m => m.id === currentUserId);
  const isManager = currentUser?.role === 'Guild Master' || currentUser?.role === 'Officer';

  useEffect(() => {
    const fetchStatuses = async () => {
      setLoading(true);
      const statuses: Record<string, PrayerStatus> = {};
      
      for (const member of members) {
        // This is mock data. A real implementation would call the contract for each member.
        statuses[member.id] = {
          streak: Math.floor(Math.random() * 100),
          hasPrayed: Math.random() > 0.5,
        };
      }
      
      setPrayerStatus(statuses);
      setLoading(false);
    };

    fetchStatuses();
  }, [members]);

  const handlePrayForAll = async () => {
    toast({
        title: "Preparing Batch Prayer...",
        description: `Please review and sign the transaction in your wallet.`,
    });

    // In a real app, this would construct a multicall transaction for the manager's wallet to sign.
    // This keeps the manager's private key secure in their wallet extension.
    setTimeout(() => {
        setPrayerStatus(prev => {
            const newStatus = { ...prev };
            members.forEach(member => {
                if (!newStatus[member.id]?.hasPrayed) {
                    newStatus[member.id] = {
                        streak: (newStatus[member.id]?.streak || 0) + 1,
                        hasPrayed: true,
                    };
                }
            });
            return newStatus;
        });

        toast({
            title: "Batch Prayer Submitted!",
            description: `Atia's blessing has been invoked for all eligible members.`,
        });
    }, 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-2xl font-headline">Atia's Blessing</h2>
            <p className="text-sm text-muted-foreground">Maintain the guild's daily prayer streaks.</p>
        </div>
        {isManager && (
            <Button onClick={handlePrayForAll}>
                <Users className="mr-2 h-4 w-4" />
                Pray for All Members
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading prayer statuses...</p>
        ) : (
          members.map(member => (
            <Card key={member.id} className={prayerStatus[member.id]?.hasPrayed ? 'bg-green-500/10 border-green-500/20' : ''}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="fantasy character" />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name} {member.id === currentUserId ? '(You)' : ''}</p>
                    <p className="text-sm text-muted-foreground">
                      Streak: <span className="font-bold text-primary">{prayerStatus[member.id]?.streak || 0}</span>
                    </p>
                  </div>
                </div>
                
                {prayerStatus[member.id]?.hasPrayed ? (
                   <div className="flex items-center text-sm font-medium text-green-400 gap-2">
                    <Check className="h-5 w-5" />
                    Prayed
                  </div>
                ) : (
                   <div className="flex items-center text-sm font-medium text-yellow-400/80 gap-2">
                    <Sparkles className="h-5 w-5" />
                    Pending
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
