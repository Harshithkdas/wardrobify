
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface OutfitEvent {
  date: string;
  outfit: string;
}

export const CalendarWidget = () => {
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState<{[key: string]: string}>({});
  const [newEventName, setNewEventName] = React.useState<string>("");
  const [loadedOutfits, setLoadedOutfits] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  // Function to format date as string key
  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Load saved outfits from Supabase
  React.useEffect(() => {
    if (user) {
      const fetchOutfits = async () => {
        const { data, error } = await supabase
          .from('outfits')
          .select('name')
          .eq('user_id', user.id);
        
        if (!error && data) {
          setLoadedOutfits(data.map(item => item.name));
        }
      };
      
      fetchOutfits();
    }
  }, [user]);
  
  // Load calendar events from Supabase
  React.useEffect(() => {
    if (user) {
      const fetchCalendarEvents = async () => {
        const { data, error } = await supabase
          .from('calendar_events')
          .select('date, outfit')
          .eq('user_id', user.id);
          
        if (!error && data) {
          const formattedEvents: {[key: string]: string} = {};
          data.forEach((event: OutfitEvent) => {
            formattedEvents[event.date] = event.outfit;
          });
          setEvents(formattedEvents);
        } else if (error) {
          console.error("Error fetching calendar events:", error);
          
          // If error, set some sample events
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          
          setEvents({
            [formatDateKey(today)]: "Casual day outfit",
            [formatDateKey(tomorrow)]: "Business meeting outfit",
            [formatDateKey(nextWeek)]: "Dinner party outfit"
          });
        }
      };
      
      fetchCalendarEvents();
    }
  }, [user]);
  
  // Get current date's event
  const currentDateKey = date ? formatDateKey(date) : "";
  const currentDateEvent = date ? events[currentDateKey] : undefined;
  
  // Handle adding a new event
  const handleAddEvent = async () => {
    if (!user) {
      toast.error("You must be logged in to save outfits to calendar");
      return;
    }
    
    if (date && newEventName.trim()) {
      setIsLoading(true);
      
      try {
        // Update local state
        setEvents(prev => ({
          ...prev,
          [formatDateKey(date)]: newEventName.trim()
        }));
        
        // Save to database using upsert with onConflict
        const { error } = await supabase
          .from('calendar_events')
          .upsert({
            user_id: user.id,
            date: formatDateKey(date),
            outfit: newEventName.trim()
          }, { 
            onConflict: 'user_id,date' 
          });
          
        if (error) throw error;
        toast.success("Outfit scheduled for this date");
      } catch (error) {
        console.error("Error saving calendar event:", error);
        toast.error("Failed to save outfit to calendar");
      } finally {
        setIsLoading(false);
        setNewEventName("");
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddEvent();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Outfit Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
            <div className="w-full md:w-1/2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border pointer-events-auto"
              />
            </div>
            
            <div className="w-full md:w-1/2">
              {date && (
                <div className="p-4 bg-gray-50 rounded-md h-full">
                  <h3 className="font-medium">
                    {date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  
                  {currentDateEvent ? (
                    <div className="mt-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-500">Planned Outfit:</h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setNewEventName(currentDateEvent);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                      <p className="text-lg mt-2 p-3 bg-white rounded border border-gray-200">
                        {currentDateEvent}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-2">No outfit planned for this day.</p>
                  )}
                  
                  <div className="mt-6">
                    <Label htmlFor="event-name" className="text-sm font-medium">
                      {currentDateEvent ? "Change outfit for this day:" : "Add an outfit for this day:"}
                    </Label>
                    <div className="flex mt-1">
                      <input
                        id="event-name"
                        type="text"
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-3 py-2 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter outfit description"
                        list="saved-outfits"
                      />
                      <datalist id="saved-outfits">
                        {loadedOutfits.map((outfit, index) => (
                          <option key={index} value={outfit} />
                        ))}
                      </datalist>
                      <Button 
                        onClick={handleAddEvent}
                        disabled={!newEventName.trim() || isLoading}
                        className="rounded-l-none"
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
