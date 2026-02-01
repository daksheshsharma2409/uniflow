"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import TagSelector from "@/components/onboarding/TagSelector";
import LocationPicker from "@/components/onboarding/LocationPicker";
import GlassButton from "@/components/ui/GlassButton";
import { ArrowRight, Check, User, Mail } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { updateUser, register, user } = useStore();
  const [step, setStep] = useState(1);
  
  // Local state for wizard
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(""); // New: Password
  const [tags, setTags] = useState(user?.interests || []);
  const [location, setLocation] = useState(user?.location || "");
  const [error, setError] = useState("");

  // Auto-skip step 1 if user data exists
  React.useEffect(() => {
    if (user?.name && user?.email) {
       setName(user.name);
       setEmail(user.email);
       setStep(2); // Skip to Interests
    }
  }, [user]);

  const toggleTag = (tag) => {
    setTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFinish = () => {
    try {
      if (!user) {
        // New Registration
        register({ name, email, interests: tags, location, avatar: "https://github.com/shadcn.png" }, password);
      } else {
        // Updating existing user
        updateUser({ interests: tags, location });
      }
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const nextStep = () => setStep(p => p + 1);
  const prevStep = () => setStep(p => p - 1);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-5xl z-10">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Profile */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                Let's get to <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-accent">know you.</span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl">
                Create your profile to start discovering.
              </p>
              
              <div className="w-full max-w-md space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-surface-highlight border border-white/10 rounded-2xl text-white focus:outline-none focus:border-neon-blue/50 transition-colors text-lg"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-surface-highlight border border-white/10 rounded-2xl text-white focus:outline-none focus:border-neon-blue/50 transition-colors text-lg"
                  />
                </div>
                {!user && (
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">***</div>
                      <input 
                        type="password" 
                        placeholder="Create Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-surface-highlight border border-white/10 rounded-2xl text-white focus:outline-none focus:border-neon-blue/50 transition-colors text-lg"
                      />
                    </div>
                )}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Interests */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                What drives <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-accent">you?</span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl">
                Select the topics that ignite your curiosity.
              </p>
              <TagSelector selectedTags={tags} toggleTag={toggleTag} />
            </motion.div>
          )}

          {/* STEP 3: Location */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                Where are <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-orange to-accent">you?</span>
              </h1>
              <p className="text-xl text-white/60">
                Find events happening around you.
              </p>
              <LocationPicker selectedLocation={location} setLocation={setLocation} />
            </motion.div>
          )}

          {/* STEP 4: Summary */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center space-y-12"
            >
               <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                All <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">Set!</span>
              </h1>
              <div className="p-8 border border-white/10 rounded-3xl bg-surface-highlight w-full max-w-md space-y-4">
                 <h3 className="text-2xl font-bold text-white">{name}</h3>
                 <p className="text-white/50">{email}</p>
                 <div className="flex flex-wrap gap-2 justify-center">
                    {tags.slice(0, 5).map(t => <span key={t} className="text-xs bg-white/10 px-2 py-1 rounded text-white/70">{t}</span>)}
                    {tags.length > 5 && <span className="text-xs text-white/40">+{tags.length - 5} more</span>}
                 </div>
                 <p className="text-neon-blue">{location}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-16 px-4">
           {step > 1 ? (
             <GlassButton onClick={prevStep} variant="ghost">Back</GlassButton>
           ) : <div />}
           
           {step < 4 ? (
             <GlassButton 
                onClick={nextStep} 
                variant="primary" 
                className="pl-8 pr-8" 
                disabled={(step === 1 && (!name || !email)) || (step === 2 && tags.length === 0) || (step === 3 && !location)}
             >
                Next Step <ArrowRight size={18} />
             </GlassButton>
           ) : (
             <GlassButton onClick={handleFinish} variant="neon" className="pl-8 pr-8">
                Start Exploring <Check size={18} />
             </GlassButton>
           )}
        </div>
      </div>
    </div>
  );
}
