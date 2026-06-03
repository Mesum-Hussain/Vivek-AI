import { LayoutDashboard, ListChecks, X, Award, Shield, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import subjects, { Subject } from "../data/subjects";

interface SidebarNavProps {
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject | null) => void;
  onOpenAssignments: () => void;
  onOpenProfile: () => void;
  onClose?: () => void;
  isAssignmentsView?: boolean;
  isProfileView?: boolean;
  classRank?: number;
  studentName?: string;
  studentAvatar?: string;
  averageScore?: number;
  completedCount?: number;
}

export function SidebarNav({
  selectedSubject,
  onSelectSubject,
  onOpenAssignments,
  onOpenProfile,
  onClose,
  isAssignmentsView = false,
  isProfileView = false,
  classRank = 3,
  studentName,
  studentAvatar,
  averageScore = 80,
  completedCount = 4,
}: SidebarNavProps) {
  // Gamified Level and XP Calculation
  const totalXp = completedCount * 120 + averageScore * 8;
  const xpPerLevel = 500;
  const currentLevel = Math.floor(totalXp / xpPerLevel) + 1;
  const xpInCurrentLevel = totalXp % xpPerLevel;
  const progressPercent = Math.min(Math.round((xpInCurrentLevel / xpPerLevel) * 100), 100);

  // Badge tier based on rank
  const getRankBadge = (rank: number) => {
    if (rank === 1) return { label: "Elite", color: "from-amber-400 to-yellow-500 text-yellow-950 border-amber-300" };
    if (rank === 2) return { label: "Master", color: "from-slate-300 to-slate-400 text-slate-900 border-slate-200" };
    if (rank <= 3) return { label: "Expert", color: "from-amber-600 to-amber-700 text-amber-50 border-amber-500" };
    return { label: "Scholar", color: "from-indigo-400 to-blue-500 text-white border-indigo-300" };
  };

  const badgeTier = getRankBadge(classRank);

  return (
    <div className="w-64 bg-slate-900 text-slate-100 border-r border-slate-800 h-screen flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-800 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">Vivek AI</h1>
            <p className="text-2xs text-slate-400 font-semibold tracking-wider uppercase">Classroom Portal</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        <div>
          <div className="mb-2 px-3">
            <p className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Navigation</p>
          </div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sm h-9.5 cursor-pointer ${
                selectedSubject === null && !isAssignmentsView && !isProfileView
                  ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              onClick={() => onSelectSubject(null)}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-sm h-9.5 cursor-pointer ${
                isAssignmentsView
                  ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              onClick={onOpenAssignments}
            >
              <ListChecks className="w-4 h-4 shrink-0" />
              Assignments
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-2 px-3">
            <p className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Subject Quests</p>
          </div>
          <div className="space-y-1">
            {subjects.map((subject) => {
              const Icon = subject.icon;
              const isSelected = selectedSubject?.id === subject.id && !isAssignmentsView && !isProfileView;
              return (
                <Button
                  key={subject.id}
                  variant="ghost"
                  className={`w-full justify-start gap-3 text-sm h-9.5 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600/30 text-indigo-200 border-l-2 border-indigo-500"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  onClick={() => onSelectSubject(subject)}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {subject.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gamified Student Status Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-2xs font-bold text-indigo-300 uppercase tracking-wide">Rank #{classRank}</span>
          </div>
          <span className={`text-3xs font-bold px-2 py-0.5 rounded-full border bg-gradient-to-r ${badgeTier.color}`}>
            {badgeTier.label}
          </span>
        </div>

        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 w-full hover:bg-slate-900 p-2.5 rounded-xl transition-all cursor-pointer border border-slate-850 bg-slate-900/40 text-left"
        >
          <div className="relative shrink-0">
            <img
              src={studentAvatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=faces"}
              alt={studentName || "Nobita Nobi"}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white border border-slate-950 shadow-md">
              {currentLevel}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{studentName || "Nobita Nobi"}</p>
            <div className="mt-1">
              <div className="flex justify-between text-[9px] text-slate-400 font-semibold mb-0.5">
                <span>LVL {currentLevel}</span>
                <span>{xpInCurrentLevel} / {xpPerLevel} XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
