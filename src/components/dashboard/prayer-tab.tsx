
"use client";

import { useState, useEffect } from "react";
import type { Member } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Check } from "lucide-react";

// --- Atia's Blessing Contract Details ---
// This information is from the script you provided.
// In a real app, you might store this in a separate constants file.

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

  // In a real application, this useEffect would use ethers.js to fetch
  // the prayer status for each member from the Ronin blockchain.
  useEffect(() => {
    const fetchStatuses = async () => {
      setLoading(true);
      const statuses: Record<string, PrayerStatus> = {};
      
      // Simulate fetching data for each member
      for (const member of members) {
        // This is mock data. A real implementation would call the contract.
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

  const handlePray = async (memberId: string, memberName: string) => {
    toast({
        title: "Submitting Prayer...",
        description: `Sending transaction to pray for ${memberName}.`,
    });

    // --- REAL BLOCKCHAIN INTERACTION WOULD HAPPEN HERE ---
    // 1. Get wallet provider from the browser (e.g., Ronin Wallet).
    //    const provider = new ethers.BrowserProvider(window.ronin);
    // 2. Get the signer.
    //    const signer = await provider.getSigner();
    // 3. Create a contract instance connected to the signer.
    //    const atiaContract = new ethers.Contract(ATIA_CONTRACT_ADDRESS, ATIA_ABI, signer);
    // 4. Call the activateStreak function.
    //    const tx = await atiaContract.activateStreak(memberAddress);
    // 5. Wait for the transaction to be confirmed.
    //    await tx.wait();
    
    // For now, we'll just simulate the success state.
    setTimeout(() => {
        setPrayerStatus(prev => ({
            ...prev,
            [memberId]: {
                streak: (prev[memberId]?.streak || 0) + 1,
                hasPrayed: true
            }
        }));

        toast({
            title: "Prayer Successful!",
            description: `Atia's blessing has been invoked for ${memberName}. Their streak continues!`,
        });
    }, 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline">Atia's Blessing</h2>
        <p className="text-sm text-muted-foreground">Maintain your daily prayer streak.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading prayer statuses...</p>
        ) : (
          members.map(member => (
            <Card key={member.id}>
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
                  <Button variant="secondary" disabled>
                    <Check className="mr-2 h-4 w-4" />
                    Prayed
                  </Button>
                ) : (
                  <Button onClick={() => handlePray(member.id, member.name)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Pray
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
