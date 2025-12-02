import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Quote, PieChart, LayoutGrid } from 'lucide-react';
import { Goal, Category } from '../types';
import { CATEGORY_CONFIG } from '../constants';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
}

const HEX_COLORS: Record<string, string> = {
  [Category.Focus]: '#4f46e5',      // indigo-600
  [Category.Achievement]: '#d97706', // amber-600
  [Category.Health]: '#0d9488',    // teal-600
  [Category.Connection]: '#e11d48', // rose-600
  [Category.Meaning]: '#9333ea',    // purple-600
  [Category.Gratitude]: '#059669',  // emerald-600
};

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, goals }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'stats'>('calendar');

  useEffect(() => {
    if (isOpen) {
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setViewDate(new Date());
        setViewMode('calendar');
    }
  }, [isOpen]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // Calendar Helpers
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Group goals by date
  const goalsByDate = useMemo(() => {
    const map: Record<string, Goal[]> = {};
    goals.forEach(g => {
      if (g.completed) {
        if (!map[g.date]) map[g.date] = [];
        map[g.date].push(g);
      }
    });
    return map;
  }, [goals]);

  // Stats Logic
  const getStats = (filterFn: (g: Goal) => boolean) => {
      const counts: Record<string, number> = {};
      let total = 0;
      goals.filter(g => g.completed && filterFn(g)).forEach(g => {
          counts[g.category] = (counts[g.category] || 0) + 1;
          total++;
      });
      
      return {
          data: Object.entries(counts)
            .map(([cat, count]) => ({ category: cat as Category, count }))
            .sort((a, b) => b.count - a.count),
          total
      };
  };

  const monthStats = useMemo(() => getStats(g => {
      const d = new Date(g.date);
      return d.getMonth() === month && d.getFullYear() === year;
  }), [goals, month, year]);

  const yearStats = useMemo(() => getStats(g => {
      const d = new Date(g.date);
      return d.getFullYear() === year;
  }), [goals, year]);

  const selectedGoals = goalsByDate[selectedDate] || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-stone-50 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-stone-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-stone-100 rounded-full text-stone-600">
               {viewMode === 'calendar' ? <CalendarIcon size={20} /> : <PieChart size={20} />}
             </div>
             <div>
               <h2 className="text-xl font-serif text-stone-800">Your Journey</h2>
               <p className="text-xs text-stone-400">
                 {viewMode === 'calendar' ? 'Read your past reflections' : 'Patterns in your path'}
               </p>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
             {/* Toggle View */}
             <div className="bg-stone-100 p-1 rounded-full flex">
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('stats')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'stats' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <PieChart size={16} />
                </button>
             </div>

             <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-2 rounded-full hover:bg-stone-100 ml-2">
               <X size={20} />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          
          {/* Controls (Month/Year Navigation) */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={handlePrevMonth} className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition">
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-medium text-stone-700 font-serif">
              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={handleNextMonth} className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition">
              <ChevronRight size={20} />
            </button>
          </div>

          <AnimatePresence mode="wait">
          {viewMode === 'calendar' ? (
            <motion.div 
                key="calendar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
            >
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-8">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs text-stone-400 font-medium py-2">
                        {day}
                    </div>
                    ))}
                    
                    {/* Empty cells */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const daysGoals = goalsByDate[dateKey] || [];
                    const isSelected = selectedDate === dateKey;
                    const isToday = dateKey === new Date().toISOString().split('T')[0];

                    return (
                        <button
                        key={dayNum}
                        onClick={() => setSelectedDate(dateKey)}
                        className={`aspect-square rounded-xl border flex flex-col items-center justify-start pt-1.5 relative overflow-hidden transition-all
                            ${isSelected 
                                ? 'bg-stone-800 text-white border-stone-800 shadow-md transform scale-105 z-10' 
                                : isToday 
                                    ? 'bg-white border-stone-300' 
                                    : 'bg-stone-100/50 border-transparent hover:bg-white hover:border-stone-200'
                            }
                        `}
                        >
                        <span className={`text-[10px] font-medium mb-1 ${isSelected ? 'text-white' : isToday ? 'text-stone-800' : 'text-stone-400'}`}>
                            {dayNum}
                        </span>
                        
                        {/* Dots for Categories */}
                        <div className="flex flex-wrap gap-0.5 justify-center px-1 w-full">
                            {daysGoals.slice(0, 3).map((g) => {
                            const colorClass = CATEGORY_CONFIG[g.category].color.replace('text-', 'bg-');
                            return (
                                <div key={g.id} className={`w-1 h-1 rounded-full ${colorClass}`} title={g.category} />
                            );
                            })}
                        </div>
                        </button>
                    );
                    })}
                </div>

                <div className="h-px bg-stone-200 mb-6" />

                {/* Journal Entries for Selected Date */}
                <div>
                    <h4 className="text-md font-serif text-stone-800 mb-4 flex items-center gap-2">
                        <span>{new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        <span className="text-stone-300 text-sm font-sans">•</span>
                        <span className="text-stone-400 text-sm font-sans font-normal">{selectedGoals.length} Entries</span>
                    </h4>

                    <div className="space-y-4">
                        {selectedGoals.length > 0 ? (
                            selectedGoals.map((goal) => {
                                const config = CATEGORY_CONFIG[goal.category];
                                const Icon = config.icon;
                                
                                return (
                                    <motion.div 
                                        key={goal.id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm"
                                    >
                                        {/* Entry Header */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`p-1.5 rounded-lg bg-stone-50 ${config.color}`}>
                                                <Icon size={14} />
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
                                                {goal.category}
                                            </span>
                                        </div>

                                        {/* Goal */}
                                        <div className="mb-4">
                                            <p className="text-stone-900 font-medium text-lg leading-snug">
                                                {goal.text}
                                            </p>
                                        </div>

                                        {/* Reflection */}
                                        {goal.reflection && (
                                            <div className="mb-4 pl-4 border-l-2 border-stone-200">
                                                <p className="text-stone-600 font-serif italic text-sm leading-relaxed">
                                                    "{goal.reflection}"
                                                </p>
                                            </div>
                                        )}

                                        {/* Spirit Response */}
                                        {goal.reflectionResponse && (
                                            <div className="flex gap-3 bg-stone-50/80 p-3 rounded-xl">
                                                <Quote className="text-stone-300 shrink-0" size={16} />
                                                <p className="text-xs text-stone-500 font-medium">
                                                    {goal.reflectionResponse}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                                <p className="text-stone-400 text-sm font-serif italic">No entries written for this day.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
          ) : (
            <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
            >
                {/* Monthly Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                    <h4 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-6 text-center">
                        {viewDate.toLocaleString('default', { month: 'long' })} Rainbow
                    </h4>
                    <RainbowChart data={monthStats.data} total={monthStats.total} />
                    <Legend data={monthStats.data} />
                </div>

                {/* Yearly Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                    <h4 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-6 text-center">
                        {year} Full Spectrum
                    </h4>
                    <RainbowChart data={yearStats.data} total={yearStats.total} />
                    <Legend data={yearStats.data} />
                </div>
            </motion.div>
          )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
};

// --- Subcomponents for Charts ---

const RainbowChart = ({ data, total }: { data: { category: Category, count: number }[], total: number }) => {
    if (total === 0) {
        return (
            <div className="h-40 flex flex-col items-center justify-center text-stone-300">
                <PieChart size={40} strokeWidth={1} className="mb-2 opacity-50"/>
                <span className="text-xs font-serif italic">No colors yet</span>
            </div>
        )
    }

    // Calculate arc segments for a semi-circle (Rainbow)
    let currentAngle = -180; // Start from left (semi-circle)
    const radius = 80;
    const strokeWidth = 25;
    const center = { x: 100, y: 100 };

    return (
        <div className="w-full flex justify-center -mb-16">
            <svg width="240" height="140" viewBox="0 0 200 110" className="overflow-visible">
                {/* Background Arc */}
                <path d="M20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f5f5f4" strokeWidth={strokeWidth} strokeLinecap="round" />

                {data.map((item, index) => {
                    const percentage = item.count / total;
                    const angleSpan = percentage * 180;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angleSpan;

                    // Convert polar to cartesian
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    const x1 = center.x + radius * Math.cos(startRad);
                    const y1 = center.y + radius * Math.sin(startRad);
                    const x2 = center.x + radius * Math.cos(endRad);
                    const y2 = center.y + radius * Math.sin(endRad);

                    // Large arc flag logic
                    const largeArcFlag = angleSpan > 180 ? 1 : 0;

                    const pathData = [
                        `M ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
                    ].join(' ');

                    currentAngle += angleSpan;

                    return (
                        <motion.path
                            key={item.category}
                            d={pathData}
                            fill="none"
                            stroke={HEX_COLORS[item.category]}
                            strokeWidth={strokeWidth}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                            title={`${item.category}: ${item.count}`}
                        />
                    );
                })}
                
                {/* Total Count in Center */}
                <text x="100" y="95" textAnchor="middle" className="fill-stone-800 text-3xl font-serif font-medium">
                    {total}
                </text>
                <text x="100" y="115" textAnchor="middle" className="fill-stone-400 text-xs uppercase tracking-widest">
                    Goals
                </text>
            </svg>
        </div>
    );
}

const Legend = ({ data }: { data: { category: Category, count: number }[] }) => {
    if (data.length === 0) return null;
    return (
        <div className="grid grid-cols-2 gap-3 mt-4">
            {data.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: HEX_COLORS[item.category] }} />
                        <span className="text-stone-600">{item.category}</span>
                    </div>
                    <span className="font-medium text-stone-800">{item.count}</span>
                </div>
            ))}
        </div>
    )
}