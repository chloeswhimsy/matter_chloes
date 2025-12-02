import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Category } from '../types';

interface ReflectionModalProps {
  goalText: string;
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reflection: string) => void;
  isSubmitting: boolean;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  goalText,
  category,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const [reflection, setReflection] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm uppercase tracking-wider text-stone-500 font-semibold mb-1">{category}</h3>
            <h2 className="text-xl font-serif text-stone-800">"{goalText}"</h2>
          </div>
          
          <p className="text-stone-600 mb-4 text-sm">
            Take a moment. How does this make you feel? What did you learn?
          </p>

          <textarea
            className="w-full p-3 bg-stone-50 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-300 min-h-[100px] resize-none text-stone-700 placeholder-stone-400"
            placeholder="I feel..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            autoFocus
          />

          <div className="mt-6 flex justify-end space-x-3">
             <button 
               onClick={onClose}
               disabled={isSubmitting}
               className="px-4 py-2 text-stone-500 hover:text-stone-700 text-sm font-medium"
             >
               Skip
             </button>
             <button
               onClick={() => onSubmit(reflection)}
               disabled={!reflection.trim() || isSubmitting}
               className={`px-6 py-2 rounded-full text-white font-medium shadow-md transition-all ${
                 !reflection.trim() || isSubmitting ? 'bg-stone-300 cursor-not-allowed' : 'bg-stone-800 hover:bg-stone-700'
               }`}
             >
               {isSubmitting ? 'Listening...' : 'Record'}
             </button>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200" />
      </motion.div>
    </div>
  );
};
