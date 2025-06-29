
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Gem, CircleDollarSign, Gift, HandCoins, Landmark } from "lucide-react";
import type { Guild, Member } from "@/lib/data";
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
  treasury: Guild['treasury'];
  members: Member[];
  currentUserId: string;
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

export function TreasuryTab({ treasury, members, currentUserId }: TreasuryTabProps) {
  const [donateOpen, setDonateOpen] = useState(false);
  const [disburseOpen, setDisburseOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const { toast } = useToast();

  const currentUser = members.find(m => m.id === currentUserId);
  const isManager = currentUser?.role === 'Guild Master' || currentUser?.role === 'Treasury Manager';

  // TODO: Replace with an API call to fetch the current user's NFTs.
  const userNfts: { id: string, name: string, imageUrl: string }[] = [];

  const handleTokenDonate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Replace with a call to the user's wallet to initiate a transaction.
    // e.g., signAndSendTransaction({ to: guildWallet, amount, token });
    const formData = new FormData(e.currentTarget);
    const token = formData.get('token');
    const amount = formData.get('amount');
    console.log(`Donating ${amount} ${token}... In a real app, this would prompt a wallet signature.`);
    
    toast({
      title: "Donation Submitted!",
      description: `Please approve the transaction in your wallet to donate ${amount} ${token}.`,
    });
    setDonateOpen(false);
  };

  const handleNftDonate = (nftName: string) => {
     // TODO: Replace with a call to the user's wallet to initiate an NFT transfer.
     console.log(`Donating ${nftName}... In a real app, this would prompt a wallet signature.`);
     toast({
      title: "NFT Donation Submitted!",
      description: `Please approve the transaction in your wallet to donate ${nftName}.`,
    });
    setDonateOpen(false);
  }

  const handleDisburse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Replace with your backend API call for disbursing funds.
    // This would likely involve a complex form and manager approval.
    console.log("Disbursing funds... In a real app, this would call a backend API.");
    toast({
      title: "Disbursement Submitted",
      description: "The disbursement request has been sent for approval.",
    });
    setDisburseOpen(false);
  };

  const handleWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Replace with your backend API call for withdrawing funds.
    // This would likely involve multi-sig approval for security.
    console.log("Withdrawing funds... In a real app, this would call a backend API.");
    toast({
      title: "Withdrawal Submitted",
      description: "The withdrawal request has been sent for approval.",
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
              {/* Disburse Dialog */}
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

              {/* Withdrawal Dialog */}
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

          {/* Donate Dialog (existing) */}
          <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
            <DialogTrigger asChild>
              <Button>
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
                    <Button type="submit" className="w-full">
                      Confirm Token Donation
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
                              <Button size="sm" onClick={() => handleNftDonate(nft.name)}>
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
