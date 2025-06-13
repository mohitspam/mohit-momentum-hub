import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface LogEntry {
  id: string;
  date: string;
  topic: string;
  domain: string;
  time: string;
}

const DOMAIN_COLORS: Record<string, string> = {
  "Salesforce": "bg-blue-500 text-white",
  "Java": "bg-orange-500 text-white",
  "Web Dev": "bg-green-500 text-white",
  "DSA": "bg-purple-500 text-white",
  "Fitness": "bg-red-500 text-white",
  "Other": "bg-gray-500 text-white"
};

export function LearningLog() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [openSections, setOpenSections] = useState<string[]>([]);

  useEffect(() => {
    // Load learning entries from habit data
    const savedData = localStorage.getItem("habitData");
    if (savedData) {
      const habitData = JSON.parse(savedData);
      const allEntries: LogEntry[] = [];
      
      Object.entries(habitData).forEach(([date, habits]: [string, any[]]) => {
        habits.forEach(habit => {
          if (habit.topic && habit.completed) {
            allEntries.push({
              id: `${date}-${habit.id}`,
              date,
              topic: habit.topic,
              domain: getDomainFromHabitId(habit.id),
              time: new Date(date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })
            });
          }
        });
      });
      
      // Sort by date (newest first)
      allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEntries(allEntries);
    }
  }, []);

  const getDomainFromHabitId = (habitId: string): string => {
    if (habitId === "salesforce") return "Salesforce";
    if (habitId === "java") return "Java";
    if (habitId === "webdev") return "Web Dev";
    if (habitId === "dsa") return "DSA";
    if (habitId === "fitness") return "Fitness";
    return "Other";
  };

  const filteredEntries = selectedDomain === "All" 
    ? entries 
    : entries.filter(entry => entry.domain === selectedDomain);

  const domains = ["All", ...Array.from(new Set(entries.map(e => e.domain)))];

  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = new Date(entry.date).toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, LogEntry[]>);

  const toggleSection = (date: string) => {
    setOpenSections(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">📚 Learning Log</CardTitle>
          <div className="text-sm text-muted-foreground">
            {filteredEntries.length} topics covered
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {domains.map(domain => (
            <Button
              key={domain}
              variant={selectedDomain === domain ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDomain(domain)}
              className="text-xs"
            >
              {domain}
              {domain !== "All" && (
                <span className="ml-1 text-xs opacity-70">
                  ({entries.filter(e => e.domain === domain).length})
                </span>
              )}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedEntries).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📖</div>
            <p>No learning entries yet.</p>
            <p className="text-sm">Complete habits with topics to see them here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(groupedEntries).map(([date, entries]) => (
              <Collapsible 
                key={date}
                open={openSections.includes(date)}
                onOpenChange={() => toggleSection(date)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex justify-between items-center p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="font-medium text-left">{date}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {entries.length} topics
                      </Badge>
                      <span className="text-muted-foreground">
                        {openSections.includes(date) ? "−" : "+"}
                      </span>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                  {entries.map(entry => (
                    <div 
                      key={entry.id}
                      className="ml-4 p-3 rounded-lg bg-muted/30 border-l-4 border-primary"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">{entry.topic}</div>
                          <Badge 
                            className={`text-xs ${DOMAIN_COLORS[entry.domain] || DOMAIN_COLORS.Other}`}
                          >
                            {entry.domain}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}