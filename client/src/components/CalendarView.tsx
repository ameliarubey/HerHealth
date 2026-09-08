import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from "date-fns";

interface CalendarDay {
  date: Date;
  isPeriod?: boolean;
  isOvulation?: boolean;
  isFertile?: boolean;
  isToday?: boolean;
}

interface CalendarViewProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
  periodDays?: Date[];
  ovulationDay?: Date;
  fertileDays?: Date[];
}

export default function CalendarView({
  selectedMonth,
  onMonthChange,
  onDayClick,
  periodDays = [],
  ovulationDay,
  fertileDays = [],
}: CalendarViewProps) {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const today = new Date();

  const isDayInArray = (day: Date, array: Date[]) => 
    array.some(d => isSameDay(d, day));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">{format(selectedMonth, "MMMM yyyy")}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
            data-testid="button-prev-month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onMonthChange(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
            data-testid="button-next-month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isPeriod = isDayInArray(day, periodDays);
          const isOvulation = ovulationDay && isSameDay(day, ovulationDay);
          const isFertile = isDayInArray(day, fertileDays);
          const isToday = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, selectedMonth);

          return (
            <button
              key={index}
              onClick={() => onDayClick(day)}
              className={`
                aspect-square p-2 rounded-lg text-sm font-medium
                hover-elevate active-elevate-2
                ${!isCurrentMonth ? "text-muted-foreground opacity-50" : ""}
                ${isToday ? "ring-2 ring-primary" : ""}
                ${isPeriod ? "bg-primary text-primary-foreground" : ""}
                ${isOvulation && !isPeriod ? "bg-amber-500 text-white" : ""}
                ${isFertile && !isPeriod && !isOvulation ? "bg-primary/20" : ""}
              `}
              data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-muted-foreground">Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span className="text-muted-foreground">Ovulation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20" />
          <span className="text-muted-foreground">Fertile</span>
        </div>
      </div>
    </Card>
  );
}
