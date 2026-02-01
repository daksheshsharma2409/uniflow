"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import GlassButton from "@/components/ui/GlassButton";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import GridBackground from "@/components/hero/GridBackground";

export default function LoginPage() {
  const router = useRouter();
  const { authenticate } = useStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (authenticate(email, password)) {
       router.push("/");
    } else {
       setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
       <div className="absolute inset-0 z-0 opacity-50">
          <GridBackground />
       </div>

       <div className="w-full max-w-md relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
             <ArrowLeft size={18} /> Back to Home
          </Link>
          
          <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
             <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
                <p className="text-white/50">Sign in to continue your journey.</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-white/70 uppercase">Email</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input 
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-blue transition-colors"
                         placeholder="name@example.com"
                         required
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-white/70 uppercase">Password</label>
                   <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input 
                         type="password" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-blue transition-colors"
                         placeholder="••••••••"
                         required
                      />
                   </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <GlassButton variant="primary" className="w-full justify-center h-12 mt-4" type="submit">
                   Sign In <LogIn size={18} />
                </GlassButton>
             </form>

             <div className="mt-6 text-center text-sm text-white/40">
                Don't have an account? <Link href="/onboarding" className="text-neon-blue hover:underline">Sign Up</Link>
             </div>
          </div>
       </div>
    </div>
  );
}
