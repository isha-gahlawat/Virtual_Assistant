import { useEffect, useState } from "react";

const thoughts = [
  "Try asking: What's the time?",
  "Need help setting an alarm?",
  "Say: Open my notes",
  "Try: Schedule my meeting",
  "Feeling curious? Say: Tell me a fact",
  "What's your focus today?",
  "Feeling stuck? I'm here to help!",  
  "Ask me anything. Or just say hi 👋",
  "Curious about something? Let’s explore.",
  "Let’s plan your day together!",
  "Bored? I know some fun facts.",
  "Want to focus? Let’s set a timer!",
   "Plan your day with me — quick and easy.",
   "Organize your thoughts with a note.",
   "Let’s clear that to-do list!",
   "Time for a break? I’ll remind you.",
  "Just thinking about the universe... 🌌",
  "Running 0.0001% of my thoughts on your screen.",
 "If I had a brain, it would be buzzing!",
 "Calculating the meaning of life… still loading.",
  "I dream in code and caffeine."

];

export default function FloatingSuggestion({ aiText, userText }) {
 const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [activeBubbleIndex, setActiveBubbleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBubbleIndex((prev) => (prev + 1) % 5);
      setCurrentFactIndex((prev) => (prev + 1) % thoughts.length);
    }, 2500); // Rotate every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

   if (aiText?.trim() || userText?.trim()) return null;

 return (
    <div className="hidden lg:flex flex-col gap-4 fixed top-1/2 right-40 -translate-y-1/2 z-40 items-end">
      {[0, 1, 2, 3, 4].map((bubbleIndex) => (
        <div
          key={bubbleIndex}
          className={`transition-all duration-700 ease-in-out transform rounded-xl shadow-xl text-left  border border-white/20 text-white backdrop-blur-md
            ${
              activeBubbleIndex === bubbleIndex
                ? "bg-white/10 w-60 p-4 brightness-110 scale-105"
                : "bg-white/5 w-12 h-12 brightness-50"
            }`}
        >
          {activeBubbleIndex === bubbleIndex && (
            <p className="text-sm">{thoughts[currentFactIndex]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
