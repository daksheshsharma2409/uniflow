"use client";
import React, { Suspense } from "react";
import FilterBar from "@/components/events/FilterBar";
import EventGrid from "@/components/events/EventGrid";
import { useEffect } from "react";
import { useStore } from "@/context/StoreContext";

function CategoryContent({ category, title, description, gradient }) {
  const { setFilters } = useStore();

  useEffect(() => {
    // Force the filter to the specific category on mount
    setFilters(prev => ({ ...prev, type: category, search: "", tags: [] }));
  }, [category, setFilters]);

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
       <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
             {title.split(' ')[0]} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>{title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl">
             {description}
          </p>
       </div>
       
       {/* Reusing FilterBar but it will show correctly selected category */}
       <FilterBar />
       <EventGrid />
    </div>
  );
}

export default function CategoryPage({ category, title, description, gradient }) {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center text-white">Loading...</div>}>
      <CategoryContent 
        category={category} 
        title={title} 
        description={description} 
        gradient={gradient} 
      />
    </Suspense>
  );
}
