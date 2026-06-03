import { Book, Calculator, Beaker, Globe, Palette, Code, Music, Heart, Scale } from "lucide-react";

export interface Subject {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

export const subjects: Subject[] = [
  { id: "math", name: "Mathematics", icon: Calculator, color: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/10 text-white" },
  { id: "science", name: "Science", icon: Beaker, color: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/10 text-white" },
  { id: "history", name: "History", icon: Book, color: "bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/10 text-white" },
  { id: "geography", name: "Geography", icon: Globe, color: "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/10 text-white" },
  { id: "civics", name: "Civics", icon: Scale, color: "bg-gradient-to-br from-rose-500 to-pink-600 shadow-md shadow-rose-500/10 text-white" },
  { id: "computer", name: "Computer Science", icon: Code, color: "bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-md shadow-violet-500/10 text-white" },
];

export default subjects;
