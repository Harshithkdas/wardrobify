
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CalendarWidget = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = React.useState<{[key: string]: string}>({});
  
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
  const currentDateEvent = date ? events[formatDateKey(date)] : undefined;
  
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
              <p className="text-sm text-gray-500 mt-1">No outfit planned for this day</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
