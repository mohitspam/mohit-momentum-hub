import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function DashboardHeader({ darkMode, toggleDarkMode }: DashboardHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-card border-b border-border py-6 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, <span className="text-primary">Mohit</span>
          </h1>
          <p className="text-muted-foreground mt-1">{currentDate}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDarkMode}
            className="transition-colors duration-200"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </div>
      </div>
    </header>
  );
}