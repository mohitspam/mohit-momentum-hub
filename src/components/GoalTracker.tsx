import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  icon: string;
  color: string;
}

const GOALS: Goal[] = [
  {
    id: "salesforce",
    title: "Salesforce Trailhead",
    description: "Complete 60% of core modules",
    progress: 25,
    target: 60,
    icon: "☁️",
    color: "bg-blue-500"
  },
  {
    id: "webdev",
    title: "Sigma Web Dev Course",
    description: "Finish complete course",
    progress: 40,
    target: 100,
    icon: "🌐",
    color: "bg-green-500"
  },
  {
    id: "java",
    title: "Oracle Java Certification",
    description: "Complete certification prep",
    progress: 15,
    target: 100,
    icon: "☕",
    color: "bg-orange-500"
  },
  {
    id: "cv",
    title: "Computer Vision Project",
    description: "Build and deploy mini project",
    progress: 5,
    target: 100,
    icon: "👁️",
    color: "bg-purple-500"
  }
];

export function GoalTracker() {
  const calculateDaysLeft = () => {
    const startDate = new Date(); // Today
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90); // 90 days from now
    
    // For demo, let's say we're 20 days into the 90-day journey
    return 70;
  };

  const daysLeft = calculateDaysLeft();
  const overallProgress = Math.round(
    GOALS.reduce((sum, goal) => sum + goal.progress, 0) / GOALS.length
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">🎯 90-Day Mission</CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{daysLeft}</div>
            <div className="text-xs text-muted-foreground">days left</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {GOALS.map((goal) => (
          <div key={goal.id} className="p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{goal.icon}</span>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">
                      {goal.progress}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of {goal.target}%
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress 
                    value={(goal.progress / goal.target) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{goal.progress}% complete</span>
                    <span>{goal.target - goal.progress}% remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💪</span>
            <span className="font-semibold text-sm">Daily Momentum</span>
          </div>
          <p className="text-xs text-muted-foreground">
            "The person you become is more important than the goals you achieve. 
            Focus on building systems, not just hitting targets."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}