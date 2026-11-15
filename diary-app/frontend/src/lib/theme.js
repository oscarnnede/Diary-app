export const MOODS = [
  { id: "joyful", label: "Joyful", emoji: "😄" },
  { id: "excited", label: "Excited", emoji: "🤩" },
  { id: "grateful", label: "Grateful", emoji: "🙏" },
  { id: "calm", label: "Calm", emoji: "😌" },
  { id: "neutral", label: "Neutral", emoji: "😐" },
  { id: "anxious", label: "Anxious", emoji: "😬" },
  { id: "sad", label: "Sad", emoji: "😢" },
  { id: "angry", label: "Angry", emoji: "😤" },
];

export const COLORS = [
  { id: "coral", label: "Coral" },
  { id: "amber", label: "Amber" },
  { id: "teal", label: "Teal" },
  { id: "indigo", label: "Indigo" },
  { id: "rose", label: "Rose" },
  { id: "lime", label: "Lime" },
  { id: "sky", label: "Sky" },
  { id: "plum", label: "Plum" },
];

export function moodMeta(id) {
  return MOODS.find((m) => m.id === id) || MOODS[MOODS.length - 3];
}

// Every combination used anywhere in the app must appear literally somewhere
// for Tailwind's JIT scanner to generate it -- this object is that "somewhere".
export const COLOR_CLASSES = {
  coral: { bg: "bg-coral", soft: "bg-coral-soft", text: "text-coral", border: "border-coral", ring: "ring-coral", focusRing: "focus:ring-coral/30" },
  amber: { bg: "bg-amber", soft: "bg-amber-soft", text: "text-amber", border: "border-amber", ring: "ring-amber", focusRing: "focus:ring-amber/30" },
  teal: { bg: "bg-teal", soft: "bg-teal-soft", text: "text-teal", border: "border-teal", ring: "ring-teal", focusRing: "focus:ring-teal/30" },
  indigo: { bg: "bg-indigo", soft: "bg-indigo-soft", text: "text-indigo", border: "border-indigo", ring: "ring-indigo", focusRing: "focus:ring-indigo/30" },
  rose: { bg: "bg-rose", soft: "bg-rose-soft", text: "text-rose", border: "border-rose", ring: "ring-rose", focusRing: "focus:ring-rose/30" },
  lime: { bg: "bg-lime", soft: "bg-lime-soft", text: "text-lime", border: "border-lime", ring: "ring-lime", focusRing: "focus:ring-lime/30" },
  sky: { bg: "bg-sky", soft: "bg-sky-soft", text: "text-sky", border: "border-sky", ring: "ring-sky", focusRing: "focus:ring-sky/30" },
  plum: { bg: "bg-plum", soft: "bg-plum-soft", text: "text-plum", border: "border-plum", ring: "ring-plum", focusRing: "focus:ring-plum/30" },
};
