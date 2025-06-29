
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MarketplaceItem, Member } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ShoppingCart, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea";

interface MarketplaceTabProps {
  guildId: string;
  items: MarketplaceItem[];
  currentUser?: Member;
}

export function MarketplaceTab({ guildId, items, currentUser }: MarketplaceTabProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const handleBuy = (item: MarketplaceItem) => {
    toast({
        title: "Initiating Purchase...",
        description: `Please confirm the transaction for ${item.name} in your wallet.`,
    });
    // This is a placeholder for a real blockchain transaction.
    // In a real app, you would use ethers.js or a similar library
    // to interact with a smart contract that handles the sale.
    console.log(`Simulating purchase of ${item.name} for ${item.price.amount} ${item.price.symbol}`);
  }

  const handleCreateListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const newItem: MarketplaceItem = {
        id: `item-${Date.now()}`,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: {
            amount: parseFloat(formData.get('price') as string),
            symbol: formData.get('symbol') as string,
        },
        imageUrl: 'https://placehold.co/400x400.png', // Placeholder image
        sellerId: currentUser.id,
        sellerName: currentUser.name
    };

    try {
        const guildDocRef = doc(db, 'guilds', guildId);
        await updateDoc(guildDocRef, {
            marketplace: arrayUnion(newItem)
        });
        toast({
            title: "Item Listed!",
            description: `${newItem.name} is now available in the marketplace.`
        });
        setOpen(false);
        router.refresh();
    } catch (error) {
        console.error("Error creating listing:", error);
        toast({ title: "Error", description: "Failed to list item.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-headline">Guild Marketplace</h2>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={!currentUser}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    List an Item
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleCreateListing}>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Create a new Listing</DialogTitle>
                        <DialogDescription>
                           Sell an item to your fellow guild members.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Item Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Sword of Valor" className="col-span-3" required/>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-right pt-2">Description</Label>
                            <Textarea id="description" name="description" placeholder="Describe your item..." className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price</Label>
                            <Input id="price" name="price" type="number" placeholder="e.g. 100" className="col-span-2" required step="any" />
                            <Input id="symbol" name="symbol" placeholder="e.g. AXS" className="col-span-1" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>{loading ? "Listing..." : "Create Listing"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.length > 0 ? items.map((item) => (
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
              <CardDescription>Sold by {item.sellerName}</CardDescription>
              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 pt-0">
              <div className="flex items-center gap-2 text-yellow-400 font-bold">
                <Coins className="h-4 w-4" />
                <span>{item.price.amount} {item.price.symbol}</span>
              </div>
              <Button size="sm" onClick={() => handleBuy(item)} disabled={!currentUser || currentUser.id === item.sellerId}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy
              </Button>
            </CardFooter>
          </Card>
        )) : <p className="text-muted-foreground col-span-full">The marketplace is empty.</p>}
      </div>
    </div>
  );
}
