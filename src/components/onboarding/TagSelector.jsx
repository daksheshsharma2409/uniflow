"use client";
import React from "react";
import { TAGS } from "@/lib/tags";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { motion } from "framer-motion";

const TagSelector = ({ selectedTags, toggleTag }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {Object.entries(TAGS).map(([category, tags], index) => (
        <motion.div 
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
            {category}
          </h3>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="group relative outline-none"
                >
                  <Badge 
                    className={cn(
                      "text-sm px-4 py-2 cursor-pointer transition-all duration-300",
                      isActive 
                        ? "bg-white text-black font-bold scale-105" 
                        : "bg-surface-highlight text-white/50 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {tag}
                  </Badge>
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TagSelector;
