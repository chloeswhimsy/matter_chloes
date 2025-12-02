import React, { useState, useEffect } from 'react';
import { Plus, Check, Gift as GiftIcon, Map as MapIcon, X, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AppState, Category, Goal, Gift } from './types';
import { CATEGORY_CONFIG, LANDSCAPES, GIFTS } from './constants';
import { loadState, saveState, getTodayString } from './services/storageService';
import { generateReflectionResponse } from './services/geminiService';
import { Visualizer } from './components/Visualizer';
import { ReflectionModal } from './components/ReflectionModal';
import { HistoryModal } from './components/HistoryModal';
import { CompletionAnimation } from './components/CompletionAnimation';

const MAX_GOALS = 3;

export default function App() {
  const [state, setState] = useState<AppState>(loadState());
  const [isReflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<Category>(Category.Focus);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [animatingCategory, setAnimatingCategory] = useState<Category | null>(null);
  const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);

  // Load and check date logic on mount
  useEffect(() => {
    const today = getTodayString();
    if (state.lastActiveDate !== today) {
      // Logic for new day streak handling
      const lastDate = state.lastActiveDate ? new Date(state.lastActiveDate) : new Date(0);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let newStreak = state.streak;
      if (state.lastActiveDate === '') {
        newStreak = 1; // First use
      } else if (diffDays === 1) {
        newStreak += 1; // Consecutive
      } else if (diffDays > 1) {
        newStreak = 1; // Reset
      }

      // Check landscape unlock
      const newLandscapes = [...state.unlockedLandscapes];
      if (newStreak % 3 === 0 && diffDays === 1) {
        // Unlock next landscape if available
        const nextLandscape = LANDSCAPES[newLandscapes.length];
        if (nextLandscape) {
           newLandscapes.push(nextLandscape.id);
           setNotification({ 
             title: "New Landscape Discovered", 
             message: `You've unlocked ${nextLandscape.name}!` 
           });
        }
      }

      const newState = {
        ...state,
        streak: newStreak,
        lastActiveDate: today,
        unlockedLandscapes: newLandscapes
      };
      
      setState(newState);
      saveState(newState);
    }
  }, []);

  // Filter goals to show only today's
  const todayString = getTodayString();
  const todaysGoals = state.goals.filter(g => g.date === todayString);

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    if (todaysGoals.length >= MAX_GOALS) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      text: newGoalText,
      category: newGoalCategory,
      completed: false,
      date: todayString, // Important: Set date
    };

    const newState = {
      ...state,
      goals: [...state.goals, newGoal]
    };

    setState(newState);
    saveState(newState);
    setNewGoalText('');
    setIsAddingGoal(false);
  };

  const handleCompleteClick = (goalId: string) => {
    setActiveGoalId(goalId);
    setReflectionModalOpen(true);
  };

  const handleReflectionSubmit = async (reflection: string) => {
    if (!activeGoalId) return;
    setIsSubmittingReflection(true);

    const goal = state.goals.find(g => g.id === activeGoalId);
    if (!goal) return;

    // Call Gemini
    const response = await generateReflectionResponse(goal.text, goal.category, reflection);

    // Update Goal
    const updatedGoals = state.goals.map(g => 
      g.id === activeGoalId 
        ? { ...g, completed: true, reflection, reflectionResponse: response, completedAt: new Date().toISOString() }
        : g
    );

    // Gift Logic
    let newInventory = [...state.inventory];
    let newGiftCount = state.giftsReceivedThisMonth;
    let newLastGiftMonth = state.lastGiftMonth;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    if (newLastGiftMonth !== currentMonth) {
      newGiftCount = 0;
      newLastGiftMonth = currentMonth;
    }

    // 35% chance of gift
    let giftReceived = null;
    if (Math.random() < 0.35) {
        const randomGift = GIFTS[Math.floor(Math.random() * GIFTS.length)];
        if (randomGift) {
            const fullGift: Gift = { 
                id: Date.now().toString(), 
                name: randomGift.name!, 
                icon: randomGift.icon!, 
                acquiredAt: new Date().toISOString() 
            };
            newInventory.push(fullGift);
            newGiftCount++;
            giftReceived = fullGift;
        }
    }

    const newState = {
      ...state,
      goals: updatedGoals,
      inventory: newInventory,
      giftsReceivedThisMonth: newGiftCount,
      lastGiftMonth: newLastGiftMonth
    };

    setState(newState);
    saveState(newState);

    setIsSubmittingReflection(false);
    setReflectionModalOpen(false);
    
    // Trigger Animation Popup
    setAnimatingCategory(goal.category);

    if (giftReceived) {
      setTimeout(() => {
        setNotification({
          title: "A Gift from the Forest",
          message: `You found a ${giftReceived.name} ${giftReceived.icon}`
        });
      }, 5000); // Show after completion animation
    }
  };

  const activeGoal = state.goals.find(g => g.id === activeGoalId);

  return (
    <div className="min-h-screen flex flex-col items-center bg-stone-50 text-stone-800 pb-20">
      
      {/* Header / Landscape */}
      <div className="w-full max-w-2xl px-4 pt-6">
        <div className="flex justify-between items-center mb-4">
           <div>
             <h1 className="text-3xl font-serif font-medium text-stone-900 tracking-tight">Matter</h1>
             <p className="text-xs text-stone-400 font-serif italic mt-1">The Three produce all things. ——Tao Te Ching</p>
           </div>
           <div className="flex gap-2 items-center">
             <div className="text-xs text-stone-400 font-medium uppercase tracking-widest mr-2">Day {state.streak}</div>
             
             {/* History Button */}
             <button 
                onClick={() => setShowHistory(true)}
                className="p-2 rounded-full hover:bg-stone-200 transition text-stone-600"
                title="View Journey"
             >
                <CalendarIcon size={20} />
             </button>

             {/* Inventory Button */}
             <button 
                onClick={() => setShowInventory(!showInventory)}
                className="p-2 rounded-full hover:bg-stone-200 transition text-stone-600 relative"
                title="Your Collection"
             >
                <GiftIcon size={20} />
                {state.inventory.length > 0 && (
                   <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full"></span>
                )}
             </button>
           </div>
        </div>

        <Visualizer 
          currentLandscapeId={state.currentLandscapeId}
          animatingCategory={animatingCategory}
          onAnimationComplete={() => setAnimatingCategory(null)}
        />
        
        {/* Landscape Selector (Simple Dots) */}
        {state.unlockedLandscapes.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {state.unlockedLandscapes.map(id => (
              <button
                key={id}
                onClick={() => {
                  const newState = { ...state, currentLandscapeId: id };
                  setState(newState);
                  saveState(newState);
                }}
                className={`w-2 h-2 rounded-full transition-all ${state.currentLandscapeId === id ? 'bg-stone-800 w-4' : 'bg-stone-300'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl px-4 mt-8 flex-1">
        
        <div className="flex justify-between items-end mb-4 border-b border-stone-200 pb-2">
           <h2 className="text-lg font-medium text-stone-700">Today's Intentions</h2>
           <span className="text-sm text-stone-400 font-mono">{todaysGoals.length} / {MAX_GOALS}</span>
        </div>

        {/* Goal List */}
        <div className="space-y-4">
          <AnimatePresence>
            {todaysGoals.map((goal) => {
               const config = CATEGORY_CONFIG[goal.category];
               const Icon = config.icon;
               return (
                 <motion.div
                   key={goal.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={`p-4 rounded-xl border transition-all ${goal.completed ? 'bg-stone-100 border-stone-200 opacity-75' : 'bg-white border-stone-200 shadow-sm hover:shadow-md'}`}
                 >
                    <div className="flex items-start gap-4">
                       <button
                         disabled={goal.completed}
                         onClick={() => handleCompleteClick(goal.id)}
                         className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                           goal.completed 
                             ? 'bg-stone-400 border-stone-400 text-white' 
                             : `border-stone-300 hover:border-${config.color.split('-')[1]}-400 text-transparent hover:text-stone-300`
                         }`}
                       >
                         <Check size={14} strokeWidth={3} />
                       </button>
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${config.color} flex items-center gap-1`}>
                              <Icon size={12} /> {goal.category}
                            </span>
                          </div>
                          <p className={`text-lg ${goal.completed ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                            {goal.text}
                          </p>
                          {goal.reflectionResponse && (
                            <div className="mt-3 p-3 bg-stone-50 rounded-lg text-sm text-stone-600 font-serif italic border-l-2 border-stone-300">
                              "{goal.reflectionResponse}"
                            </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
               );
            })}
          </AnimatePresence>

          {todaysGoals.length === 0 && !isAddingGoal && (
             <div className="text-center py-10 text-stone-400">
               <p>The canvas is empty.</p>
               <p className="text-sm">Identify three things that matter.</p>
             </div>
          )}
        </div>

        {/* Add Goal Button */}
        {todaysGoals.length < MAX_GOALS && !isAddingGoal && (
          <motion.button
            layout
            onClick={() => setIsAddingGoal(true)}
            className="w-full mt-4 py-4 border-2 border-dashed border-stone-300 rounded-xl text-stone-400 hover:text-stone-600 hover:border-stone-400 hover:bg-stone-50 transition flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Intention
          </motion.button>
        )}

        {/* Add Goal Form */}
        {isAddingGoal && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 bg-white p-6 rounded-xl shadow-lg border border-stone-100"
          >
             <h3 className="font-medium text-stone-700 mb-4">Select Category</h3>
             <div className="grid grid-cols-3 gap-2 mb-4">
               {Object.values(Category).map((cat) => {
                 const config = CATEGORY_CONFIG[cat];
                 const Icon = config.icon;
                 const isSelected = newGoalCategory === cat;
                 return (
                   <button
                     key={cat}
                     onClick={() => setNewGoalCategory(cat)}
                     className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                       isSelected 
                         ? `bg-stone-800 text-white shadow-md transform scale-105` 
                         : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                     }`}
                   >
                      <Icon size={16} />
                      {cat}
                   </button>
                 );
               })}
             </div>
             
             <input
               type="text"
               value={newGoalText}
               onChange={(e) => setNewGoalText(e.target.value)}
               placeholder="What is essential today?"
               className="w-full border-b-2 border-stone-200 py-2 text-lg focus:outline-none focus:border-stone-800 bg-transparent placeholder-stone-300"
               autoFocus
             />
             
             <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setIsAddingGoal(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoalText.trim()}
                  className="px-6 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-700 disabled:opacity-50 transition"
                >
                  Confirm
                </button>
             </div>
          </motion.div>
        )}
      </div>

      {/* NEW Completion Animation Overlay */}
      <AnimatePresence>
        {animatingCategory && (
           <CompletionAnimation 
              category={animatingCategory}
              onComplete={() => setAnimatingCategory(null)}
           />
        )}
      </AnimatePresence>

      {/* Reflection Modal */}
      <AnimatePresence>
        {isReflectionModalOpen && activeGoal && (
          <ReflectionModal
            isOpen={isReflectionModalOpen}
            onClose={() => setReflectionModalOpen(false)}
            onSubmit={handleReflectionSubmit}
            isSubmitting={isSubmittingReflection}
            goalText={activeGoal.text}
            category={activeGoal.category}
          />
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <HistoryModal 
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            goals={state.goals}
          />
        )}
      </AnimatePresence>

      {/* Inventory Modal / Overlay */}
      <AnimatePresence>
        {showInventory && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
             onClick={() => setShowInventory(false)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-stone-50 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 h-[70vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-2xl font-serif text-stone-800">Your Collection</h2>
                   <p className="text-xs text-stone-500">Treasures from the forest</p>
                 </div>
                 <button onClick={() => setShowInventory(false)} className="p-2 hover:bg-stone-200 rounded-full text-stone-500">
                   <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 p-1 pb-4 content-start">
                 {state.inventory.length === 0 ? (
                   <div className="col-span-3 text-center py-20 text-stone-400">
                     <p>The forest is yet to share its gifts.</p>
                     <p className="text-sm mt-2">Continue your journey.</p>
                   </div>
                 ) : (
                   state.inventory.map((gift) => (
                     <div key={gift.id} className="bg-white p-2 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center aspect-square text-center relative overflow-hidden group hover:border-stone-300 transition-colors">
                        <div className="flex-1 flex items-center justify-center w-full pt-1">
                            <div className="text-4xl drop-shadow-sm transform transition-transform group-hover:scale-110">{gift.icon}</div>
                        </div>
                        <div className="w-full pb-2 flex flex-col items-center justify-end">
                            <div className="text-[10px] text-stone-700 font-medium leading-tight line-clamp-2 h-8 flex items-center justify-center w-full px-0.5">
                                {gift.name}
                            </div>
                            <div className="text-[9px] text-stone-400 mt-0.5">
                                {new Date(gift.acquiredAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                            </div>
                        </div>
                     </div>
                   ))
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
             initial={{ y: -50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: -50, opacity: 0 }}
             className="fixed top-4 left-4 right-4 z-[70] flex justify-center pointer-events-none"
          >
             <div className="bg-stone-900/90 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
               <GiftIcon size={18} className="text-yellow-400" />
               <div>
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-stone-300">{notification.message}</div>
               </div>
             </div>
             {/* Auto dismiss logic wrapped in component or here */}
             {React.createElement(() => {
                useEffect(() => {
                   const t = setTimeout(() => setNotification(null), 4000);
                   return () => clearTimeout(t);
                }, []);
                return null;
             })}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}