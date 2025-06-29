
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ChatMessage, Member } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface ChatTabProps {
  guildId: string;
  initialMessages: ChatMessage[];
  currentUserId: string;
  members: Member[];
}

export function ChatTab({ guildId, initialMessages, currentUserId, members }: ChatTabProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const membersMap = new Map(members.map(m => [m.id, m]));
  const currentUser = membersMap.get(currentUserId);

  useEffect(() => {
    // Set up a real-time listener for chat messages
    const guildDocRef = doc(db, 'guilds', guildId);
    const unsubscribe = onSnapshot(guildDocRef, (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().chatMessages || []);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [guildId]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser) return;
    setLoading(true);

    const message: ChatMessage = {
      id: `msg-${Date.now()}`, // Firestore doesn't need this, but good for keys
      authorId: currentUser.id,
      author: currentUser.name,
      avatarUrl: currentUser.avatarUrl,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      const guildDocRef = doc(db, "guilds", guildId);
      await updateDoc(guildDocRef, {
        chatMessages: arrayUnion(message)
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // This scrolls the chat to the bottom when new messages are added.
    if (scrollAreaRef.current) {
      setTimeout(() => {
         scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
      }, 100)
    }
  }, [messages]);

  return (
    <div>
      <h2 className="text-2xl font-headline mb-4">Guild Chat</h2>
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
            <h3 className="font-semibold">#general</h3>
        </CardHeader>
        <CardContent className="flex-grow p-0">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3">
                    <Avatar>
                        <AvatarImage src={message.avatarUrl} alt={message.author} data-ai-hint="fantasy character" />
                        <AvatarFallback>{message.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-baseline gap-2">
                        <p className="font-semibold text-primary">{message.author}</p>
                        <span className="text-xs text-muted-foreground">{new Date(message.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-foreground/90">{message.text}</p>
                    </div>
                    </div>
                ))}
                </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
