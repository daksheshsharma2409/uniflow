"use client";
import React from "react";
import EventCard from "@/components/events/EventCard";
import { useStore } from "@/context/StoreContext";

const ITEMS_PER_PAGE = 12;

const EventGrid = () => {
  const { filteredEvents } = useStore();
  const [visibleCount, setVisibleCount] = React.useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = React.useState(false);
  const loadMoreRef = React.useRef(null);

  // Reset visible count when filters change
  React.useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [filteredEvents]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && visibleCount < filteredEvents.length) {
          setIsLoading(true);
          // Simulate network delay for realism (optional, but good for UX feel)
          setTimeout(() => {
            setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
            setIsLoading(false);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, visibleCount, filteredEvents.length]);

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-20">
         <p className="text-white/50 text-xl">No events found matching your criteria.</p>
      </div>
    );
  }

  const displayedEvents = filteredEvents.slice(0, visibleCount);

  return (
    <div className="pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {displayedEvents.map(event => (
            <EventCard key={event.id} event={event} />
         ))}
      </div>

      {visibleCount < filteredEvents.length && (
        <div ref={loadMoreRef} className="py-12 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
                <p className="text-white/30 text-sm animate-pulse">Loading more events...</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default EventGrid;
