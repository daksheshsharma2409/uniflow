"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Zap, Menu, X, User, Bell, Trash2 } from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout, notifications, markAsDismissed } = useStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Click outside listener
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
        scrolled && !mobileMenuOpen
          ? "bg-black/50 backdrop-blur-xl border-white/10 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-accent flex items-center justify-center text-black font-bold text-xl group-hover:scale-110 transition-transform">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">
            UNI<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-accent">FLOW</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/" active={pathname === "/"}>Home</NavLink>
          <NavLink href="/hackathons" active={pathname === "/hackathons"}>Hackathons</NavLink>
          <NavLink href="/workshops" active={pathname === "/workshops"}>Workshops</NavLink>
          <NavLink href="/cultural" active={pathname === "/cultural"}>Cultural</NavLink>

          {!user ? (
            <div className="flex items-center gap-4 ml-4">
              <Link href="/login" className="text-white/70 hover:text-white font-medium text-sm transition-colors">
                Login
              </Link>
              <Link href="/onboarding">
                <GlassButton variant="primary">
                  Sign Up
                </GlassButton>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-4">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative w-10 h-10 rounded-full bg-surface-highlight border border-white/10 flex items-center justify-center hover:border-neon-blue transition-colors text-white"
                >
                  <Bell size={18} />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-12 right-0 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 origin-top-right"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white">Notifications</h3>
                        <span className="text-xs text-white/50">{notifications.length} New</span>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                          {notifications.length > 0 ? (
                            notifications.map(notif => (
                              <NotificationItem key={notif.id} notif={notif} onDismiss={markAsDismissed} setNotifOpen={setNotifOpen} />
                            ))
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center py-6 text-white/30"
                            >
                              <p className="text-sm">You are all caught up!</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className="text-[10px] text-center text-white/20 mt-3 border-t border-white/5 pt-2">
                        Swipe left to dismiss
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-white/50">{user.email}</p>
              </div>
              <Link href="/profile">
                <div className="w-10 h-10 rounded-full bg-surface-highlight border border-white/10 flex items-center justify-center cursor-pointer hover:border-neon-blue transition-colors">
                  <User size={18} />
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col items-center gap-6 w-full px-10 pt-12">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-white hover:text-neon-blue transition-colors">Home</Link>
              <Link href="/hackathons" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-white hover:text-neon-purple transition-colors">Hackathons</Link>
              <Link href="/workshops" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-white hover:text-neon-green transition-colors">Workshops</Link>
              <Link href="/cultural" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-white hover:text-neon-orange transition-colors">Cultural</Link>
            </div>

            <div className="w-20 h-[1px] bg-white/10 my-4" />

            <div className="flex flex-col w-full px-10 gap-4">
              {!user ? (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <GlassButton variant="ghost" className="w-full justify-center text-lg py-6">Login</GlassButton>
                  </Link>
                  <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <GlassButton variant="primary" className="w-full justify-center text-lg py-6 font-bold shadow-[0_0_20px_rgba(0,243,255,0.2)]">Sign Up</GlassButton>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <GlassButton variant="ghost" className="w-full justify-center text-lg py-6">Profile</GlassButton>
                  </Link>
                  <GlassButton onClick={() => { logout(); setMobileMenuOpen(false); }} variant="outline" className="w-full justify-center text-lg py-6 border-red-500/50 text-red-400 hover:bg-red-500/10">Sign Out</GlassButton>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NotificationItem = ({ notif, onDismiss, setNotifOpen }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100 || info.offset.x < -100) {
          onDismiss(notif.id);
        }
      }}
      whileDrag={{ scale: 1.02, zIndex: 10 }}
      className="relative bg-white/5 rounded-xl border border-white/5 touch-pan-y cursor-grab active:cursor-grabbing overflow-hidden"
    >
      {/* Background Layers for Reveal Effect */}
      <div className="absolute inset-y-0 left-0 w-full bg-red-500/20 flex items-center justify-start pl-4 opacity-0 transition-opacity">
        <Trash2 size={16} className="text-red-500" />
      </div>
      <div className="absolute inset-y-0 right-0 w-full bg-red-500/20 flex items-center justify-end pr-4 opacity-0 transition-opacity">
        <Trash2 size={16} className="text-red-500" />
      </div>

      <div className="relative p-3 bg-[#0a0a0a]">
        <div className="flex justify-between items-start mb-1">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${notif.type === 'alert' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-orange/20 text-neon-orange'}`}>
            {notif.type === 'alert' ? 'Reminder' : 'Action Needed'}
          </span>
          <span className="text-[10px] text-white/30">Just now</span>
        </div>
        <p className="text-sm font-bold text-white/90 mb-1">{notif.title}</p>
        <p className="text-xs text-white/60 leading-relaxed">{notif.message}</p>
        <Link href={`/event/${notif.eventId}`} onClick={() => setNotifOpen(false)} className="block mt-2 text-xs text-neon-blue hover:underline">
          View Event →
        </Link>
      </div>
    </motion.div>
  );
};

const NavLink = ({ href, active, children }) => (
  <Link
    href={href}
    className={cn(
      "relative text-sm font-medium tracking-wide transition-colors duration-300 hover:text-white",
      active ? "text-white" : "text-white/60"
    )}
  >
    {children}
    {active && (
      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.8)] rounded-full" />
    )}
  </Link>
);

export default Navbar;
