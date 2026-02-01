"use client";
import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAJOR_CITIES } from "@/lib/constants/cities";

const LocationPicker = ({ selectedLocation, setLocation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const wrapperRef = useRef(null);

  // Initialize with top cities or empty
  useEffect(() => {
    setFilteredCities(MAJOR_CITIES.slice(0, 10)); // Show top 10 initially
  }, []);

  // Filter cities based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCities(MAJOR_CITIES.slice(0, 50));
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = MAJOR_CITIES.filter(city =>
        city.toLowerCase().includes(lowerTerm)
      ).slice(0, 50); // Limit to 50 results for performance
      setFilteredCities(filtered);
    }
  }, [searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update local input when prop changes (initial load or external set)
  useEffect(() => {
    if (selectedLocation) {
      setSearchTerm(selectedLocation);
    }
  }, [selectedLocation]);

  const handleSelect = (city) => {
    setLocation(city);
    setSearchTerm(city);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocation("");
    setSearchTerm("");
    setIsOpen(true);
    setFilteredCities(MAJOR_CITIES.slice(0, 50));
  };

  return (
    <div className="w-full max-w-lg mx-auto" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />

        <input
          type="text"
          placeholder="Search for your city..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (e.target.value === "") {
              setLocation(""); // Clear actual location if input is cleared
            }
          }}
          onFocus={() => setIsOpen(true)}
          className={cn(
            "w-full h-14 pl-12 pr-12 bg-surface-highlight border rounded-2xl text-white focus:outline-none focus:border-neon-blue/50 transition-colors text-lg",
            isOpen ? "border-neon-blue rounded-b-none border-b-0" : "border-white/10"
          )}
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full max-h-[300px] overflow-y-auto bg-surface-highlight border border-t-0 border-neon-blue/50 rounded-b-2xl shadow-2xl z-50 custom-scrollbar">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleSelect(city)}
                  className="w-full text-left px-6 py-3 hover:bg-white/5 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-white/40 group-hover:text-neon-blue transition-colors" />
                    <span className={cn("text-white/80 group-hover:text-white", city === selectedLocation && "text-neon-blue font-bold")}>
                      {city}
                    </span>
                  </div>
                  {city === selectedLocation && <Check size={16} className="text-neon-blue" />}
                </button>
              ))
            ) : (
              <div className="px-6 py-4 text-white/40 text-center">
                No cities found.
              </div>
            )}

            <div className="px-4 py-2 bg-black/20 text-[10px] text-white/30 text-center border-t border-white/5">
              Listing major global and Indian cities
            </div>
          </div>
        )}
      </div>

      {/* Selected State Visual (Optional, if they want to see it strictly confirmed below) */}
      {selectedLocation && !isOpen && (
        <div className="mt-4 flex items-center justify-center gap-2 p-2 bg-neon-blue/10 border border-neon-blue/30 rounded-lg text-neon-blue text-sm">
          <Check size={14} /> Selected: <span className="font-bold">{selectedLocation}</span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
