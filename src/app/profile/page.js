"use client";
import React, { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import Badge from "@/components/ui/Badge";
import { LogOut, User, MapPin, Mail, Clock, Calendar, Heart, Trash2, Edit2, X } from "lucide-react";
import Link from "next/link";
import TagSelector from "@/components/onboarding/TagSelector";

export default function ProfilePage() {
  const { user, loading, logout, events, removeFromHistory, toggleBookmark, updateInterests } = useStore();
  const router = useRouter();
  const [historyEvents, setHistoryEvents] = useState([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("history"); // history | bookmarks
  const [isEditing, setIsEditing] = useState(false);
  const [editTags, setEditTags] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    // Resolve history IDs
    if (user.history && user.history.length > 0) {
       const history = user.history.map(id => events.find(e => e.id.toString() === id.toString())).filter(Boolean);
       setHistoryEvents(history);
    } else {
        setHistoryEvents([]);
    }

    // Resolve bookmark IDs
    if (user.bookmarks && user.bookmarks.length > 0) {
        const bookmarks = user.bookmarks.map(id => events.find(e => e.id.toString() === id.toString())).filter(Boolean);
        setBookmarkedEvents(bookmarks);
     } else {
         setBookmarkedEvents([]);
     }

     if (user.interests) {
         setEditTags(user.interests);
     }
  }, [user, loading, events, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSaveInterests = () => {
      updateInterests(editTags);
      setIsEditing(false);
  };

  const toggleEditTag = (tag) => {
    setEditTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
      return (
          <div className="min-h-screen pt-24 pb-12 px-6 container mx-auto flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 container mx-auto relative">
       {/* Edit Modal */}
       {isEditing && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
               <div className="glass-panel p-8 max-w-2xl w-full rounded-3xl relative">
                   <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                       <X size={24} />
                   </button>
                   <h2 className="text-2xl font-bold text-white mb-2">Edit Interests</h2>
                   <p className="text-white/50 mb-6">Select the topics you want to see in your feed.</p>
                   <TagSelector selectedTags={editTags} toggleTag={toggleEditTag} />
                   <div className="flex justify-end mt-8">
                       <GlassButton variant="primary" onClick={handleSaveInterests}>Save Changes</GlassButton>
                   </div>
               </div>
           </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: User Info */}
          <div className="space-y-6">
             <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue mb-4 border-2 border-neon-blue">
                   <User size={40} />
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
                <p className="text-white/50 mb-6">{user.email}</p>
                
                <div className="w-full space-y-4 text-left">
                   <div className="flex items-center gap-3 text-white/70">
                      <MapPin size={18} className="text-neon-purple"/>
                      <span>{user.location || "Location not set"}</span>
                   </div>
                   <div className="flex items-center gap-3 text-white/70">
                      <Mail size={18} className="text-neon-green"/>
                      <span>{user.email}</span>
                   </div>
                </div>

                <div className="w-full mt-8 pt-6 border-t border-white/10 group relative">
                   <div className="flex justify-between items-center mb-3">
                        <h3 className="text-left text-sm font-bold text-white/40 uppercase">Interests</h3>
                        <button onClick={() => setIsEditing(true)} className="text-neon-blue hover:bg-neon-blue/10 p-1 rounded transition-colors">
                            <Edit2 size={14} />
                        </button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {user.interests && user.interests.map(tag => (
                         <Badge key={tag} className="bg-white/5">{tag}</Badge>
                      ))}
                   </div>
                </div>

                <GlassButton onClick={handleLogout} variant="ghost" className="w-full justify-center mt-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                   <LogOut size={18} /> Logout
                </GlassButton>
             </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
             {/* Tabs */}
             <div className="flex gap-4 border-b border-white/10 pb-4">
                 <button 
                    onClick={() => setActiveTab("history")}
                    className={`flex items-center gap-2 text-lg font-bold pb-2 transition-colors ${activeTab === 'history' ? 'text-white border-b-2 border-neon-blue' : 'text-white/40 hover:text-white'}`}
                 >
                    <Clock size={20} /> Watch History
                 </button>
                 <button 
                    onClick={() => setActiveTab("bookmarks")}
                    className={`flex items-center gap-2 text-lg font-bold pb-2 transition-colors ${activeTab === 'bookmarks' ? 'text-white border-b-2 border-neon-blue' : 'text-white/40 hover:text-white'}`}
                 >
                    <Heart size={20} /> Bookmarks
                 </button>
             </div>

             {/* Content Area */}
             <div className="min-h-[400px]">
                 {activeTab === 'history' && (
                     historyEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {historyEvents.map(event => (
                              <div key={event.id} className="relative group">
                                  <Link href={`/event/${event.id}`}>
                                     <GlassCard className="p-4 flex gap-4 cursor-pointer hover:border-white/30 transition-all">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                           <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 pr-8">
                                           <div className="flex justify-between items-start">
                                              <Badge className="text-[10px] px-2 py-0.5 mb-1">{event.type}</Badge>
                                           </div>
                                           <h4 className="font-bold text-white line-clamp-1">{event.title}</h4>
                                           <p className="text-xs text-white/50">{event.organizer}</p>
                                        </div>
                                     </GlassCard>
                                  </Link>
                                  <button 
                                    onClick={(e) => { e.preventDefault(); removeFromHistory(event.id); }}
                                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white/70 hover:text-white transition-colors z-20"
                                    title="Remove from History"
                                  >
                                      <Trash2 size={14} />
                                  </button>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                           <p className="text-white/40">No history yet.</p>
                        </div>
                     )
                 )}

                 {activeTab === 'bookmarks' && (
                     bookmarkedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {bookmarkedEvents.map(event => (
                              <div key={event.id} className="relative">
                                  <Link href={`/event/${event.id}`}>
                                     <GlassCard className="p-4 flex gap-4 cursor-pointer hover:border-neon-blue/50 transition-all">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                           <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 pr-8">
                                           <h4 className="font-bold text-white line-clamp-1">{event.title}</h4>
                                           <p className="text-xs text-white/50">{event.organizer}</p>
                                        </div>
                                     </GlassCard>
                                  </Link>
                                  <button 
                                    onClick={(e) => { e.preventDefault(); toggleBookmark(event.id); }}
                                    className="absolute top-4 right-4 p-2 bg-neon-blue text-black rounded-full hover:scale-110 transition-transform z-20"
                                    title="Remove Bookmark"
                                  >
                                      <Heart size={14} fill="black" />
                                  </button>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                           <p className="text-white/40">No bookmarks yet. Save events to view them here.</p>
                        </div>
                     )
                 )}
             </div>
          </div>
       </div>
    </div>
  );
}
