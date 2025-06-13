import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2 } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  icon: string;
  color: string;
}

const DEFAULT_GOALS: Goal[] = [
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

interface MissionSettings {
  totalDays: number;
  startDate: string;
}

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [missionSettings, setMissionSettings] = useState<MissionSettings>({
    totalDays: 90,
    startDate: new Date().toISOString().split('T')[0]
  });
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: 100,
    icon: "🎯"
  });
  const [newMissionDays, setNewMissionDays] = useState(90);

  useEffect(() => {
    const savedGoals = localStorage.getItem("userGoals");
    const savedMission = localStorage.getItem("missionSettings");
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    if (savedMission) {
      setMissionSettings(JSON.parse(savedMission));
    }
  }, []);

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem("userGoals", JSON.stringify(updatedGoals));
  };

  const saveMissionSettings = (settings: MissionSettings) => {
    setMissionSettings(settings);
    localStorage.setItem("missionSettings", JSON.stringify(settings));
  };

  const calculateDaysLeft = () => {
    const startDate = new Date(missionSettings.startDate);
    const today = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + missionSettings.totalDays);
    
    const timeDiff = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(0, daysLeft);
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const goal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      progress: 0,
      target: newGoal.target,
      icon: newGoal.icon,
      color: "bg-primary"
    };
    
    saveGoals([...goals, goal]);
    setNewGoal({ title: "", description: "", target: 100, icon: "🎯" });
    setIsAddingGoal(false);
  };

  const updateMissionDays = () => {
    const newSettings: MissionSettings = {
      totalDays: newMissionDays,
      startDate: new Date().toISOString().split('T')[0]
    };
    saveMissionSettings(newSettings);
    setIsEditingMission(false);
  };

  const daysLeft = calculateDaysLeft();
  const overallProgress = goals.length > 0 ? Math.round(
    goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
  ) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-semibold">🎯 {missionSettings.totalDays}-Day Mission</CardTitle>
            <Dialog open={isEditingMission} onOpenChange={setIsEditingMission}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Mission Duration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Total Days</label>
                    <Input
                      type="number"
                      value={newMissionDays}
                      onChange={(e) => setNewMissionDays(Number(e.target.value))}
                      placeholder="90"
                    />
                  </div>
                  <Button onClick={updateMissionDays} className="w-full">
                    Update Mission
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
        {goals.map((goal) => (
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
        
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Goal Title</label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Learn React"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="e.g., Complete React course"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Target (%)</label>
                <Input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                  placeholder="100"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Icon (emoji)</label>
                <Input
                  value={newGoal.icon}
                  onChange={(e) => setNewGoal({ ...newGoal, icon: e.target.value })}
                  placeholder="🎯"
                />
              </div>
              <Button onClick={addGoal} className="w-full">
                Add Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}