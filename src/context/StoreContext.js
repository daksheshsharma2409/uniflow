"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { EVENTS, MOCK_USER } from "@/lib/mockData";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Null = not logged in
  const [loading, setLoading] = useState(true); // Add loading state
  const [events, setEvents] = useState(EVENTS);
  const [filteredEvents, setFilteredEvents] = useState(EVENTS);
  const [filters, setFilters] = useState({
    search: "",
    tags: [],
    type: "All",
    sortBy: "Latest" // Latest, Prize, Distance, Impressions
  });

  // Load user and users DB from localStorage on mount
  useEffect(() => {
    // Load Users DB
    const savedUsers = localStorage.getItem("visual_vortex_users_db");
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error("Failed to parse users db", e);
      }
    }

    // Load Active Session
    const savedUser = localStorage.getItem("visual_vortex_users_session"); // Changed key to avoid conflict or just use same
    // Actually, let's keep "visual_vortex_user" for session to match previous code, but ensure it syncs.
    const sessionUser = localStorage.getItem("visual_vortex_user");
    if (sessionUser) {
      try {
        setUser(JSON.parse(sessionUser));
      } catch (e) {
        console.error("Failed to parse session user", e);
        localStorage.removeItem("visual_vortex_user");
      }
    }
    setLoading(false); // Auth check complete
  }, []);

  const [users, setUsers] = useState([]); // Mock Database

  // Helper: Haversine Distance
  const getDistance = (lat1, lon1, lat2, lon2) => {
     if (!lat1 || !lon1 || !lat2 || !lon2) return 99999;
     const R = 6371; // Radius of the earth in km
     const dLat = (lat2 - lat1) * (Math.PI / 180);
     const dLon = (lon2 - lon1) * (Math.PI / 180);
     const a = 
       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
       Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
       Math.sin(dLon / 2) * Math.sin(dLon / 2); 
     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
     const d = R * c; // Distance in km
     return d;
  };

  // Authentication & User Management
  const register = (data, password) => {
    // Check if user exists
    if (users.some(u => u.email === data.email)) {
        throw new Error("User with this email already exists");
    }

    const newUser = {
      ...MOCK_USER,
      ...data,
      password, // Store password (plaintext for mock)
      id: Date.now().toString(),
      history: [],
      bookmarks: [],
      applied: [], // New: Track applied events
      interested: [] // New: Track interested events
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("visual_vortex_users_db", JSON.stringify(updatedUsers));

    // Auto login
    setUser(newUser);
    localStorage.setItem("visual_vortex_user", JSON.stringify(newUser));
  };

  const authenticate = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("visual_vortex_user", JSON.stringify(foundUser));
        return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("visual_vortex_user");
    setFilters({ ...filters, tags: [] }); // Reset filters
  };

  const updateUser = (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    
    // Update Session
    setUser(updatedUser);
    localStorage.setItem("visual_vortex_user", JSON.stringify(updatedUser));

    // Update DB
    const updatedUsers = users.map(u => u.email === user.email ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem("visual_vortex_users_db", JSON.stringify(updatedUsers));
  };

  const addToHistory = (eventId) => {
    if (!user) return;
    const newHistory = [eventId, ...user.history.filter(id => String(id) !== String(eventId))].slice(0, 50);
    updateUser({ history: newHistory });
  };

  const removeFromHistory = (eventId) => {
     if (!user) return;
     const newHistory = user.history.filter(id => String(id) !== String(eventId));
     updateUser({ history: newHistory });
  };

  const toggleBookmark = (eventId) => {
    if (!user) return;
    const isBookmarked = user.bookmarks.includes(eventId);
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = user.bookmarks.filter(id => id !== eventId);
    } else {
      newBookmarks = [...user.bookmarks, eventId];
    }
    updateUser({ bookmarks: newBookmarks });
  };

  const toggleApplied = (eventId) => {
    if (!user) return;
    const list = user.applied || [];
    const isApplied = list.includes(eventId);
    const newList = isApplied ? list.filter(id => id !== eventId) : [...list, eventId];
    updateUser({ applied: newList });
  };

  const toggleInterested = (eventId) => {
    if (!user) return;
    const list = user.interested || [];
    const isInterested = list.includes(eventId);
    const newList = isInterested ? list.filter(id => id !== eventId) : [...list, eventId];
    updateUser({ interested: newList });
  };

  const markAsDismissed = (notifId) => {
    if (!user) return;
    const list = user.dismissed || [];
    const newList = [...list, notifId];
    updateUser({ dismissed: newList });
  };

  const updateInterests = (newInterests) => {
    updateUser({ interests: newInterests });
  };

  // Derive Notifications
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
        setNotifications([]);
        return;
    }

    const notifs = [];
    const dismissed = user.dismissed || [];

    // Rule 1: Viewed but not Applied (from History)
    // Filter history events that are NOT in 'applied' list
    user.history.forEach(historyId => {
        // Skip if already applied
        if (user.applied?.includes(historyId)) return;

        const id = `remind-${historyId}`;
        if (dismissed.includes(id)) return; // Skip if dismissed

        // Find event details
        const event = EVENTS.find(e => String(e.id) === String(historyId));
        if (event) {
             notifs.push({
                 id: id,
                 type: "reminder",
                 eventId: historyId,
                 title: "Did you apply?",
                 message: `You viewed ${event.title}. Don't miss the deadline!`,
                 date: new Date().toISOString() // Just mock current time
             });
        }
    });

    // Rule 2: Interested events
    (user.interested || []).forEach(interestedId => {
        const id = `interest-${interestedId}`;
        if (dismissed.includes(id)) return; // Skip if dismissed

        const event = EVENTS.find(e => String(e.id) === String(interestedId));
        if (event) {
            notifs.push({
                id: id,
                type: "alert",
                eventId: interestedId,
                title: "Upcoming Event",
                message: `You are interested in ${event.title}. Make sure to prepare!`,
                date: new Date().toISOString()
            });
        }
    });

    setNotifications(notifs);

  }, [user, user?.history, user?.applied, user?.interested, user?.dismissed]);

  // Filter & Sort Logic
  useEffect(() => {
    let result = [...EVENTS];

    // 1. Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.organizer.toLowerCase().includes(q)
      );
    }

    // 2. Type
    if (filters.type !== "All" && filters.type !== "Recommended") {
      result = result.filter(e => e.type === filters.type);
    }

    // 3. User Interests
    if (filters.tags.length > 0) {
      result = result.filter(e => 
        e.tags.some(tag => filters.tags.includes(tag))
      );
    } else if (user && filters.type === "Recommended") {
       // Recommend based on User Interests
       result = result.filter(e => 
         e.tags.some(tag => user.interests.includes(tag))
       );
    }

    // 4. Sorting
    if (filters.sortBy === "Prize") {
        result.sort((a, b) => b.prizeValue - a.prizeValue);
    } else if (filters.sortBy === "Impressions") {
        result.sort((a, b) => b.impressions - a.impressions);
    } else if (filters.sortBy === "Distance" && user?.coordinates) {
        result.sort((a, b) => {
            const distA = getDistance(user.coordinates.lat, user.coordinates.lng, a.coordinates.lat, a.coordinates.lng);
            const distB = getDistance(user.coordinates.lat, user.coordinates.lng, b.coordinates.lat, b.coordinates.lng);
            return distA - distB;
        });
    } else {
        // Default: Latest (using ID as proxy for simplicity, or date if parsed)
        result.sort((a, b) => b.id - a.id);
    }

    setFilteredEvents(result);
  }, [filters, user]);

  return (
    <StoreContext.Provider value={{
      user,
      loading, // Expose loading
      register,
      authenticate,
      logout,
      updateUser,
      addToHistory,
      removeFromHistory,
      toggleBookmark,
      toggleApplied,
      toggleInterested,
      markAsDismissed, // New
      updateInterests,
      notifications, // New
      events,
      filteredEvents,
      filters,
      setFilters
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
