import { useState } from "react";
import CalendarView from "../CalendarView";
import { addDays, subDays } from "date-fns";

export default function CalendarViewExample() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  const today = new Date();
  const periodDays = [
    subDays(today, 25),
    subDays(today, 24),
    subDays(today, 23),
    subDays(today, 22),
    subDays(today, 21),
  ];
  
  const ovulationDay = subDays(today, 14);
  const fertileDays = [
    subDays(today, 18),
    subDays(today, 17),
    subDays(today, 16),
    subDays(today, 15),
    subDays(today, 14),
    subDays(today, 13),
  ];

  return (
    <div className="p-4">
      <CalendarView
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onDayClick={(date) => console.log("Day clicked:", date)}
        periodDays={periodDays}
        ovulationDay={ovulationDay}
        fertileDays={fertileDays}
      />
    </div>
  );
}
