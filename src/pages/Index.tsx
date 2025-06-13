import { DashboardHeader } from "@/components/DashboardHeader";
import { HabitTracker } from "@/components/HabitTracker";
import { FocusTimer } from "@/components/FocusTimer";
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { LearningLog } from "@/components/LearningLog";
import { GoalTracker } from "@/components/GoalTracker";
import { ProgressCalendar } from "@/components/ProgressCalendar";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <DashboardHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main tracking */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HabitTracker />
              <FocusTimer />
            </div>
            
            <WeeklyProgress />
            
            <LearningLog />
          </div>
          
          {/* Right Column - Goals and motivation */}
          <div className="space-y-6">
            <ProgressCalendar />
            <GoalTracker />
            
            {/* Quick Stats Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>⚡</span>
                Today's Focus
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className="text-muted-foreground">Current Streak</span>
                  <span className="font-bold text-primary">7 days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-success/5 rounded-lg">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-bold text-success">28 tasks</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-info/5 rounded-lg">
                  <span className="text-muted-foreground">Focus Time</span>
                  <span className="font-bold text-info">4.5 hours</span>
                </div>
              </div>
            </div>

            {/* Motivation Quote */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6">
              <div className="text-center">
                <div className="text-2xl mb-3">🔥</div>
                <blockquote className="text-sm italic text-muted-foreground mb-3">
                  "You are in competition with one person and one person only — yourself. 
                  Be better than you were yesterday."
                </blockquote>
                <p className="text-xs font-medium text-primary">- Best Version of Mohit</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
