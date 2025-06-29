import type { MarketplaceItem } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface MarketplaceTabProps {
  items: MarketplaceItem[];
}

export function MarketplaceTab({ items }: MarketplaceTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-headline mb-4">Guild Marketplace</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader className="p-0">
              <div className="relative aspect-square w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover rounded-t-lg"
                  data-ai-hint="fantasy item"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="font-headline text-lg mb-2">{item.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 pt-0">
              <div className="flex items-center gap-2 text-yellow-400 font-bold">
                <Coins className="h-4 w-4" />
                <span>{item.price}</span>
              </div>
              <Button size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
