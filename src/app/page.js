"use client";
import React, { useEffect } from "react";
import HeroSection from "@/components/hero/HeroSection";
import EventSection from "@/components/home/EventSection";
import RecommendedSection from "@/components/home/RecommendedSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import MajorEventsTicker from "@/components/home/MajorEventsTicker";
import { useStore } from "@/context/StoreContext";

export default function Home() {
  const { setFilters } = useStore();

  useEffect(() => {
    // Reset filters when landing on home page
    setFilters(prev => ({ ...prev, type: "All", search: "", tags: [] }));
  }, [setFilters]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <MajorEventsTicker />

      {/* Featured Section (Fixed Top) */}
      <FeaturedSection />

      {/* Recommended Section (Personalized) */}
      <RecommendedSection />

      {/* Hackathons Section */}
      <EventSection
        title="Hackathons"
        subtitle="Build the future in 24 hours."
        type="Hackathon"
      />

      {/* Workshops Section */}
      <EventSection
        title="Workshops"
        subtitle="Level up your skills."
        type="Workshop"
      />

      {/* Cultural Section */}
      <EventSection
        title="Cultural Fests"
        subtitle="Experience campus life."
        type="Cultural"
      />
    </div>
  );
}
