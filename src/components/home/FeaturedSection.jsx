"use client";
import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Calendar, MapPin, Trophy,  Zap } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import gsap from "gsap";
import { useRef, useEffect } from "react";

const FeaturedSection = () => {
    const { events } = useStore();
    const featuredEvents = events.filter(e => e.featured).slice(0, 4);
    const scrollRef = useRef(null);

    return (
        <section id="featured" className="py-20 relative bg-black">
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6">
                 <div className="flex items-center gap-3 mb-12">
                   <div className="p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/50">
                        <Zap className="text-neon-purple" size={24} />
                   </div>
                   <div>
                       <h2 className="text-3xl md:text-5xl font-black text-white">FEATURED EVENTS</h2>
                       <p className="text-white/40">Major hackathons, government initiatives, and top-tier fests.</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Big Feature (Index 0) */}
                    {featuredEvents[0] && (
                        <Link href={`/event/${featuredEvents[0].id}`} className="lg:row-span-2 h-full">
                           <GlassCard className="h-full min-h-[400px] flex flex-col group cursor-pointer border-neon-purple/30 hover:border-neon-purple shadow-[0_0_40px_rgba(189,0,255,0.15)] overflow-hidden">
                                <div className="absolute inset-0 z-0">
                                   <img 
                                      src={featuredEvents[0].image} 
                                      alt={featuredEvents[0].title}
                                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                                   />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                </div>
                                <div className="relative z-10 mt-auto p-8">
                                    <div className="flex gap-2 mb-4">
                                        <Badge className="bg-neon-purple border-neon-purple text-black font-bold animate-pulse">FEATURED</Badge>
                                        <Badge className="bg-white/10">{featuredEvents[0].type}</Badge>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">{featuredEvents[0].title}</h3>
                                    <p className="text-xl text-white/70 mb-6">{featuredEvents[0].description}</p>
                                    
                                    <div className="flex items-center gap-6 text-sm font-bold text-white/80">
                                        <div className="flex items-center gap-2"><Calendar size={16} className="text-neon-purple"/> {featuredEvents[0].date}</div>
                                        <div className="flex items-center gap-2"><MapPin size={16} className="text-neon-purple"/> {featuredEvents[0].location}</div>
                                        <div className="flex items-center gap-2"><Trophy size={16} className="text-neon-purple"/> {featuredEvents[0].prize}</div>
                                    </div>
                                </div>
                           </GlassCard>
                        </Link>
                    )}

                    {/* Secondary Features (Index 1-3) */}
                    <div className="flex flex-col gap-6">
                        {featuredEvents.slice(1).map((event) => (
                          <Link key={event.id} href={`/event/${event.id}`}>
                            <GlassCard className="flex flex-col md:flex-row gap-4 p-4 group cursor-pointer hover:border-white/30 transition-all hover:bg-white/5">
                                <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden shrink-0">
                                   <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-1">
                                       <Badge className="text-[10px] px-2 py-0.5 bg-white/5">{event.type}</Badge>
                                       <span className="text-xs text-neon-purple font-bold">{event.date}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-1 group-hover:text-neon-purple transition-colors">{event.title}</h4>
                                    <p className="text-sm text-white/50 line-clamp-2">{event.description}</p>
                                    <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                                        <span>{event.organizer}</span>
                                        <span className="flex items-center gap-1"><MapPin size={10}/> {event.location.split(',')[0]}</span>
                                    </div>
                                </div>
                            </GlassCard>
                          </Link>
                        ))}
                    </div>
                 </div>
            </div>
        </section>
    );
};

export default FeaturedSection;
