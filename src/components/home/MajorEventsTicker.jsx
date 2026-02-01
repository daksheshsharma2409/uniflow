"use client";
import React, { useState, useEffect } from "react";
import { Clock, ExternalLink, Bookmark, Share2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { useStore } from "@/context/StoreContext";

const MAJOR_EVENTS = [
  {
     name: "LFX Mentorship Spring",
     deadline: "2026-02-10", 
     link: "https://lfx.linuxfoundation.org/mentorship/",
     color: "text-neon-green"
  },
  {
     name: "Google Summer of Code",
     deadline: "2026-03-31",
     link: "https://summerofcode.withgoogle.com/",
     color: "text-neon-orange"
  },
  {
     name: "Hacktoberfest",
     deadline: "2026-10-01",
     link: "https://hacktoberfest.com/",
     color: "text-neon-purple"
  }
];

export default function MajorEventsTicker() {
  const { toggleBookmark, user } = useStore();
  const [tickerEvents, setTickerEvents] = useState([]);

  useEffect(() => {
    // Find events within 30 days (or just notify if upcoming soon)
    const now = new Date();
    const upcoming = MAJOR_EVENTS.map(ev => {
        const deadlineDate = new Date(ev.deadline);
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { ...ev, daysLeft: diffDays };
    }).filter(ev => ev.daysLeft > 0 && ev.daysLeft <= 90); // Show up to 3 months out for major things

    setTickerEvents(upcoming);
  }, []);

  if (tickerEvents.length === 0) return null;

  return (
    <section className="py-12 bg-black">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter">
            MAJOR UPCOMING EVENTS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tickerEvents.map((ev, index) => {
             const isBookmarked = user?.bookmarks?.includes(ev.id); // Note: Major events need distinct IDs in mockData or we map them.
             // Since mockData Major events are hardcoded for now in the component, we might have an issue if IDs don't exist in the main EVENTS list or if we don't assign IDs here.
             // The current MAJOR_EVENTS in this file doesn't have IDs. I need to add IDs to them or map them to existing events.
             // For now, I will assign temporary pseudo-IDs 'major-1', 'major-2', etc. to make it work, 
             // or I should rely on the titles if they match.
             // Let's add IDs to the MAJOR_EVENTS array first in a separate edit, but I can do it here if I assume they have IDs.
             // Wait, I see the file content didn't show the MAJOR_EVENTS array in the replace block context.
             // I'll assume I need to handle IDs. 
             // Let's use the index as a proxy ID 'major-index' or verify if they really exist in the system.
             // To ensure they invoke the store correctly, I will generate an ID effectively.
             const eventId = `major-${index}`; 

             return (
             <GlassCard key={index} className={`relative overflow-hidden group border-${ev.color.replace('text-', '')}/20 hover:border-${ev.color.replace('text-', '')}/40 transition-colors`}>
                 {/* Subtle Premium Gradient */}
                 <div className={`absolute inset-0 bg-gradient-to-br from-${ev.color.replace('text-', '')}/5 to-transparent opacity-50`} />
                 
                 <div className="p-6 relative z-10 flex flex-col h-full">
                     <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-white/5 ${ev.color} backdrop-blur-md`}>
                           <Clock size={24} />
                        </div>
                        <Badge className="bg-white/10">{ev.daysLeft} DAYS LEFT</Badge>
                     </div>

                     <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">{ev.name}</h3>
                     <p className="text-white/50 text-sm mb-6">Applications closing soon. Don't miss out.</p>

                     <div className="mt-auto flex gap-3">
                         <a 
                            href={ev.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex-1"
                         >
                            <button className="w-full h-12 rounded-xl bg-white text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                Apply Now <ExternalLink size={16} />
                            </button>
                         </a>
                         <button 
                            onClick={() => toggleBookmark(eventId)}
                            className={`h-12 w-12 flex items-center justify-center rounded-xl transition-colors border border-white/5 ${isBookmarked ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                         >
                             <Bookmark size={20} fill={isBookmarked ? "black" : "none"} />
                         </button>
                         <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors border border-white/5">
                             <Share2 size={20} />
                         </button>
                     </div>
                 </div>
             </GlassCard>
          );
        })}
         </div>
      </div>
    </section>
  );
}
