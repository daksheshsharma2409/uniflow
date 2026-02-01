"use client";
import React, { useState, useEffect } from "react";
import { Clock, ExternalLink, Bookmark, Share2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { useStore } from "@/context/StoreContext";

import { MAJOR_EVENTS } from "@/lib/mockData";

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
    }).filter(ev => ev.daysLeft > 0); 
    // Removed the "90 days" limit to show all major events as they are important

    setTickerEvents(upcoming);
  }, []);

  const handleShare = async (event) => {
    const shareData = {
        title: event.name,
        text: `Check out ${event.name} on UniFlow! Deadline in ${event.daysLeft} days.`,
        url: event.link
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert("Link copied to clipboard!"); 
        }
    } catch (err) {
        console.error("Error sharing:", err);
    }
  };

  if (tickerEvents.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter">
            MAJOR UPCOMING EVENTS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tickerEvents.map((ev) => {
             const isBookmarked = user?.bookmarks?.includes(ev.id);
             // Use proper color rendering logic
             const baseColor = ev.color.replace('text-', '');
             
             return (
             <GlassCard key={ev.id} className={`relative overflow-hidden group border-${baseColor}/20 hover:border-${baseColor}/40 transition-colors`}>
                 {/* Subtle Premium Gradient */}
                 <div className={`absolute inset-0 bg-gradient-to-br from-${baseColor}/5 to-transparent opacity-50`} />
                 
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
                            onClick={() => toggleBookmark(ev.id)}
                            className={`h-12 w-12 flex items-center justify-center rounded-xl transition-colors border border-white/5 ${isBookmarked ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                         >
                             <Bookmark size={20} fill={isBookmarked ? "black" : "none"} />
                         </button>
                         <button 
                            onClick={() => handleShare(ev)}
                            className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                         >
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
