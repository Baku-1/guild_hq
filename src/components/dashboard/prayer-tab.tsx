
"use client";

import { useState, useEffect } from "react";
import type { Member } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Check, Users, Loader2 } from "lucide-react";
import { ethers } from "ethers";
import { ATIA_CONTRACT_ADDRESS, ATIA_ABI } from "@/lib/ronin";

interface PrayerTabProps {
  members: Member[];
  currentUser?: Member;
}

interface PrayerStatus {
  streak: number;
  hasPrayed: boolean;
}

export function PrayerTab({ members, currentUser }: PrayerTabProps) {
  const [prayerStatus, setPrayerStatus] = useState<Record<string, PrayerStatus>>({});
  const [loading, setLoading] = useState(true);
  const [txPending, setTxPending] = useState(false);
  const { toast } = useToast();

  const isManager = currentUser?.role === 'Guild Master' || currentUser?.role === 'Officer';

  const fetchPrayerStatuses = async () => {
    setLoading(true);
    console.log("Fetching prayer statuses from Ronin chain...");
    try {
      const provider = new ethers.JsonRpcProvider('https://api.roninchain.com/rpc', 2020, { batchMaxCount: 1 });
      const atiaContract = new ethers.Contract(ATIA_CONTRACT_ADDRESS, ATIA_ABI, provider);
      
      const statuses: Record<string, PrayerStatus> = {};
      
      const statusPromises = members.map(async (member) => {
        try {
          const { currentStreakCount } = await atiaContract.getStreak(member.walletAddress);
          const { hasPrayedToday } = await atiaContract.getActivationStatus(member.walletAddress);
          return {
            memberId: member.id,
            status: {
              streak: Number(currentStreakCount),
              hasPrayed: hasPrayedToday,
            }
          };
        } catch (error) {
          console.error(`Failed to fetch status for ${member.name} (${member.walletAddress})`, error);
          return { memberId: member.id, status: { streak: 0, hasPrayed: false } };
        }
      });

      const results = await Promise.all(statusPromises);
      results.forEach(result => {
        statuses[result.memberId] = result.status;
      });

      setPrayerStatus(statuses);
    } catch (error) {
      console.error("Error fetching prayer statuses:", error);
      toast({
        title: "Error Fetching Data",
        description: "Could not fetch prayer statuses from the Ronin chain.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (members.length > 0) {
        fetchPrayerStatuses();
    } else {
        setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  const handlePrayForAll = async () => {
    if (!(window as any).ethereum) {
        toast({ title: "Wallet Not Found", description: "Please install a browser wallet like Ronin Wallet.", variant: "destructive" });
        return;
    }

    const membersToPrayFor = members.filter(m => !prayerStatus[m.id]?.hasPrayed);

    if (membersToPrayFor.length === 0) {
        toast({ title: "All Prayers Complete", description: "All guild members have already received Atia's Blessing today." });
        return;
    }
    
    setTxPending(true);

    try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const atiaContract = new ethers.Contract(ATIA_CONTRACT_ADDRESS, ATIA_ABI, signer);

        toast({
            title: "Preparing Batch Prayer...",
            description: `Please sign the transaction(s) in your wallet. Note: A dedicated batch-transaction contract is recommended for praying for multiple members at once.`,
        });

        // In a real-world scenario, this loop would be replaced by a single
        // call to a multicall or batch transaction contract to avoid multiple signature popups.
        for (const member of membersToPrayFor) {
            try {
                const tx = await atiaContract.activateStreak(member.walletAddress);
                toast({ title: `Transaction Sent for ${member.name}`, description: `Waiting for confirmation...`, duration: 2000 });
                await tx.wait();
                toast({ title: `Prayer Successful for ${member.name}`, description: `${member.name} has received Atia's Blessing.` });
            } catch(memberError: any) {
                 console.error(`Failed to pray for ${member.name}`, memberError);
                 toast({ title: `Prayer Failed for ${member.name}`, description: memberError.reason || "The transaction was rejected or failed.", variant: "destructive" });
            }
        }
        
        await fetchPrayerStatuses();

    } catch (error: any) {
        console.error("Error during prayer transaction:", error);
        toast({
            title: "Transaction Error",
            description: error.reason || "An error occurred while sending the transaction.",
            variant: "destructive"
        });
    } finally {
        setTxPending(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-2xl font-headline">Atia's Blessing</h2>
            <p className="text-sm text-muted-foreground">Maintain the guild's daily prayer streaks. Data is read live from the Ronin chain.</p>
        </div>
        {isManager && (
            <Button onClick={handlePrayForAll} disabled={loading || txPending}>
                {txPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                {txPending ? "Sending..." : "Pray for All Members"}
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-4 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div>
                      <div className="h-4 w-24 bg-muted rounded"></div>
                      <div className="h-3 w-16 bg-muted rounded mt-2"></div>
                    </div>
                  </div>
              </CardContent>
            </Card>
          ))
        ) : members.length === 0 ? (
          <p>No members in the guild.</p>
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
                    <p className="font-semibold">{member.name} {currentUser && member.id === currentUser.id ? '(You)' : ''}</p>
                    <p className="text-sm text-muted-foreground">
                      Streak: <span className="font-bold text-primary">{prayerStatus[member.id]?.streak ?? 'N/A'}</span>
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
