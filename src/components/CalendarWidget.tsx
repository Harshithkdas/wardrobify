
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CalendarWidget = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
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
      </CardContent>
    </Card>
  );
};
