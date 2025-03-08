
import * as React from "react";
import { useState } from "react";
import { SendHorizonal, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your outfit advisor. I can suggest outfit combinations based on your wardrobe, occasions, or weather. What would you like help with today?",
    isUser: false,
  },
];

export const OutfitAdvisor = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const responses = [
        "I suggest trying a casual outfit with your blue jeans and that new white shirt you added recently. Perfect for a day out!",
        "For the current weather, I'd recommend layering with your light jacket and a scarf.",
        "How about creating a business casual look with your grey pants and navy blazer?",
        "Your recent additions would pair well together - the black pants with that patterned top would make a great outfit.",
        "Based on the season, your floral dress with a light cardigan would be a perfect choice!"
      ];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot size={18} />
          Outfit Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "mb-4 flex",
                message.isUser ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[85%]",
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for outfit recommendations..."
              className="flex-1 min-h-10 max-h-32 resize-none border rounded-md p-2"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              className="flex-shrink-0"
              disabled={isLoading || !input.trim()}
            >
              <SendHorizonal size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
