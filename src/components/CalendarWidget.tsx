
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const CalendarWidget = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState<{[key: string]: string}>({});
  const [newEventName, setNewEventName] = React.useState<string>("");
  
  // Function to format date as string key
  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Initialize with some sample events
  React.useEffect(() => {
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
  }, []);
  
  // Get current date's event
  const currentDateKey = date ? formatDateKey(date) : "";
  const currentDateEvent = date ? events[currentDateKey] : undefined;
  
  // Handle adding a new event
  const handleAddEvent = () => {
    if (date && newEventName.trim()) {
      setEvents(prev => ({
        ...prev,
        [formatDateKey(date)]: newEventName.trim()
      }));
      setNewEventName("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddEvent();
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        
        {date && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium">
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            {currentDateEvent ? (
              <p className="text-sm mt-1">Planned outfit: {currentDateEvent}</p>
            ) : (
              <div className="mt-2">
                <Label htmlFor="event-name" className="text-sm text-gray-500">Add an outfit for this day:</Label>
                <div className="flex mt-1">
                  <input
                    id="event-name"
                    type="text"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-3 py-1 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter outfit description"
                  />
                  <button 
                    onClick={handleAddEvent}
                    disabled={!newEventName.trim()}
                    className="bg-blue-500 text-white px-3 py-1 rounded-r-md text-sm disabled:bg-blue-300"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
