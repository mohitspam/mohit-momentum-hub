import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const motivationalQuotes = [
  {
    text: "You are in competition with one person and one person only — yourself. Be better than you were yesterday.",
    author: "Best Version of Mohit",
    emoji: "🔥"
  },
  {
    text: "The cave you fear to enter holds the treasure you seek.",
    author: "Joseph Campbell",
    emoji: "💎"
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    emoji: "⚡"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    emoji: "🚀"
  },
  {
    text: "The person you become is more important than the goals you achieve.",
    author: "James Clear",
    emoji: "🌟"
  },
  {
    text: "You don't have to be great to get started, but you have to get started to be great.",
    author: "Les Brown",
    emoji: "💪"
  }
];

export function MotivationWidget() {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem("dailyQuote");
    const savedDate = localStorage.getItem("quoteDate");

    if (savedDate === today && savedQuote) {
      setCurrentQuote(JSON.parse(savedQuote));
    } else {
      // Generate a consistent random quote for today based on date
      const dateHash = today.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const quoteIndex = Math.abs(dateHash) % motivationalQuotes.length;
      const todaysQuote = motivationalQuotes[quoteIndex];
      
      setCurrentQuote(todaysQuote);
      localStorage.setItem("dailyQuote", JSON.stringify(todaysQuote));
      localStorage.setItem("quoteDate", today);
    }
  }, []);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
      <CardContent className="p-4">
        <div className="text-center">
          <div className="text-xl mb-2">{currentQuote.emoji}</div>
          <blockquote className="text-sm italic text-muted-foreground mb-2 leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
          <p className="text-xs font-medium text-primary">- {currentQuote.author}</p>
        </div>
      </CardContent>
    </Card>
  );
}