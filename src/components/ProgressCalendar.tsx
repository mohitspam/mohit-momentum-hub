import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HabitData {
  [date: string]: { completed: boolean }[];
}

export function ProgressCalendar() {
  const [habitData, setHabitData] = useState<HabitData>({});
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const savedData = localStorage.getItem("habitData");
    if (savedData) {
      setHabitData(JSON.parse(savedData));
    }
  }, []);

  const generateCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const calendarData = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarData.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toDateString();
      const dayData = habitData[dateStr] || [];
      const completedTasks = dayData.filter(habit => habit.completed).length;
      
      calendarData.push({
        date,
        dateStr,
        completedTasks,
        intensity: getIntensity(completedTasks),
        day
      });
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
  const monthDays = calendarData.filter(day => day !== null);
  const activeDays = monthDays.filter(day => day && day.completedTasks > 0).length;
  const currentStreak = getCurrentStreak(monthDays);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function getCurrentStreak(data: any[]) {
    let streak = 0;
    const today = new Date().toDateString();
    const todayIndex = data.findIndex(day => day && day.dateStr === today);
    
    if (todayIndex === -1) return 0;
    
    for (let i = todayIndex; i >= 0; i--) {
      if (data[i] && data[i].completedTasks > 0) {
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">📊 Progress Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{activeDays} active days this month</span>
          <span>{currentStreak} day streak</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-center text-[10px]">{day}</div>
            ))}
          </div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-4 h-4 rounded-sm border border-border/20 ${
                    day ? getIntensityClass(day.intensity) : 'bg-transparent border-transparent'
                  }`}
                  title={day ? `${day.date.toLocaleDateString()}: ${day.completedTasks} tasks` : ''}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-sm bg-muted border border-border/20" />
            <div className="w-2 h-2 rounded-sm bg-success/20 border border-border/20" />
            <div className="w-2 h-2 rounded-sm bg-success/40 border border-border/20" />
            <div className="w-2 h-2 rounded-sm bg-success/60 border border-border/20" />
            <div className="w-2 h-2 rounded-sm bg-success/80 border border-border/20" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}