import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function FocusTimer() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [currentTask, setCurrentTask] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(25);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      toast({
        title: "🎉 Focus session complete!",
        description: "Great work! Time for a short break.",
      });
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!currentTask.trim()) {
      toast({
        title: "Set a task first",
        description: "What will you focus on?",
        variant: "destructive"
      });
      return;
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
  };

  const setDuration = (minutes: number) => {
    if (!isRunning) {
      setSelectedDuration(minutes);
      setTimeLeft(minutes * 60);
    }
  };

  const progressPercentage = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          🎯 Focus Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-primary">
            {formatTime(timeLeft)}
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Input
            placeholder="What will you focus on?"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            disabled={isRunning}
          />
          
          {currentTask && (
            <div className="text-sm text-muted-foreground text-center">
              Current focus: <span className="font-medium text-foreground">{currentTask}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDuration(15)}
            disabled={isRunning}
            className={selectedDuration === 15 ? "bg-primary text-primary-foreground" : ""}
          >
            15m
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDuration(25)}
            disabled={isRunning}
            className={selectedDuration === 25 ? "bg-primary text-primary-foreground" : ""}
          >
            25m
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDuration(45)}
            disabled={isRunning}
            className={selectedDuration === 45 ? "bg-primary text-primary-foreground" : ""}
          >
            45m
          </Button>
        </div>

        <div className="flex gap-2">
          {!isRunning ? (
            <Button onClick={startTimer} className="flex-1">
              Start Focus
            </Button>
          ) : (
            <Button onClick={pauseTimer} variant="secondary" className="flex-1">
              Pause
            </Button>
          )}
          <Button onClick={resetTimer} variant="outline">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}