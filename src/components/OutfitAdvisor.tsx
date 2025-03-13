
import * as React from "react";
import { useState, useEffect } from "react";
import { SendHorizonal, Bot, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  outfitSuggestion?: {
    occasion: string;
    items: OutfitItem[];
  };
};

type OutfitItem = {
  id: string;
  imageUrl: string;
  name: string;
  category: string;
};

type ClothingItem = {
  id: string;
  name: string;
  category: string;
  color: string;
  image: string;
  occasion: string[];
};

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your outfit advisor. I can suggest outfit combinations based on your wardrobe and occasions. Try asking me for outfit suggestions for specific occasions like 'What should I wear to a business meeting?' or 'Suggest an outfit for a beach day'.",
    isUser: false,
  },
];

export const OutfitAdvisor = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userWardrobe, setUserWardrobe] = useState<ClothingItem[]>([]);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Load user's wardrobe items
  useEffect(() => {
    if (user) {
      const fetchUserWardrobe = async () => {
        try {
          const { data, error } = await supabase
            .from('clothing_items')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) {
            throw error;
          }
          
          setUserWardrobe(data || []);
        } catch (error) {
          console.error('Error fetching wardrobe:', error);
        }
      };
      
      fetchUserWardrobe();
    }
  }, [user]);
  
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to identify occasion from user input
  const identifyOccasion = (input: string): string | null => {
    const occasions = [
      'casual', 'formal', 'business', 'party', 'wedding', 'date', 
      'interview', 'work', 'office', 'beach', 'vacation', 'dinner',
      'sports', 'gym', 'workout', 'hiking', 'travel', 'winter', 'summer'
    ];
    
    const inputLower = input.toLowerCase();
    
    for (const occasion of occasions) {
      if (inputLower.includes(occasion)) {
        return occasion;
      }
    }
    
    return null;
  };
  
  // Function to find items suitable for an occasion
  const findItemsForOccasion = (occasion: string): OutfitItem[] => {
    if (!userWardrobe || userWardrobe.length === 0) {
      return [];
    }
    
    // Map occasion to related tags
    const occasionMap: Record<string, string[]> = {
      'casual': ['Casual', 'Summer', 'All'],
      'formal': ['Formal', 'Business', 'All'],
      'business': ['Business', 'Formal', 'All'],
      'party': ['Party', 'Casual', 'All'],
      'wedding': ['Formal', 'Party', 'All'],
      'date': ['Casual', 'Party', 'All'],
      'interview': ['Business', 'Formal', 'All'],
      'work': ['Business', 'Casual', 'All'],
      'office': ['Business', 'Formal', 'All'],
      'beach': ['Beach', 'Summer', 'Casual', 'All'],
      'vacation': ['Beach', 'Summer', 'Casual', 'All'],
      'dinner': ['Casual', 'Formal', 'All'],
      'sports': ['Sports', 'Casual', 'All'],
      'gym': ['Sports', 'Casual', 'All'],
      'workout': ['Sports', 'Casual', 'All'],
      'hiking': ['Sports', 'Casual', 'All'],
      'travel': ['Casual', 'All'],
      'winter': ['Winter', 'All'],
      'summer': ['Summer', 'Beach', 'All']
    };
    
    const relevantTags = occasionMap[occasion] || ['Casual', 'All'];
    
    // Find items with matching occasion tags
    const matchingItems: Record<string, OutfitItem[]> = {
      'Tops': [],
      'Bottoms': [],
      'Outerwear': [],
      'Shoes': [],
      'Accessories': []
    };
    
    userWardrobe.forEach(item => {
      const hasRelevantTag = item.occasion.some(tag => 
        relevantTags.includes(tag)
      );
      
      if (hasRelevantTag) {
        const category = item.category;
        if (matchingItems[category]) {
          matchingItems[category].push({
            id: item.id,
            imageUrl: item.image,
            name: item.name,
            category: item.category
          });
        }
      }
    });
    
    // If wardrobe is empty or no matching items, return empty array
    if (Object.values(matchingItems).every(items => items.length === 0)) {
      return [];
    }
    
    // Create an outfit with one item from each category if available
    const outfit: OutfitItem[] = [];
    
    // Try to select one item from each category
    Object.entries(matchingItems).forEach(([category, items]) => {
      if (items.length > 0) {
        // Select random item from category
        const randomIndex = Math.floor(Math.random() * items.length);
        outfit.push(items[randomIndex]);
      }
    });
    
    return outfit;
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
    
    // Process the user's request
    setTimeout(() => {
      const occasion = identifyOccasion(input);
      let aiResponse: Message;
      
      if (occasion) {
        const outfitItems = findItemsForOccasion(occasion);
        
        if (outfitItems.length > 0) {
          // Create categorized response
          const tops = outfitItems.filter(item => item.category === 'Tops');
          const bottoms = outfitItems.filter(item => item.category === 'Bottoms');
          const outerwear = outfitItems.filter(item => item.category === 'Outerwear');
          const shoes = outfitItems.filter(item => item.category === 'Shoes');
          
          let responseText = `For a ${occasion} occasion, I suggest this outfit from your wardrobe:`;
          
          aiResponse = {
            id: Date.now().toString(),
            content: responseText,
            isUser: false,
            outfitSuggestion: {
              occasion,
              items: outfitItems
            }
          };
        } else {
          aiResponse = {
            id: Date.now().toString(),
            content: `I couldn't find suitable items for a ${occasion} occasion in your wardrobe. Try adding more items with occasion tags, or ask about a different occasion.`,
            isUser: false,
          };
        }
      } else if (input.toLowerCase().includes('help') || input.toLowerCase().includes('how')) {
        aiResponse = {
          id: Date.now().toString(),
          content: "You can ask me for outfit suggestions for specific occasions like 'What should I wear to a business meeting?', 'Suggest a casual outfit', or 'Beach day outfit ideas'. I'll look at your wardrobe and recommend items that would work well together.",
          isUser: false,
        };
      } else {
        aiResponse = {
          id: Date.now().toString(),
          content: "I'm not sure what occasion you're looking for. Try asking for outfit suggestions for specific occasions like 'business', 'casual', 'party', 'beach', etc.",
          isUser: false,
        };
      }
      
      setMessages((prev) => [...prev, aiResponse]);
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
                
                {/* Outfit suggestion display */}
                {message.outfitSuggestion && (
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Tag size={14} />
                      {message.outfitSuggestion.occasion.charAt(0).toUpperCase() + message.outfitSuggestion.occasion.slice(1)} Outfit
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {message.outfitSuggestion.items.map(item => (
                        <div key={item.id} className="relative">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-24 object-cover rounded"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                            {item.category}: {item.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              placeholder="Ask for outfit recommendations for an occasion..."
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
