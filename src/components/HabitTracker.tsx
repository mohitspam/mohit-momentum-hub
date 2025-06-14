import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/supabaseClient"; // 🔄 Import Supabase

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  topic?: string;
  icon: string;
  link?: string;
}

const DEFAULT_HABITS: Habit[] = [
  { id: "salesforce", name: "Salesforce Practice", completed: false, icon: "☁️", link: "https://trailhead.salesforce.com/" },
  { id: "java", name: "Java Practice", completed: false, icon: "☕", link: "https://docs.oracle.com/javase/" },
  { id: "webdev", name: "Web Dev Course", completed: false, icon: "🌐", link: "https://developer.mozilla.org/" },
  { id: "dsa", name: "DSA Questions", completed: false, icon: "🧮", link: "https://leetcode.com/" },
  { id: "fitness", name: "Fitness", completed: false, icon: "💪", link: "https://www.youtube.com/results?search_query=workout" },
];

export function HabitTracker() {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [userId, setUserId] = useState<string | null>(null);

  // 🔄 Get Supabase user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  // 🔄 Fetch habits from Supabase
  useEffect(() => {
    const fetchHabits = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today);

      if (error) {
        console.error("Error fetching habit logs:", error);
        return;
      }

      // Merge with DEFAULT_HABITS
      const mergedHabits = DEFAULT_HABITS.map((defaultHabit) => {
        const log = data.find((d) => d.habit_id === defaultHabit.id);
        return {
          ...defaultHabit,
          completed: log?.completed ?? false,
          topic: log?.topic ?? "",
        };
      });

      // Add any custom habits from DB not in default
      const customLogs = data.filter(
        (log) => !DEFAULT_HABITS.find((h) => h.id === log.habit_id)
      );
      const customHabits: Habit[] = customLogs.map((log) => ({
        id: log.habit_id,
        name: log.name || log.habit_id,
        completed: log.completed,
        topic: log.topic || "",
        icon: "⭐",
      }));

      setHabits([...mergedHabits, ...customHabits]);
    };

    fetchHabits();
  }, [userId, today]);

  // 🔄 Upsert log to Supabase
  const upsertHabit = async (habit: Habit) => {
    if (!userId) return;
    const { error } = await supabase.from("habit_logs").upsert({
      user_id: userId,
      habit_id: habit.id,
      name: habit.name,
      completed: habit.completed,
      topic: habit.topic || "",
      date: today,
    });

    if (error) {
      console.error("Failed to save habit log:", error);
    }
  };

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    const updatedHabit = updatedHabits.find((h) => h.id === id);
    if (updatedHabit) upsertHabit(updatedHabit);

    if (updatedHabit?.completed) {
      toast({
        title: "Great work! 🎉",
        description: `${updatedHabit.name} completed for today`,
      });
    }
  };

  const updateTopic = (id: string, topic: string) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, topic } : habit
    );
    setHabits(updatedHabits);
    const updatedHabit = updatedHabits.find((h) => h.id === id);
    if (updatedHabit) upsertHabit(updatedHabit);
  };

  const addCustomHabit = () => {
    if (!newHabit.trim()) return;

    const customHabit: Habit = {
      id: `custom-${Date.now()}`,
      name: newHabit,
      completed: false,
      icon: "⭐",
    };

    const updatedHabits = [...habits, customHabit];
    setHabits(updatedHabits);
    upsertHabit(customHabit);
    setNewHabit("");

    toast({
      title: "Habit added! 📝",
      description: `${newHabit} added to your daily tracker`,
    });
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const completionPercentage =
    habits.length > 0
      ? Math.round((completedCount / habits.length) * 100)
      : 0;

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
          <div
            key={habit.id}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
          >
            <Checkbox
              checked={habit.completed}
              onCheckedChange={() => toggleHabit(habit.id)}
              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
            />
            {habit.link ? (
              <a
                href={habit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:scale-110 transition-transform cursor-pointer"
                title={`Open ${habit.name} resources`}
              >
                {habit.icon}
              </a>
            ) : (
              <span className="text-lg">{habit.icon}</span>
            )}
            <div className="flex-1">
              <label
                className={`font-medium cursor-pointer ${
                  habit.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {habit.name}
              </label>
              {(habit.id === "salesforce" ||
                habit.id === "java" ||
                habit.id === "webdev" ||
                habit.id === "dsa") && (
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
