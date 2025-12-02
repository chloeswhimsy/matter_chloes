import { Category, Landscape, Gift } from './types';
import { Flame, Activity, Heart, HandHeart, Mountain, Tent } from 'lucide-react';

export const CATEGORY_CONFIG: Record<Category, { color: string; icon: any; description: string }> = {
  [Category.Focus]: { color: 'text-indigo-600', icon: Mountain, description: 'Deep work and attention' },
  [Category.Achievement]: { color: 'text-amber-600', icon: Flame, description: 'Completing tasks' },
  [Category.Health]: { color: 'text-teal-600', icon: Activity, description: 'Body and mind well-being' },
  [Category.Connection]: { color: 'text-rose-600', icon: Heart, description: 'Relationships' },
  [Category.Meaning]: { color: 'text-purple-600', icon: Tent, description: 'Purpose and help' },
  [Category.Gratitude]: { color: 'text-emerald-600', icon: HandHeart, description: 'Thankfulness' },
};

export const LANDSCAPES: Landscape[] = [
  { id: 'meadow', name: 'Morning Meadow', description: 'A quiet start.', colors: ['from-green-100', 'to-blue-100'] },
  { id: 'mountains', name: 'Silent Mountains', description: 'Strength in stillness.', colors: ['from-stone-200', 'to-stone-400'] },
  { id: 'river', name: 'Flowing River', description: 'Constant change.', colors: ['from-cyan-100', 'to-blue-300'] },
  { id: 'lake', name: 'Mirror Lake', description: 'Deep reflection.', colors: ['from-indigo-200', 'to-purple-200'] },
  { id: 'sea', name: 'Endless Sea', description: 'Infinite possibilities.', colors: ['from-sky-200', 'to-blue-500'] },
];

export const GIFTS: Partial<Gift>[] = [
  // Plants
  { name: 'Mini succulent orb', icon: '🪴' },
  { name: 'Glow mushroom', icon: '🍄' },
  { name: 'Breathing moss cube', icon: '🟩' },
  { name: 'Singing daisy', icon: '🌼' },
  { name: 'Tiny bamboo sprout', icon: '🎋' },
  { name: 'Rainbow-leaf vine', icon: '🌈' },
  { name: 'Spinning dandelion seed', icon: '🌬️' },
  { name: 'Raindrop crystal flower', icon: '💠' },
  { name: 'Pocket bonsai', icon: '🌳' },
  { name: 'Dancing sunflower pixel pet', icon: '🌻' },

  // Decorations
  { name: 'Star string lights', icon: '✨' },
  { name: 'Cloud plush pillow', icon: '☁️' },
  { name: 'Tiny wind chime', icon: '🎐' },
  { name: 'Animated candle', icon: '🕯️' },
  { name: 'Little wooden house sign', icon: '🏠' },
  { name: 'Stargaze projector sphere', icon: '🔮' },
  { name: 'Mini wall art', icon: '🖼️' },
  { name: 'Crystal dreamcatcher', icon: '🕸️' },
  { name: 'Glittering glass orb', icon: '🔮' },
  { name: 'Rotating music box', icon: '🎼' },

  // Nature Elements
  { name: 'Sunset amber sphere', icon: '🌅' },
  { name: 'Ice-cube sprite', icon: '🧊' },
  { name: 'Pocket wave bottle', icon: '🌊' },
  { name: 'Cotton candy cloud puff', icon: '🍬' },
  { name: 'Mini whirling storm', icon: '🌪️' },
  { name: 'Walking raindrop', icon: '💧' },
  { name: 'Temperature-shifting leaf', icon: '🍁' },
  { name: 'Glow sand', icon: '🏜️' },
  { name: 'Tiny aurora pillar', icon: '🌌' },
  { name: 'Mini rainbow shard', icon: '🌈' },

  // Creatures & Pets
  { name: 'Bean bird', icon: '🐦' },
  { name: 'Paper fox', icon: '🦊' },
  { name: 'Bubble-blowing goldfish', icon: '🐠' },
  { name: 'Sleepy cat puff', icon: '🐱' },
  { name: 'Pixel dragon', icon: '🐉' },
  { name: 'Shy ghost buddy', icon: '👻' },
  { name: 'Leaf-hugging chameleon', icon: '🦎' },
  { name: 'Shape-shifting slime jelly', icon: '🍮' },
  { name: 'Mini zodiac animals', icon: '🐀' },
  { name: 'Tiny robot companion', icon: '🤖' },

  // Fun / Utility Items
  { name: 'Lucky fortune slip', icon: '📜' },
  { name: 'Mini coin pouch', icon: '💰' },
  { name: 'Music fragment', icon: '🎵' },
  { name: 'Mood bubble', icon: '💭' },
  { name: 'Pocket sand timer', icon: '⏳' },
  { name: 'Sticker pack drop', icon: '🏷️' },
  { name: 'Mystery-shaped key', icon: '🗝️' },
  { name: 'Daily treasure box', icon: '🎁' },
  { name: 'Mini energy drink bottle', icon: '⚡' },
  { name: 'DIY decor parts pack', icon: '🧩' },
];