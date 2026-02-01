"use client";
import React from "react";
import { Search, Filter } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { TAGS } from "@/lib/tags";
import GlassButton from "@/components/ui/GlassButton";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const FilterBar = () => {
  const { filters, setFilters } = useStore();
  
  const toggleTag = (tag) => {
    setFilters(prev => {
      const newTags = prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const setType = (type) => {
    // Reset tags when switching type
    setFilters(prev => ({ ...prev, type, tags: [] }));
  };

  const setSort = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  // Determine which tags to show based on selected Category
  const getVisibleTags = () => {
     if (filters.type === "Hackathon") return TAGS.Hackathons;
     if (filters.type === "Workshop") return TAGS.Workshops;
     if (filters.type === "Cultural") return TAGS.Cultural;
     
     // Fallback / "All": Show a mix or just Hackathon tags for simplicity as they are popular
     return [...TAGS.Hackathons, ...TAGS.Workshops.slice(0, 5)]; 
  };

  return (
    <div className="space-y-6 mb-12">
      {/* 1. Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
           {["All", "Hackathon", "Workshop", "Cultural", "Recommended"].map(type => (
              <GlassButton 
                key={type} 
                onClick={() => setType(type)}
                variant={filters.type === type ? "neon" : "primary"}
                className="whitespace-nowrap h-12"
              >
                {type}
              </GlassButton>
           ))}
      </div>

      {/* 2. Sort & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input 
            type="text" 
            placeholder="Search events, organizers..." 
            className="w-full h-12 pl-12 pr-4 bg-surface-highlight border border-white/10 rounded-full text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>

        {/* Sorting Toggles */}
        <div className="flex bg-surface-highlight rounded-full p-1 border border-white/10 shrink-0 overflow-x-auto max-w-full">
            {["Latest", "Prize", "Distance", "Impressions"].map(sort => (
                <button
                    key={sort}
                    onClick={() => setSort(sort)}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                        filters.sortBy === sort 
                            ? "bg-white text-black shadow-lg" 
                            : "text-white/50 hover:text-white"
                    )}
                >
                    {sort}
                </button>
            ))}
        </div>
      </div>

      {/* 3. Dynamic Tag Filters */}
      <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-2 text-white/50 text-sm mr-2">
           <Filter size={14} /> Filters:
        </div>
        {getVisibleTags().map(tag => (
           <button key={tag} onClick={() => toggleTag(tag)}>
              <Badge 
                active={filters.tags.includes(tag)}
                className="cursor-pointer hover:border-white/50"
              >
                {tag}
              </Badge>
           </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
