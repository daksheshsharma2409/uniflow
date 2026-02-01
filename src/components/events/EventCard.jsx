"use client";
import React from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { Calendar, MapPin, Bookmark, Share2, ExternalLink, Users } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const EventCard = ({ event, className = "" }) => {
    const { toggleBookmark, user } = useStore();
    const isBookmarked = user?.bookmarks?.includes(event.id);

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(event.id);
    };

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Logic to copy link or open share sheet
        navigator.clipboard.writeText(`${window.location.origin}/event/${event.id}`);
        alert("Link copied to clipboard!");
    };

    return (
        <div className={`relative group h-full ${className}`}>
            <Link href={`/event/${event.id}`} className="block h-full">
                <GlassCard className="h-full flex flex-col hover:border-neon-blue/50 transition-all duration-300">
                    {/* Image & Platform Logo */}
                    <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Platform Logo (Top Right) - Increased size & removed bg */}
                        {event.platform && (
                            <div className="absolute top-3 right-3 h-10 w-10 overflow-hidden rounded-full border border-white/20 shadow-lg">
                                <img
                                    src={event.platform.logo}
                                    alt={event.platform.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Type Badge (Top Left) */}
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-black/60 backdrop-blur-md border-transparent text-white text-xs px-3 py-1">
                                {event.type}
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-xs font-bold text-neon-blue mb-2 uppercase tracking-wider">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={12} /> {event.date}
                            </div>
                            {event.type === 'Hackathon' && event.teamSize && (
                                <div className="flex items-center gap-1.5 text-neon-purple">
                                    <Users size={12} /> {event.teamSize}
                                </div>
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-neon-blue transition-colors line-clamp-2">
                            {event.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {event.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs font-medium text-white/80 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-white/90">
                                <MapPin size={16} className="text-white" />
                                <span className="truncate max-w-[140px]">{event.location?.split(',')[0]}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleBookmark}
                                    className={`p-2 rounded-full transition-colors ${isBookmarked ? 'bg-white text-black' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                                    title={isBookmarked ? "Remove Bookmark" : "Save Event"}
                                >
                                    <Bookmark size={18} fill={isBookmarked ? "black" : "none"} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                                    title="Share"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </Link>
        </div>
    );
};

export default EventCard;
