"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { useStore } from "@/context/StoreContext";
import { Calendar, MapPin, Users } from "lucide-react";

const FeaturedSection = () => {
  const { filteredEvents, user } = useStore();
  
  // Show top 3 events
  const displayEvents = filteredEvents.slice(0, 3);
  const title = user ? "Recommended For You" : "Featured Events";
  const subtitle = user ? "Based on your interests" : "Handpicked top-tier hackathons";

  return (
    <section className="py-24 relative">
       <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
             <div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{title}</h2>
                <p className="text-white/40">{subtitle}</p>
             </div>
             <Link href="/explore" className="hidden md:flex items-center gap-2 text-neon-blue font-bold tracking-widest uppercase text-sm hover:underline">
                View All <ArrowRight size={16} />
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {displayEvents.map((event) => (
                <Link key={event.id} href={`/event/${event.id}`}>
                   <GlassCard className="h-full flex flex-col group cursor-pointer hover:border-neon-blue/30">
                      {/* Image */}
                      <div className="relative h-48 w-full overflow-hidden">
                         <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                         <div className="absolute top-4 right-4">
                            <Badge className="bg-black/50 backdrop-blur-md border-transparent text-white">{event.type}</Badge>
                         </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                         <div className="flex items-center gap-2 text-xs font-bold text-neon-blue mb-3 uppercase tracking-wider">
                            <Calendar size={12} /> {event.date}
                         </div>
                         <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-neon-blue transition-colors">
                            {event.title}
                         </h3>
                         <p className="text-sm text-white/50 mb-6">{event.organizer}</p>

                         <div className="mt-auto grid grid-cols-2 gap-4 text-xs font-bold text-white/70">
                            <div className="flex items-center gap-2">
                               <MapPin size={12} /> {event.location.split(',')[0]}
                            </div>
                            <div className="flex items-center gap-2">
                               <Users size={12} /> {event.teamSize}
                            </div>
                         </div>
                      </div>
                   </GlassCard>
                </Link>
             ))}
          </div>
          
          <div className="mt-12 flex justify-center md:hidden">
             <Link href="/explore">
               <button className="text-white border-b border-white pb-1">View All Events</button>
             </Link>
          </div>
       </div>
    </section>
  );
};

export default FeaturedSection;
