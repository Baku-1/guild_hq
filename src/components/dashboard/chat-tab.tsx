
"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, Member } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatTabProps {
  messages: ChatMessage[];
  currentUserId: string;
}

export function ChatTab({ messages: initialMessages, currentUserId }: ChatTabProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // TODO: Replace with your API call to send a chat message.
    // The API should then return the new message to be added to the state,
    // or you could use a real-time service like Firebase Firestore.

    // This is a temporary solution for UI testing.
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: "You", // This should be the current user's name from your auth system.
      avatarUrl: "https://placehold.co/100x100.png",
      text: newMessage,
      timestamp: "Just now",
    };
    setMessages([...messages, message]);
    setNewMessage("");
  };

  useEffect(() => {
    // This scrolls the chat to the bottom when new messages are added.
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
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
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
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
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
