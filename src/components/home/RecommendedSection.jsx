"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import { useStore } from "@/context/StoreContext";

const RecommendedSection = () => {
  const { events, user } = useStore();

  if (!user || !user.interests || user.interests.length === 0) {
    return null;
  }

  // Filter events that match user interests and sort by relevance (match count)
  const recommendedEvents = events
    .map(event => {
       const matchCount = event.tags.filter(tag => user.interests.includes(tag)).length;
       return { ...event, matchCount };
    })
    .filter(event => event.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);

  return (
    <section className="py-16 relative bg-transparent">
       <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
             <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-neon-blue" size={24} />
                  <h2 className="text-3xl md:text-5xl font-black text-white">FOR YOU</h2>
                </div>
                <p className="text-white/40 max-w-2xl">
                   Events curated based on your interests: <span className="text-white font-bold">{user.interests.join(", ")}</span>.
                </p>
             </div>
             {recommendedEvents.length > 0 && (
                 <Link 
                    href="/recommended" 
                    className="hidden md:flex items-center gap-2 text-neon-blue font-bold tracking-widest uppercase text-sm hover:underline"
                 >
                    View All <ArrowRight size={16} />
                 </Link>
             )}
          </div>

          {recommendedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {recommendedEvents.slice(0, 6).map((event) => (
                    <EventCard key={event.id} event={event} />
                 ))}
              </div>
          ) : (
              <div className="glass-panel p-12 rounded-3xl text-center border-dashed border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-2">No matches found yet.</h3>
                  <p className="text-white/50 mb-6">Try adding more interests to your profile to see personalized recommendations.</p>
                  <Link href="/profile">
                     <button className="px-6 py-3 bg-neon-blue text-black font-bold rounded-xl hover:bg-white transition-colors">
                        Update Interests
                     </button>
                  </Link>
              </div>
          )}
          
          {recommendedEvents.length > 0 && (
              <div className="mt-12 flex justify-center md:hidden">
                 <Link href="/recommended">
                   <button className="text-white border-b border-white pb-1">View All</button>
                 </Link>
              </div>
          )}
       </div>
    </section>
  );
};

export default RecommendedSection;
