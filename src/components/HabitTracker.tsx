import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  topic?: string;
  icon: string;
}

interface HabitData {
  [date: string]: Habit[];
}

const DEFAULT_HABITS: Habit[] = [
  { id: "salesforce", name: "Salesforce Practice", completed: false, icon: "☁️" },
  { id: "java", name: "Java Practice", completed: false, icon: "☕" },
  { id: "webdev", name: "Web Dev Course", completed: false, icon: "🌐" },
  { id: "dsa", name: "DSA Questions", completed: false, icon: "🧮" },
  { id: "fitness", name: "Fitness", completed: false, icon: "💪" },
];

export function HabitTracker() {
  const { toast } = useToast();
  const today = new Date().toDateString();
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("habitData");
    if (savedData) {
      const habitData: HabitData = JSON.parse(savedData);
      if (habitData[today]) {
        setHabits(habitData[today]);
      }
    }
  }, [today]);

  const saveHabits = (updatedHabits: Habit[]) => {
    const savedData = localStorage.getItem("habitData");
    const habitData: HabitData = savedData ? JSON.parse(savedData) : {};
    habitData[today] = updatedHabits;
    localStorage.setItem("habitData", JSON.stringify(habitData));
  };

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    
    const habit = updatedHabits.find(h => h.id === id);
    if (habit?.completed) {
      toast({
        title: "Great work! 🎉",
        description: `${habit.name} completed for today`,
      });
    }
  };

  const updateTopic = (id: string, topic: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, topic } : habit
    );
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const addCustomHabit = () => {
    if (!newHabit.trim()) return;
    
    const customHabit: Habit = {
      id: `custom-${Date.now()}`,
      name: newHabit,
      completed: false,
      icon: "⭐"
    };
    
    const updatedHabits = [...habits, customHabit];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    setNewHabit("");
    
    toast({
      title: "Habit added! 📝",
      description: `${newHabit} added to your daily tracker`,
    });
  };

  const completedCount = habits.filter(h => h.completed).length;
  const completionPercentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Daily Habits</CardTitle>
          <div className="text-sm font-medium text-muted-foreground">
            {completedCount}/{habits.length} • {completionPercentage}%
          </div>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-success h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <Checkbox
              checked={habit.completed}
              onCheckedChange={() => toggleHabit(habit.id)}
              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
            />
            <span className="text-lg">{habit.icon}</span>
            <div className="flex-1">
              <label className={`font-medium cursor-pointer ${
                habit.completed ? "line-through text-muted-foreground" : "text-foreground"
              }`}>
                {habit.name}
              </label>
              {(habit.id === "salesforce" || habit.id === "java" || habit.id === "webdev" || habit.id === "dsa") && (
                <Input
                  placeholder="What topic did you cover?"
                  value={habit.topic || ""}
                  onChange={(e) => updateTopic(habit.id, e.target.value)}
                  className="mt-2 text-sm"
                />
              )}
            </div>
          </div>
        ))}
        
        <div className="flex gap-2 pt-4 border-t border-border">
          <Input
            placeholder="Add custom habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCustomHabit()}
            className="flex-1"
          />
          <Button onClick={addCustomHabit} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}