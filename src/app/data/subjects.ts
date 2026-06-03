import { Book, Calculator, Beaker, Globe, Palette, Code, Music, Heart, Scale } from "lucide-react";

export interface Subject {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

export const subjects: Subject[] = [
  { id: "math", name: "Mathematics", icon: Calculator, color: "bg-blue-500" },
  { id: "science", name: "Science", icon: Beaker, color: "bg-green-500" },
  { id: "history", name: "History", icon: Book, color: "bg-amber-500" },
  { id: "geography", name: "Geography", icon: Globe, color: "bg-teal-500" },
  { id: "civics", name: "Civics", icon: Scale, color: "bg-pink-500" },
  { id: "computer", name: "Computer Science", icon: Code, color: "bg-purple-500" },
];

export default subjects;
