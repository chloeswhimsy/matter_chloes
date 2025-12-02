import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../types';

interface CompletionAnimationProps {
  category: Category;
  onComplete: () => void;
}

export const CompletionAnimation: React.FC<CompletionAnimationProps> = ({ category, onComplete }) => {
  useEffect(() => {
    // Longer duration for the "Item Get" sequence to play out
    const timer = setTimeout(onComplete, 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/70 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-stone-50 w-full max-w-sm aspect-square rounded-[2rem] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden border-4 border-white ring-4 ring-stone-900/10"
      >
        {/* Background Atmosphere - darker, more dungeon/forest moody */}
        <div className="absolute inset-0 transition-colors duration-500">
            {category === Category.Achievement && <div className="w-full h-full bg-gradient-to-b from-orange-100 to-amber-200" />}
            {category === Category.Health && <div className="w-full h-full bg-gradient-to-b from-indigo-100 to-blue-200" />}
            {category === Category.Meaning && <div className="w-full h-full bg-gradient-to-b from-purple-100 to-fuchsia-200" />}
            {category === Category.Connection && <div className="w-full h-full bg-gradient-to-b from-rose-100 to-red-200" />}
            {category === Category.Gratitude && <div className="w-full h-full bg-gradient-to-b from-emerald-100 to-green-200" />}
            {category === Category.Focus && <div className="w-full h-full bg-gradient-to-b from-sky-100 to-cyan-200" />}
        </div>

        {/* Dynamic Particles Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Particles category={category} />
        </div>

        {/* Scene Container */}
        <div className="relative w-full h-full max-w-[280px] max-h-[280px] flex items-center justify-center">
            {getZeldaScene(category)}
        </div>

        {/* Caption - Styled like a text box */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
            className="absolute bottom-6 left-6 right-6 bg-stone-900/80 text-white rounded-xl p-3 text-center backdrop-blur-sm border border-stone-600/50 shadow-lg"
        >
            <p className="font-serif italic text-sm text-yellow-50">{getCaption(category)}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const getCaption = (category: Category) => {
    switch (category) {
        case Category.Achievement: return "A fine catch!";
        case Category.Health: return "Restoring hearts.";
        case Category.Meaning: return "A small kindness.";
        case Category.Connection: return "It's dangerous to go alone.";
        case Category.Gratitude: return "You got a letter!";
        default: return "The view from the top.";
    }
}

// --- Visual Components ---

const Particles = ({ category }: { category: Category }) => {
    // Generate some random floating particles (Triangles/Circles)
    return (
        <>
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-2 h-2 ${category === Category.Achievement || category === Category.Gratitude ? 'bg-yellow-400' : 'bg-white/40'} rounded-full`}
                    style={{ 
                        left: `${Math.random() * 100}%`, 
                        top: `${Math.random() * 100}%` 
                    }}
                    animate={{ 
                        y: [0, -40, -80], 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 2 + Math.random() * 2, 
                        repeat: Infinity, 
                        delay: Math.random() * 2 
                    }}
                />
            ))}
        </>
    )
}

const Radiance = () => (
    <motion.g
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{ opacity: 1, scale: 1.5, rotate: 45 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <rect 
                key={i} 
                x="48" y="-10" width="4" height="20" 
                className="fill-yellow-400" 
                transform={`rotate(${deg} 50 50)`} 
            />
        ))}
    </motion.g>
)

const Sparkles = ({ x, y }: { x: number, y: number }) => (
    <motion.g transform={`translate(${x}, ${y})`}>
        {[0, 120, 240].map((deg, i) => (
            <motion.path
                key={i}
                d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z"
                className="fill-yellow-300"
                transform={`rotate(${deg})`}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                    scale: [0, 1, 0], 
                    x: [0, Math.cos(deg * Math.PI / 180) * 20],
                    y: [0, Math.sin(deg * Math.PI / 180) * 20]
                }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5, delay: i * 0.2 }}
            />
        ))}
    </motion.g>
)

// --- The Hero ---
// A green-capped traveler
const Traveler = ({ pose, variants, animate, custom, heldItem }: any) => {
    return (
        <motion.g variants={variants} animate={animate} custom={custom}>
            
            {/* Scarf (visible in wind) */}
            {pose === 'windy' && (
                <motion.path 
                    d="M55 58 Q 70 55 85 50" 
                    className="stroke-red-400 fill-none" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    animate={{ d: ["M55 58 Q 70 55 85 50", "M55 58 Q 70 65 85 55", "M55 58 Q 70 50 85 45"] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                />
            )}

            {/* Back Leg */}
            <motion.rect x="42" y="90" width="6" height="20" rx="2" className="fill-stone-800" 
                animate={pose === 'walking' ? { height: [20, 15, 20], y: [90, 85, 90], x: [42, 40, 42] } : {}}
                transition={{ repeat: Infinity, duration: 0.6 }}
            />
            
            {/* Backpack */}
            <rect x="30" y="55" width="25" height="30" rx="4" className="fill-amber-700" />
            
            {/* Body */}
            <rect x="40" y="60" width="20" height="30" rx="4" className="fill-green-700" />
            
            {/* Belt */}
            <rect x="40" y="80" width="20" height="4" className="fill-amber-900" />
            <rect x="48" y="80" width="4" height="4" className="fill-yellow-500" />

            {/* Head */}
            <circle cx="50" cy="50" r="11" className="fill-stone-200" />

            {/* Hat (Green Cone) */}
            <path d="M38 50 Q 50 35 62 50 L 50 25 Z" className="fill-green-600" />
            
            {/* Front Leg */}
            <motion.rect x="52" y="90" width="6" height="20" rx="2" className="fill-stone-800" 
                 animate={pose === 'walking' ? { height: [20, 15, 20], y: [90, 85, 90], x: [52, 54, 52] } : {}}
                 transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
            />

            {/* Arms */}
            {pose === 'itemGet' ? (
                // Item Get Pose: Arms V-shape up
                <g>
                    <rect x="35" y="60" width="6" height="25" rx="2" className="fill-stone-200" transform="rotate(-150 38 63)" />
                    <rect x="59" y="60" width="6" height="25" rx="2" className="fill-stone-200" transform="rotate(150 62 63)" />
                </g>
            ) : pose === 'fishing' ? (
                // Fishing Pose: Arms forward
                <rect x="45" y="62" width="6" height="20" rx="2" className="fill-stone-200" transform="rotate(-70 48 65)" />
            ) : (
                // Idle / Walking
                <motion.rect x="47" y="62" width="6" height="22" rx="2" className="fill-stone-200" 
                    animate={pose === 'walking' ? { rotate: [-20, 20, -20] } : {}}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                />
            )}

            {/* HELD ITEM (For Item Get) */}
            {pose === 'itemGet' && heldItem && (
                <motion.g
                    initial={{ scale: 0, y: 0 }}
                    animate={{ scale: 1.2, y: -45 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                    {heldItem}
                </motion.g>
            )}
        </motion.g>
    );
};


// --- Scenes ---

const getZeldaScene = (category: Category) => {
    switch (category) {
        // ------------------------------------------------------------------
        // ACHIEVEMENT: Catching a Fish -> Item Get
        // ------------------------------------------------------------------
        case Category.Achievement:
            return (
                <svg width="100%" height="100%" viewBox="0 0 100 120" className="overflow-visible">
                    {/* Water Surface */}
                    <rect x="-50" y="100" width="200" height="40" className="fill-blue-300/50" />
                    
                    {/* The Traveler */}
                    <TravelerWrapper 
                        initialPose="fishing" 
                        finalPose="itemGet" 
                        delay={2.5}
                        heldItem={
                            <g>
                                <Radiance />
                                <path d="M-8 0 Q-5 -8 0 -5 Q 5 -8 8 0 Q 5 8 0 5 Q -5 8 -8 0" className="fill-blue-500 stroke-white" strokeWidth="1" />
                                <circle cx="-3" cy="-2" r="1" className="fill-white" />
                            </g>
                        }
                    />

                    {/* Fishing Rod & Line */}
                    <motion.g
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }} // Hide rod when catching
                        transition={{ delay: 2.5, duration: 0.1 }}
                    >
                        <line x1="55" y1="65" x2="85" y2="45" className="stroke-amber-900" strokeWidth="2" /> {/* Rod */}
                        <motion.line 
                            x1="85" y1="45" x2="85" y2="100" 
                            className="stroke-white" strokeWidth="0.5" 
                            animate={{ x2: [85, 85, 75], y2: [100, 110, 60] }} // Line animates
                            transition={{ times: [0, 0.6, 1], duration: 2.5 }}
                        />
                         {/* Bobber */}
                        <motion.circle 
                            cx="85" cy="100" r="3" className="fill-red-500"
                            animate={{ y: [0, 5, 0, 15, -60] }} // Bob, Bob, SINK, FLY UP
                            transition={{ times: [0, 0.3, 0.6, 0.7, 1], duration: 2.5 }}
                        />
                    </motion.g>

                    {/* Splash Effect */}
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ delay: 1.8, duration: 0.5 }}>
                        <circle cx="85" cy="100" r="8" className="stroke-white fill-none" strokeWidth="1" />
                        <circle cx="85" cy="100" r="12" className="stroke-white fill-none" strokeWidth="0.5" />
                    </motion.g>
                </svg>
            );

        // ------------------------------------------------------------------
        // GRATITUDE: Chest Open -> Postcard
        // ------------------------------------------------------------------
        case Category.Gratitude:
            return (
                <svg width="100%" height="100%" viewBox="0 0 100 120" className="overflow-visible">
                     <motion.g
                        initial={{ x: 0 }}
                        animate={{ x: -20 }} // Move traveler aside slightly
                        transition={{ delay: 0.5, duration: 0.5 }}
                     >
                        <TravelerWrapper 
                            initialPose="idle" 
                            finalPose="itemGet" 
                            delay={1.5}
                            heldItem={
                                <g>
                                    <Radiance />
                                    {/* Postcard */}
                                    <rect x="-8" y="-6" width="16" height="12" className="fill-white stroke-stone-300" strokeWidth="0.5"/>
                                    <path d="M-4 -2 L-2 0 L-4 2" className="stroke-red-400 fill-none" strokeWidth="1" /> {/* Heart scribble */}
                                    <Sparkles x={0} y={0} />
                                </g>
                            }
                        />
                     </motion.g>

                     {/* Chest */}
                     <motion.g transform="translate(60, 90)">
                        <rect x="-15" y="-10" width="30" height="20" rx="2" className="fill-amber-800" />
                        <rect x="-15" y="-5" width="30" height="2" className="fill-amber-950" />
                        <rect x="-3" y="-6" width="6" height="4" className="fill-yellow-500" />
                        
                        {/* Lid opening */}
                        <motion.path 
                            d="M-15 -10 L15 -10 L15 0 L-15 0 Z" 
                            className="fill-amber-700 stroke-amber-900"
                            style={{ originY: "0px" }}
                            initial={{ rotateX: 0 }}
                            animate={{ rotateX: 180 }}
                            transition={{ delay: 1, duration: 0.5, type: "spring" }}
                        />
                        {/* Light from chest */}
                        <motion.path 
                             d="M-10 0 L10 0 L20 -50 L-20 -50 Z" 
                             className="fill-yellow-200/50"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: [0, 1, 0] }}
                             transition={{ delay: 1.1, duration: 1 }}
                        />
                     </motion.g>
                </svg>
            );

        // ------------------------------------------------------------------
        // HEALTH (Was LEISURE): Campfire & Fairy
        // ------------------------------------------------------------------
        case Category.Health:
            return (
                 <svg width="100%" height="100%" viewBox="0 0 100 120" className="overflow-visible">
                     <Traveler pose="sitting" />
                     
                     {/* Campfire */}
                     <g transform="translate(65, 100)">
                         <rect x="-10" y="0" width="20" height="4" className="fill-stone-600" rx="1" />
                         {/* Flames */}
                         <motion.path 
                            d="M-5 0 Q0 -15 5 0" 
                            className="fill-orange-500"
                            animate={{ d: ["M-5 0 Q0 -15 5 0", "M-6 0 Q0 -20 6 0", "M-5 0 Q0 -15 5 0"], opacity: [0.8, 1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                         />
                         <motion.path 
                            d="M-2 0 Q0 -10 2 0" 
                            className="fill-yellow-400"
                            animate={{ d: ["M-2 0 Q0 -10 2 0", "M-3 0 Q0 -14 3 0", "M-2 0 Q0 -10 2 0"] }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                         />
                     </g>

                     {/* Fairy (Navi style) */}
                     <motion.g
                        initial={{ x: 30, y: 70 }}
                        animate={{ 
                            x: [30, 80, 20, 30], 
                            y: [70, 60, 50, 70] 
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                     >
                         <circle r="4" className="fill-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                         <motion.ellipse rx="8" ry="3" className="fill-white/70" 
                            animate={{ rotate: [0, 20, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 0.2 }}
                         />
                     </motion.g>

                     {/* Zzz */}
                     <motion.g transform="translate(30, 40)">
                         <motion.text x="0" y="0" className="fill-stone-400 text-xs font-serif"
                            animate={{ y: -20, opacity: [0, 1, 0], x: 5 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                         >z</motion.text>
                         <motion.text x="0" y="0" className="fill-stone-400 text-sm font-serif"
                            animate={{ y: -25, opacity: [0, 1, 0], x: -5 }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                         >Z</motion.text>
                     </motion.g>
                 </svg>
            );

        // ------------------------------------------------------------------
        // MEANING: Healing Bird
        // ------------------------------------------------------------------
        case Category.Meaning:
            return (
                <svg width="100%" height="100%" viewBox="0 0 100 120" className="overflow-visible">
                    <motion.g initial={{ y: 0 }} animate={{ y: 5 }}>
                        <Traveler pose="kneeling" />
                    </motion.g>

                    {/* Bird Interaction */}
                    <g transform="translate(70, 95)">
                        {/* The Bird */}
                        <motion.g
                            initial={{ opacity: 1, x: 0, y: 0 }}
                            animate={{ 
                                x: [0, 40, 60], 
                                y: [0, -60, -80],
                                scale: [1, 1.2, 0]
                            }}
                            transition={{ delay: 2, duration: 2, ease: "easeIn" }}
                        >
                            <motion.path 
                                d="M0 0 L5 3 L0 6 L-3 3 Z" 
                                className="fill-stone-400"
                                animate={{ fill: ["#a8a29e", "#fcd34d", "#fcd34d"] }} // Grey to Gold
                                transition={{ delay: 1, duration: 0.5 }}
                            />
                            {/* Wings */}
                            <motion.path 
                                d="M0 3 L-5 0" stroke="currentColor" strokeWidth="1" className="text-stone-400"
                                animate={{ 
                                    d: ["M0 3 L-5 0", "M0 3 L-5 6"], 
                                    stroke: ["#a8a29e", "#fcd34d"] 
                                }}
                                transition={{ repeat: Infinity, duration: 0.1 }}
                            />
                        </motion.g>
                        
                        {/* Magic Glow on touch */}
                        <motion.circle 
                            r="15" className="fill-yellow-200/50"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.5, 0] }}
                            transition={{ delay: 1, duration: 0.8 }}
                        />
                        
                        {/* Hearts Trail */}
                        <motion.path 
                            d="M0 0 L5 -5 L10 0" 
                            className="stroke-pink-400 fill-none"
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: [0, 1, 0], y: -30 }}
                            transition={{ delay: 2.2, duration: 1.5, repeat: Infinity }}
                        />
                    </g>
                </svg>
            );

        // ------------------------------------------------------------------
        // CONNECTION: Walking & Cabin
        // ------------------------------------------------------------------
        case Category.Connection:
            return (
                 <svg width="100%" height="100%" viewBox="0 0 200 120" className="overflow-visible">
                     {/* Background Trees (Parallax) */}
                     <motion.g animate={{ x: [-20, -100] }} transition={{ duration: 5, ease: "linear" }}>
                        <path d="M120 100 L130 70 L140 100" className="fill-green-200" />
                        <path d="M180 100 L190 60 L200 100" className="fill-green-200" />
                     </motion.g>

                     {/* The Cabin */}
                     <motion.g
                        initial={{ x: 200 }}
                        animate={{ x: 100 }}
                        transition={{ duration: 5, ease: "linear" }}
                     >
                         <rect x="0" y="70" width="40" height="30" className="fill-amber-800" />
                         <path d="M-5 70 L20 45 L45 70" className="fill-amber-900" />
                         <rect x="15" y="85" width="10" height="15" className="fill-yellow-600" /> {/* Door */}
                         <rect x="20" y="60" width="5" height="10" className="fill-stone-600" /> {/* Chimney */}
                         <motion.circle cx="20" cy="55" r="2" className="fill-white/50" animate={{ y: -20, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5 }} />
                     </motion.g>

                     {/* Travelers */}
                     <motion.g animate={{ x: [0, 20] }} transition={{ duration: 5 }}>
                        <Traveler pose="walking" />
                        <g transform="translate(-30, 5)">
                             <Traveler pose="walking" /> {/* Companion */}
                        </g>
                     </motion.g>
                 </svg>
            );

        // ------------------------------------------------------------------
        // FOCUS: Mountain Summit
        // ------------------------------------------------------------------
        default:
             return (
                 <svg width="100%" height="100%" viewBox="0 0 100 120" className="overflow-visible">
                     {/* Peak */}
                     <path d="M0 120 L50 70 L100 120" className="fill-stone-300" />
                     <path d="M50 70 L60 85 L40 85 Z" className="fill-white/60" />
                     
                     <g transform="translate(0, -15)">
                        <Traveler pose="windy" />
                     </g>

                     {/* Wind Lines */}
                     <motion.path 
                        d="M0 50 L30 50" 
                        className="stroke-white/30" strokeWidth="1"
                        animate={{ x: [100, -50], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     />
                     <motion.path 
                        d="M10 60 L40 60" 
                        className="stroke-white/30" strokeWidth="1"
                        animate={{ x: [100, -50], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
                     />
                 </svg>
             );
    }
};


// Helper wrapper to handle state transition from Animation A to "Item Get"
const TravelerWrapper = ({ initialPose, finalPose, delay, heldItem }: any) => {
    const [pose, setPose] = useState(initialPose);
    
    useEffect(() => {
        const t = setTimeout(() => {
            setPose(finalPose);
        }, delay * 1000);
        return () => clearTimeout(t);
    }, [delay, finalPose]);

    return <Traveler pose={pose} heldItem={heldItem} />;
}