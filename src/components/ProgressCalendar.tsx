import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HabitData {
  [date: string]: { completed: boolean }[];
}

export function ProgressCalendar() {
  const [habitData, setHabitData] = useState<HabitData>({});

  useEffect(() => {
    const savedData = localStorage.getItem("habitData");
    if (savedData) {
      setHabitData(JSON.parse(savedData));
    }
  }, []);

  const generateCalendarData = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 119); // Show last 120 days (about 4 months)
    
    const calendarData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateStr = currentDate.toDateString();
      const dayData = habitData[dateStr] || [];
      const completedTasks = dayData.filter(habit => habit.completed).length;
      
      calendarData.push({
        date: new Date(currentDate),
        dateStr,
        completedTasks,
        intensity: getIntensity(completedTasks)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return calendarData;
  };

  const getIntensity = (completedTasks: number) => {
    if (completedTasks === 0) return 0;
    if (completedTasks === 1) return 1;
    if (completedTasks <= 2) return 2;
    if (completedTasks <= 4) return 3;
    return 4;
  };

  const getIntensityClass = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-muted";
      case 1: return "bg-success/20";
      case 2: return "bg-success/40";
      case 3: return "bg-success/60";
      case 4: return "bg-success/80";
      default: return "bg-muted";
    }
  };

  const calendarData = generateCalendarData();
  const totalDays = calendarData.length;
  const activeDays = calendarData.filter(day => day.completedTasks > 0).length;
  const currentStreak = getCurrentStreak(calendarData);

  function getCurrentStreak(data: any[]) {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].completedTasks > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // Group by weeks for display
  const weeks = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">📊 Progress Calendar</CardTitle>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{activeDays} active days in last {totalDays} days</span>
          <span>{currentStreak} day streak</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm border border-border/30 ${getIntensityClass(day.intensity)}`}
                  title={`${day.date.toLocaleDateString()}: ${day.completedTasks} tasks`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted border border-border/30" />
            <div className="w-3 h-3 rounded-sm bg-success/20 border border-border/30" />
            <div className="w-3 h-3 rounded-sm bg-success/40 border border-border/30" />
            <div className="w-3 h-3 rounded-sm bg-success/60 border border-border/30" />
            <div className="w-3 h-3 rounded-sm bg-success/80 border border-border/30" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}