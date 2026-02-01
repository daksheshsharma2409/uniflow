"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import { useStore } from "@/context/StoreContext";

const EventSection = ({ title, subtitle, type, limit = 6 }) => {
   const { filteredEvents } = useStore();
   const titleColor = type === 'Hackathon' ? 'text-neon-purple' : type === 'Workshop' ? 'text-neon-green' : 'text-neon-orange';

   // Filter if needed
   const displayEvents = filteredEvents
      .filter(e => type === "All" || e.type === type)
      .slice(0, limit);

   // Helper helper to handle route pluralization
   const getRoute = (t) => {
      const lower = t.toLowerCase();
      return lower === 'cultural' ? '/cultural' : `/${lower}s`;
   };

   if (displayEvents.length === 0) return null;

   return (
      <section className="py-16 relative">
         <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <Sparkles className={titleColor} size={20} />
                     <span className={`text-xs font-bold uppercase tracking-widest ${titleColor}`}>{type}s</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white">{title}</h2>
                  {subtitle && <p className="text-white/50 mt-2">{subtitle}</p>}
               </div>

               {type !== "All" && (
                  <Link
                     href={getRoute(type)}
                     className={`hidden md:flex items-center gap-2 ${titleColor} font-bold tracking-widest uppercase text-sm hover:underline`}
                  >
                     View All <ArrowRight size={16} />
                  </Link>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {displayEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
               ))}
            </div>

            <div className="mt-12 flex justify-center md:hidden">
               {type !== "All" && (
                  <Link href={getRoute(type)}>
                     <button className="text-white border-b border-white pb-1">View All</button>
                  </Link>
               )}
            </div>
         </div>
      </section>
   );
};

export default EventSection;
