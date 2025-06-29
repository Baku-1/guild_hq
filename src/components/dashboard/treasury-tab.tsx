import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Gem, CircleDollarSign } from "lucide-react";
import type { Guild } from "@/lib/data";
import type { LucideProps } from "lucide-react";

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
            <p className="text-muted-foreground col-span-full">The treasury is empty.</p>
        )}
      </div>
    </div>
  );
}
