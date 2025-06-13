import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function WeeklyProgress() {
  // Get the last 7 days of data
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      // Get data from localStorage
      const savedData = localStorage.getItem("habitData");
      const habitData = savedData ? JSON.parse(savedData) : {};
      const dayData = habitData[dateString] || [];
      
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayData.filter((h: any) => h.completed).length,
        total: dayData.length || 5, // Default to 5 habits if no data
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return days;
  };

  const weekData = getLast7Days();
  const totalCompleted = weekData.reduce((sum, day) => sum + day.completed, 0);
  const totalPossible = weekData.reduce((sum, day) => sum + day.total, 0);
  const weeklyPercentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">📈 Weekly Momentum</CardTitle>
          <div className="text-sm font-medium text-muted-foreground">
            {weeklyPercentage}% this week
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="day" 
                className="text-muted-foreground text-xs"
              />
              <YAxis 
                className="text-muted-foreground text-xs"
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">{data.date}</p>
                        <p className="text-primary font-medium">
                          {data.completed}/{data.total} habits completed
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{totalCompleted}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalPossible - totalCompleted}</div>
            <div className="text-sm text-muted-foreground">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-info">{weekData.filter(d => d.completed > 0).length}</div>
            <div className="text-sm text-muted-foreground">Active Days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}