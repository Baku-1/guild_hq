import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Gem } from "lucide-react";
import type { Guild } from "@/lib/data";

interface TreasuryTabProps {
  treasury: Guild['treasury'];
}

export function TreasuryTab({ treasury }: TreasuryTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-headline mb-4">Guild Treasury</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gold Reserves</CardTitle>
            <Coins className="h-6 w-6 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {treasury.gold.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total gold in the guild vault.</p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gem Hoard</CardTitle>
            <Gem className="h-6 w-6 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {treasury.gems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Precious gems for special upgrades.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
