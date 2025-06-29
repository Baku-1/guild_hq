import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Gem, CircleDollarSign, ShieldQuestion } from "lucide-react";
import type { Guild } from "@/lib/data";
import type { LucideProps } from "lucide-react";
import Image from "next/image";

interface TreasuryTabProps {
  treasury: Guild['treasury'];
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

export function TreasuryTab({ treasury }: TreasuryTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-headline mb-4">Guild Treasury</h2>
      
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
