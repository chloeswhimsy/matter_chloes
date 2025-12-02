import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Category } from '../types';
import { LANDSCAPES } from '../constants';

interface VisualizerProps {
  currentLandscapeId: string;
  animatingCategory: Category | null;
  onAnimationComplete: () => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  currentLandscapeId,
}) => {
  const landscape = LANDSCAPES.find(l => l.id === currentLandscapeId) || LANDSCAPES[0];
  const [time, setTime] = useState(new Date().getHours());
  
  // Simple check: Day is 6am to 6pm
  const isNight = time < 6 || time > 18;

  useEffect(() => {
    // Update time check periodically if app is open long
    const interval = setInterval(() => {
        setTime(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full h-32 md:h-44 overflow-hidden rounded-3xl shadow-inner transition-colors duration-1000 ${isNight ? 'bg-indigo-950' : 'bg-sky-200'}`}>
      
      {/* Sky & Celestial Bodies */}
      <div className="absolute inset-0">
          {/* Day Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100 transition-opacity duration-1000 ${isNight ? 'opacity-0' : 'opacity-100'}`} />
          {/* Night Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 transition-opacity duration-1000 ${isNight ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Sun */}
          <motion.div 
            className="absolute top-4 right-10 w-12 h-12 rounded-full bg-yellow-300 blur-sm" 
            animate={{ 
                y: isNight ? 200 : 0, 
                opacity: isNight ? 0 : 1 
            }}
            transition={{ duration: 2 }}
          />

          {/* Moon */}
          <motion.div 
            className="absolute top-4 left-10 w-10 h-10 rounded-full bg-slate-100 blur-[2px]" 
            animate={{ 
                y: isNight ? 0 : 200, 
                opacity: isNight ? 1 : 0 
            }}
            transition={{ duration: 2 }}
          />
          
          {/* Stars (Only Night) */}
          <motion.div className="absolute inset-0" animate={{ opacity: isNight ? 1 : 0 }} transition={{ duration: 1 }}>
              {[...Array(10)].map((_, i) => (
                  <div key={i} className="absolute bg-white rounded-full w-0.5 h-0.5" style={{ top: `${Math.random() * 50}%`, left: `${Math.random() * 100}%` }} />
              ))}
          </motion.div>
      </div>

      {/* Landscape Content */}
      <div className="absolute inset-0 flex items-end justify-center pb-6">
        <svg width="100%" height="100%" viewBox="0 0 300 150" className="overflow-visible" preserveAspectRatio="xMidYMax slice">
            {getLandscapeScene(landscape.id, isNight)}
            
            {/* The Traveler (Always present, small scale) */}
            <g transform="translate(145, 120) scale(0.6)">
                <Traveler isNight={isNight} />
            </g>
        </svg>
      </div>
      
      {/* Text Overlay */}
      <div className="absolute top-4 left-6 text-white/90 font-serif italic text-sm drop-shadow-md">
        {landscape.name}
      </div>
    </div>
  );
};

// --- Landscape SVG Scenes ---

const getLandscapeScene = (id: string, isNight: boolean) => {
    switch (id) {
        case 'mountains':
            return (
                <g>
                    {/* Far Mountains */}
                    <path d="M0 150 L50 80 L100 150" className={isNight ? "fill-stone-800" : "fill-stone-300"} />
                    <path d="M50 80 L65 100 L35 100 Z" className="fill-white/80" /> {/* Snow Cap */}
                    
                    <path d="M200 150 L250 60 L300 150" className={isNight ? "fill-stone-800" : "fill-stone-400"} />
                    <path d="M250 60 L270 90 L230 90 Z" className="fill-white/80" /> {/* Snow Cap */}

                    {/* Mid Mountains */}
                    <path d="M80 150 L150 50 L220 150" className={isNight ? "fill-stone-700" : "fill-stone-500"} />
                    <path d="M150 50 L175 85 L125 85 Z" className="fill-white" /> {/* Snow Cap */}
                    
                    {/* Ground */}
                    <path d="M0 130 Q 150 140 300 130 L 300 150 L 0 150 Z" className={isNight ? "fill-stone-900" : "fill-stone-200"} />
                </g>
            );
        case 'river':
             return (
                 <g>
                     {/* Valley Walls */}
                     <path d="M0 150 L0 50 L100 150" className={isNight ? "fill-emerald-900" : "fill-emerald-700"} />
                     <path d="M300 150 L300 50 L200 150" className={isNight ? "fill-emerald-900" : "fill-emerald-600"} />
                     
                     {/* River */}
                     <path d="M100 150 Q 150 100 200 150" className={isNight ? "fill-cyan-900" : "fill-cyan-400"} />
                     {/* Flow lines */}
                     <motion.path 
                        d="M120 140 Q 150 120 180 140" 
                        className="stroke-white/30 fill-none" 
                        strokeWidth="1"
                        animate={{ d: ["M120 140 Q 150 120 180 140", "M120 145 Q 150 125 180 145"] }}
                        transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                     />
                 </g>
             );
        case 'sea':
             return (
                 <g>
                     {/* Ocean */}
                     <rect x="0" y="80" width="300" height="70" className={isNight ? "fill-blue-900" : "fill-blue-500"} />
                     {/* Sand */}
                     <path d="M0 150 L0 120 Q 150 110 300 120 L 300 150 Z" className={isNight ? "fill-amber-900" : "fill-amber-200"} />
                 </g>
             );
        case 'lake':
            return (
                <g>
                    {/* Lake Surface */}
                    <rect x="0" y="100" width="300" height="50" className={isNight ? "fill-indigo-900" : "fill-indigo-400"} />
                    {/* Reflection lines */}
                    <line x1="100" y1="110" x2="200" y2="110" className="stroke-white/10" strokeWidth="1" />
                    <line x1="50" y1="120" x2="250" y2="120" className="stroke-white/10" strokeWidth="1" />
                    
                    {/* Trees bg */}
                    <path d="M0 100 L20 70 L40 100 L60 80 L80 100" className={isNight ? "fill-stone-900" : "fill-emerald-900"} />
                </g>
            );
        case 'meadow':
        default:
            return (
                <g>
                    {/* Hills */}
                    <path d="M0 150 Q 75 100 150 150 T 300 150" className={isNight ? "fill-emerald-900" : "fill-emerald-400"} />
                    <path d="M-50 150 Q 50 80 150 150" className={isNight ? "fill-emerald-800" : "fill-emerald-500"} />
                    
                    {/* Tree */}
                    <g transform="translate(50, 110)">
                        <rect x="0" y="0" width="6" height="15" className="fill-amber-900" />
                        <circle cx="3" cy="0" r="12" className={isNight ? "fill-emerald-950" : "fill-emerald-700"} />
                    </g>
                </g>
            );
    }
}

// Re-using the Traveler geometry but statically for the visualizer
const Traveler = ({ isNight }: { isNight: boolean }) => {
    return (
        <g>
             {/* Back Leg */}
            <path d="M2 30 L2 50" className="stroke-stone-800" strokeWidth="6" strokeLinecap="round" />
            
            {/* Backpack */}
            <rect x="-10" y="-5" width="25" height="30" rx="4" className="fill-amber-700" />
            
            {/* Body */}
            <rect x="0" y="0" width="20" height="30" rx="4" className={isNight ? "fill-green-900" : "fill-green-700"} />
            
            {/* Belt */}
            <rect x="0" y="20" width="20" height="4" className="fill-amber-900" />
            
            {/* Front Leg */}
            <path d="M12 30 L12 50" className="stroke-stone-800" strokeWidth="6" strokeLinecap="round" />

            {/* Head */}
            <circle cx="10" cy="-10" r="11" className="fill-stone-200" />

            {/* Hat (Green Cone) */}
            <path d="M-2 -10 Q 10 -25 22 -10 L 10 -35 Z" className={isNight ? "fill-green-800" : "fill-green-600"} />
            
            {/* Scarf (small animation) */}
             <motion.path 
                d="M15 -2 Q 30 -5 45 -10" 
                className="stroke-red-400 fill-none" 
                strokeWidth="4" 
                strokeLinecap="round"
                animate={{ d: ["M15 -2 Q 30 -5 45 -10", "M15 -2 Q 30 0 45 -5", "M15 -2 Q 30 -5 45 -10"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
        </g>
    )
}