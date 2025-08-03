import { useEffect, useState } from "react";

const facts = [
" AI can now write poetry — and sometimes it's better than your ex’s texts.",
"Your voice assistant might know your sleep schedule better than you do.",
"AI has learned to generate cat pictures… because the internet demanded it.",
"Some AIs can beat pro gamers, but still can’t understand sarcasm.",
"AI-generated memes are now a thing. Some are unintentionally hilarious.",
"AI models like ChatGPT can explain quantum physics or tell a dad joke — your call.",
"AI has been trained to detect fake smiles — RIP awkward selfies.",
"Deepfakes can now mimic celebrities — be careful who you trust online!",
"AI can compose original music — even entire lo-fi chill beats playlists.",
"AI influencers (like Lil Miquela) now have millions of followers.",
"Robots with AI can now dance — and sometimes better than humans at weddings.",
"AI can generate realistic voices — including ones that say “I’m not a robot.”",
"Some AI art generators get confused and draw hands with 7 fingers.",
"AI models have no emotions, but they’ll still pretend to care if you’re sad.",
"AIs are reading more books than any human ever has — in milliseconds.",
  "The Eiffel Tower can grow 6 inches in summer!",
  "Octopuses have three hearts and blue blood.",
  "Honey never spoils — archaeologists found 3,000-year-old edible honey.",
  "Bananas are berries, but strawberries aren’t.",
  "A day on Venus is longer than its year.",
  "Sharks existed before trees.",
  "Wombat poop is cube-shaped.",
  "Butterflies can taste with their feet.",
  "There’s enough DNA in your body to stretch from the sun to Pluto — and back — 17 times.",
  "Some cats are allergic to humans.",
  "Hot water freezes faster than cold water.",
  "Sloths can hold their breath longer than dolphins.",
  "Turtles can breathe through their butts.",
  "The unicorn is the national animal of Scotland."

];

const shadowColors = [
  "shadow-[0_0_40px_rgba(255,99,132,1)]",   // pink/red
  "shadow-[0_0_40px_rgba(54,162,235,1)]",   // blue
  "shadow-[0_0_40px_rgba(255,206,86,1)]",   // yellow
  "shadow-[0_0_40px_rgba(75,192,192,1)]",   // cyan
  "shadow-[0_0_40px_rgba(153,102,255,1)]"   // purple
]
export default function FactBubbles() {
  const [visibleFacts, setVisibleFacts] = useState(facts.slice(0, 5));
  const [nextFactIndex, setNextFactIndex] = useState(5);
  const [activeBubble, setActiveBubble] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleFacts((prevFacts) => {
        const newFacts = [...prevFacts];
        newFacts[activeBubble] = facts[nextFactIndex % facts.length];
        return newFacts;
      });

      setActiveBubble((prev) => (prev + 1) % 5);
      setNextFactIndex((prev) => (prev + 1) % facts.length);
    }, 2500); // Change one bubble every 2.5s

    return () => clearInterval(interval);
  }, [activeBubble, nextFactIndex]);

  return (
    <div className="hidden lg:flex flex-col gap-4 fixed top-1/2 left-8 -translate-y-1/2 z-40">
      {visibleFacts.map((fact, i) => (
        <div
          key={i}
          className={`transition-all duration-700 ease-in-out transform rounded-xl  border border-white/20 text-white backdrop-blur-md
            ${
              activeBubble === i
                ? `bg-white/10 w-80 p-4 brightness-110 scale-115 ${shadowColors[i % shadowColors.length]}`
                : "bg-white/5 w-80 p-4 brightness-90"
            }`}
        >
          <p className="text-sm">{fact}</p>
        </div>
      ))}
    </div>
  );
}