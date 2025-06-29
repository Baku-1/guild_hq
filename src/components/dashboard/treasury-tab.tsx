
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Gem, CircleDollarSign, Gift, HandCoins, Landmark } from "lucide-react";
import type { Guild, Member, TreasuryNft } from "@/lib/data";
import type { LucideProps } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TreasuryTabProps {
  guildId: string;
  treasury: Guild['treasury'];
  members: Member[];
  currentUser?: Member;
}

const getTokenIcon = (symbol: string): React.ComponentType<LucideProps> => {
    switch (symbol.toUpperCase()) {
        case 'AXS':
            return Gem;
        case 'SLP':
            return Coins;
        default:
            return CircleDollarSign;
    }
}

export function TreasuryTab({ guildId, treasury, members, currentUser }: TreasuryTabProps) {
  const [donateOpen, setDonateOpen] = useState(false);
  const [disburseOpen, setDisburseOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isManager = currentUser?.role === 'Guild Master' || currentUser?.role === 'Treasury Manager' || currentUser?.role === 'Officer';
  
  // This is mock data. In a real app, you'd fetch this from the user's wallet.
  const userNfts: TreasuryNft[] = currentUser ? [
    { id: 'nft-1', name: "Mystic Axie", imageUrl: 'https://placehold.co/150x150.png', ownerId: currentUser.id },
    { id: 'nft-2', name: "Jade Reptile", imageUrl: 'https://placehold.co/150x150.png', ownerId: currentUser.id },
  ] : [];

  const handleTokenDonate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const tokenSymbol = formData.get('token') as string;
    const amount = parseFloat(formData.get('amount') as string);

    toast({
        title: "Confirm in Wallet",
        description: "Please approve the token donation in your wallet.",
    });

    try {
        console.log(`Simulating transaction for donating ${amount} ${tokenSymbol}...`);
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        const guildDocRef = doc(db, 'guilds', guildId);
        const docSnap = await getDoc(guildDocRef);
        if (!docSnap.exists()) throw new Error("Guild not found");
        
        const currentTreasury = docSnap.data().treasury;
        const tokenIndex = currentTreasury.tokens.findIndex((t:any) => t.symbol === tokenSymbol);
        
        if (tokenIndex > -1) {
            currentTreasury.tokens[tokenIndex].balance += amount;
        } else {
            currentTreasury.tokens.push({ symbol: tokenSymbol, balance: amount });
        }
        
        await updateDoc(guildDocRef, { treasury: currentTreasury });

        toast({
            title: "Donation Successful!",
            description: `Thank you for donating ${amount} ${tokenSymbol}.`,
        });
        setDonateOpen(false);
        router.refresh();
    } catch(error) {
        console.error("Error donating tokens:", error);
        toast({ title: "Error", description: "Failed to process donation.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const handleNftDonate = async (nft: TreasuryNft) => {
     setLoading(true);
     toast({
        title: "Confirm in Wallet",
        description: `Please approve the donation of ${nft.name} in your wallet.`,
     });

     try {
        console.log(`Simulating transaction for donating NFT ${nft.name}...`);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const guildDocRef = doc(db, 'guilds', guildId);
        await updateDoc(guildDocRef, {
            'treasury.nfts': arrayUnion(nft)
        });
        toast({
            title: "NFT Donation Successful!",
            description: `You have donated ${nft.name} to the guild.`
        });
        setDonateOpen(false);
        router.refresh();
     } catch (error) {
        console.error("Error donating NFT:", error);
        toast({ title: "Error", description: "Failed to donate NFT.", variant: "destructive" });
     } finally {
        setLoading(false);
     }
  }

  const handleDisburse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Disbursement Not Implemented",
      description: "This feature requires a secure backend and smart contract.",
    });
    setDisburseOpen(false);
  };

  const handleWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Withdrawal Not Implemented",
      description: "This feature requires multi-sig authorization and a secure backend.",
    });
    setWithdrawOpen(false);
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline">Guild Treasury</h2>
        <div className="flex gap-2">
          {isManager && (
            <>
              <Dialog open={disburseOpen} onOpenChange={setDisburseOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline"><HandCoins className="mr-2 h-4 w-4" /> Disburse</Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleDisburse}>
                    <DialogHeader>
                      <DialogTitle className="font-headline">Disburse Funds</DialogTitle>
                      <DialogDescription>Distribute tokens to guild members.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                       <p className="text-sm text-muted-foreground">This feature is a placeholder. A real implementation would require a form to select members and amounts to disburse, followed by a secure transaction approval process.</p>
                    </div>
                    <Button type="submit" className="w-full">Confirm Disbursement</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline"><Landmark className="mr-2 h-4 w-4" /> Withdraw</Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleWithdraw}>
                    <DialogHeader>
                      <DialogTitle className="font-headline">Withdraw Funds</DialogTitle>
                      <DialogDescription>Withdraw tokens from the guild treasury to a specified wallet.</DialogDescription>
                    </DialogHeader>
                     <div className="grid gap-4 py-4">
                       <p className="text-sm text-muted-foreground">This feature is a placeholder. A real implementation would require fields for token, amount, and recipient address, followed by a secure transaction approval process (e.g., multi-sig).</p>
                    </div>
                    <Button type="submit" className="w-full">Confirm Withdrawal</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
          <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
            <DialogTrigger asChild>
              <Button disabled={!currentUser}>
                <Gift className="mr-2 h-4 w-4" />
                Donate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="font-headline">Donate to the Guild</DialogTitle>
                <DialogDescription>
                  Contribute tokens or NFTs to support the guild. Your generosity strengthens us all.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="tokens" className="w-full pt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tokens">Donate Tokens</TabsTrigger>
                  <TabsTrigger value="nfts">Donate NFT</TabsTrigger>
                </TabsList>
                <TabsContent value="tokens" className="pt-4">
                  <form onSubmit={handleTokenDonate}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="token" className="text-right">
                          Token
                        </Label>
                        <Select name="token" required>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a token" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AXS">AXS</SelectItem>
                            <SelectItem value="SLP">SLP</SelectItem>
                            <SelectItem value="RON">RON</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount
                        </Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          placeholder="0.0"
                          className="col-span-3"
                          required
                          step="any"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Processing..." : "Confirm Token Donation"}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="nfts" className="pt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select one of your NFTs to donate to the guild vault. This action is irreversible.
                    </p>
                    <div className="max-h-[250px] overflow-y-auto pr-2">
                      {userNfts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userNfts.map((nft) => (
                            <div key={nft.id} className="border rounded-lg p-3 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={nft.imageUrl}
                                  alt={nft.name}
                                  width={48}
                                  height={48}
                                  className="rounded-md bg-muted"
                                  data-ai-hint="axie character"
                                />
                                <p className="text-sm font-semibold">{nft.name}</p>
                              </div>
                              <Button size="sm" onClick={() => handleNftDonate(nft)} disabled={loading}>
                                Donate
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <p>You have no NFTs available to donate.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-headline text-primary mb-4">Tokens</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treasury.tokens.map((token) => {
            const Icon = getTokenIcon(token.symbol);
            return (
              <Card key={token.symbol} className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{token.symbol} Balance</CardTitle>
                  <Icon className="h-6 w-6 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {token.balance.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Total {token.symbol} in the guild vault.</p>
                </CardContent>
              </Card>
            )
          })}
          {treasury.tokens.length === 0 && (
              <p className="text-muted-foreground col-span-full">The token vault is empty.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-headline text-primary mb-4">Vaulted NFTs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {treasury.nfts.map((nft) => (
                <Card key={nft.id} className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative aspect-square w-full">
                            <Image src={nft.imageUrl} alt={nft.name} fill className="object-cover" data-ai-hint="axie character" />
                        </div>
                         <div className="p-3">
                            <p className="font-semibold truncate">{nft.name}</p>
                            <p className="text-xs text-muted-foreground truncate">ID: {nft.id}</p>
                         </div>
                    </CardContent>
                </Card>
            ))}
             {treasury.nfts.length === 0 && (
                <p className="text-muted-foreground col-span-full">The NFT vault is empty.</p>
            )}
        </div>
      </div>
    </div>
  );
}
