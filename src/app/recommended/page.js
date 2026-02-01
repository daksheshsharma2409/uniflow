"use client";
import React, { useEffect, Suspense } from "react";
import FilterBar from "@/components/events/FilterBar";
import EventGrid from "@/components/events/EventGrid";
import { useStore } from "@/context/StoreContext";
import { Sparkles } from "lucide-react";

function RecommendedContent() {
  const { setFilters, user } = useStore();

  useEffect(() => {
    // Force the filter to Recommended on mount
    setFilters(prev => ({ ...prev, type: "Recommended", search: "", tags: [] }));
  }, [setFilters]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-neon-blue/5 to-transparent">
        <div className="container mx-auto px-6">
           {/* Header Section matching RecommendedSection on Home */}
           <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-neon-blue" size={32} />
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">FOR YOU</h1>
                </div>
                <p className="text-white/50 text-xl max-w-2xl">
                   Curated events based on your interests in <span className="text-white font-bold">{user?.interests?.join(", ") || "various topics"}</span>.
                </p>
           </div>
           
           <FilterBar />
           <EventGrid />
        </div>
    </div>
  );
}

export default function RecommendedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center text-white">Loading...</div>}>
      <RecommendedContent />
    </Suspense>
  );
}
