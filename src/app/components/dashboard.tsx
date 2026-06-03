import { useState, useEffect, useRef, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight,
  Trophy,
  Zap,
  Flame,
  Award,
  Sparkles,
  Compass,
  Play
} from "lucide-react";
import subjects, { Subject } from "../data/subjects";
import { TeacherGuidanceNote } from "./teacher-portal";

const AUTO_ADVANCE_MS = 6000;
const MANUAL_PAUSE_MS = 10000;

function TeacherGuidanceCarousel({ notes }: { notes: TeacherGuidanceNote[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number, fromUser = false) => {
      const next = ((index % notes.length) + notes.length) % notes.length;
      setActiveIndex(next);
      if (fromUser) {
        setIsPaused(true);
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), MANUAL_PAUSE_MS);
      }
    },
    [notes.length]
  );

  useEffect(() => {
    if (notes.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % notes.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [notes.length, isPaused]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const delta = clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) {
      setTimeout(() => setIsPaused(false), MANUAL_PAUSE_MS);
      return;
    }
    if (delta < 0) goTo(activeIndex + 1, true);
    else goTo(activeIndex - 1, true);
  };

  const guidance = notes[activeIndex];
  const subject = subjects.find((s) => s.id === guidance.subjectId);
  const subjectColor = subject?.color ?? "bg-indigo-500";

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Card
        className="relative w-full p-5 md:p-6 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 shadow-md overflow-hidden rounded-2xl animate-glow-purple"
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
      >
        {notes.length > 1 && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-750"
              aria-label="Previous teacher comment"
              onClick={() => goTo(activeIndex - 1, true)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-750"
              aria-label="Next teacher comment"
              onClick={() => goTo(activeIndex + 1, true)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        <div
          key={activeIndex}
          className="flex flex-col sm:flex-row gap-4 items-start px-8 sm:px-10 animate-fade-in"
        >
          <img
            src={
              guidance.avatar ??
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces"
            }
            alt={guidance.teacherName}
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400 shrink-0 mx-auto sm:mx-0"
          />
          <div className="min-w-0 flex-1 text-center sm:text-left w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <Badge className={`${subjectColor} border-0 text-3xs font-bold`}>
                {guidance.subjectName} Note
              </Badge>
              <span className="text-3xs text-slate-500 font-semibold">
                {activeIndex + 1} of {notes.length}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-200">{guidance.teacherName}</p>
            <p className="text-sm md:text-base text-indigo-200/90 mt-2 italic leading-relaxed font-medium">
              &ldquo;{guidance.note}&rdquo;
            </p>
          </div>
        </div>
      </Card>

      <div
        className="flex justify-center items-center gap-1.5 mt-3"
        role="tablist"
        aria-label="Teacher guidance comments"
      >
        {notes.map((note, index) => (
          <button
            key={note.subjectId}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`View comment from ${note.teacherName}`}
            onClick={() => goTo(index, true)}
            className={`rounded-full transition-all duration-350 ${
              index === activeIndex
                ? "h-2 w-6 bg-indigo-500"
                : "h-2 w-2 bg-slate-350 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: Date;
  duration: number; // in minutes
  status: "pending" | "in-progress" | "completed" | "graded";
  percentage?: number; // 0-100 percentage score
  grade?: string; // Letter grade (A+, A, B+, etc.)
  rank?: number; // Numeric rank in class
}

interface DashboardProps {
  assignments: Assignment[];
  classRank?: number;
  studentName?: string;
  teacherNotes?: TeacherGuidanceNote[];
  onStartAssignment?: (assignment: Assignment, subject: Subject) => void;
  onSelectSubject?: (subject: Subject | null) => void;
}

export function Dashboard({
  assignments,
  classRank = 3,
  studentName = "Student",
  teacherNotes = [],
  onStartAssignment,
  onSelectSubject,
}: DashboardProps) {
  const colorMap: Record<string, string> = {
    math: "#3b82f6",
    science: "#10b981",
    history: "#f59e0b",
    geography: "#06b6d4",
    civics: "#f43f5e",
    computer: "#8b5cf6",
  };

  const performanceData = subjects.map((s) => {
    const graded = assignments.filter((a) => a.subjectId === s.id && a.status === "graded" && typeof a.percentage === "number");
    const value = graded.length
      ? Math.round(graded.reduce((sum, a) => sum + (a.percentage || 0), 0) / graded.length)
      : 0;
    return { id: s.id, name: s.name, value, color: colorMap[s.id] || "#8884d8" };
  });

  const nonZero = performanceData.filter((p) => p.value > 0);
  const overallAverage = nonZero.length > 0
    ? Math.round(nonZero.reduce((sum, p) => sum + p.value, 0) / nonZero.length)
    : 0;

  const renderSliceLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius = 0, outerRadius = 80, value } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" style={{ fontWeight: 800, fontSize: 11 }}>
        {`${value}%`}
      </text>
    );
  };

  const classAverage = 83;
  const studentRank = overallAverage >= classAverage ? "Above Average" : "Below Average";
  const classPosition = overallAverage >= 90 ? "Top 10%" : overallAverage >= 80 ? "Top 25%" : "Top 50%";

  // Gamified Level System synced with SidebarNav
  const gradedCount = assignments.filter((a) => a.status === "graded").length;
  const totalXp = gradedCount * 120 + overallAverage * 8;
  const xpPerLevel = 500;
  const currentLevel = Math.floor(totalXp / xpPerLevel) + 1;
  const xpInCurrentLevel = totalXp % xpPerLevel;
  const progressPercent = Math.min(Math.round((xpInCurrentLevel / xpPerLevel) * 100), 100);

  // Active assignments filtering
  const activeQuests = assignments.filter((a) => a.status !== "graded").slice(0, 3);

  // Gamified Badge descriptions
  const getBadgeName = (rank: number) => {
    if (rank === 1) return { name: "Grandmaster", desc: "Highest academic standing", color: "from-yellow-400 via-amber-500 to-orange-500" };
    if (rank === 2) return { name: "Vanguard", desc: "Runner-up top honor", color: "from-slate-350 to-slate-500" };
    if (rank === 3) return { name: "Champion", desc: "Bronze tier commander", color: "from-amber-600 to-amber-800" };
    return { name: "Explorer", desc: "Dedicated subject quester", color: "from-blue-500 to-indigo-600" };
  };

  const activeBadge = getBadgeName(classRank);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/50 pb-16 md:pb-0">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Quest Hub Header & Level Card */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Compass className="w-6 h-6 text-indigo-600 animate-spin" style={{ animationDuration: "12s" }} />
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Quest Hub Overview</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Welcome back, {studentName}!</h2>
              <p className="text-slate-500 text-sm mt-1 font-medium">Progress your levels by completing critical discussions with your AI Study Buddy.</p>
            </div>

            {/* Level & XP Progression Widget */}
            <Card className="w-full lg:w-96 p-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-0 shadow-lg shadow-indigo-950/20 flex flex-col justify-between rounded-2xl relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-2 -translate-y-2">
                <Sparkles className="w-32 h-32 text-white" />
              </div>
              <div className="flex items-center justify-between gap-3 mb-2 z-10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-sm text-indigo-300">
                    LV
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-200">Current Level</p>
                    <p className="text-base font-extrabold">Level {currentLevel}</p>
                  </div>
                </div>
                <Badge className="bg-indigo-500/25 text-indigo-200 hover:bg-indigo-500/25 border-indigo-500/30 text-3xs font-bold">
                  {totalXp} Total XP
                </Badge>
              </div>
              <div className="z-10 mt-2">
                <div className="flex justify-between text-2xs font-bold text-indigo-200 mb-1">
                  <span>Level Progress</span>
                  <span>{progressPercent}% ({xpInCurrentLevel} / {xpPerLevel} XP)</span>
                </div>
                <div className="w-full bg-slate-950/50 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {teacherNotes.length > 0 && (
            <div className="mb-8 animate-fade-in w-full">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-slate-800" />
                <h3 className="text-2xs font-extrabold text-slate-800 uppercase tracking-widest">
                  Guidance from your subject teachers
                </h3>
              </div>
              <TeacherGuidanceCarousel notes={teacherNotes} />
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-quest-card p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-3xs font-bold text-slate-400 uppercase tracking-wider">Overall Average</p>
                <p className="text-xl font-extrabold text-slate-800 mt-0.5">{overallAverage}%</p>
                <p className="text-3xs text-emerald-600 font-bold mt-0.5">· Stable Progress</p>
              </div>
            </Card>

            <Card className="bg-quest-card p-4 flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Trophy className="w-5 h-5 animate-float-slow" />
              </div>
              <div className="min-w-0">
                <p className="text-3xs font-bold text-slate-400 uppercase tracking-wider">Class Rank</p>
                <p className="text-xl font-extrabold text-amber-600 mt-0.5">#{classRank}</p>
                <p className="text-3xs text-slate-500 font-semibold truncate mt-0.5">{classPosition} · {studentRank}</p>
              </div>
            </Card>

            <Card className="bg-quest-card p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-3xs font-bold text-slate-400 uppercase tracking-wider">Active Quests</p>
                <p className="text-xl font-extrabold text-slate-800 mt-0.5">
                  {assignments.filter((a) => a.status !== "graded").length}
                </p>
                <p className="text-3xs text-indigo-500 font-bold mt-0.5">· AI Buddy Awaiting</p>
              </div>
            </Card>

            <Card className="bg-quest-card p-4 flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                <Flame className="w-5 h-5 text-rose-500" />
              </div>
              <div className="min-w-0">
                <p className="text-3xs font-bold text-slate-400 uppercase tracking-wider">Due This Week</p>
                <p className="text-xl font-extrabold text-rose-600 mt-0.5">
                  {assignments.filter((a) => {
                    const today = new Date();
                    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return a.dueDate <= weekFromNow && a.status !== "graded";
                  }).length}
                </p>
                <p className="text-3xs text-rose-500 font-bold mt-0.5">· Immediate Action</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Interactive Quest Log */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-5 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-800">Featured Expeditions</h3>
                    <p className="text-xs text-slate-500">Launch discussions immediately to gain massive XP rewards.</p>
                  </div>
                  <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-3xs font-bold border-indigo-200">
                    Next Level: +{xpPerLevel - xpInCurrentLevel} XP
                  </Badge>
                </div>

                <div className="space-y-3.5">
                  {activeQuests.map((quest) => {
                    const subject = subjects.find((s) => s.id === quest.subjectId);
                    if (!subject) return null;
                    const SubjectIcon = subject.icon;

                    return (
                      <div 
                        key={quest.id}
                        className="p-3.5 border border-slate-100 hover:border-indigo-100 rounded-xl flex items-center justify-between gap-4 bg-slate-50/40 hover:bg-indigo-50/10 transition-all group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`p-2.5 rounded-xl ${subject.color} text-white shrink-0 group-hover:scale-105 transition-transform`}>
                            <SubjectIcon className="w-4.5 h-4.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-650 transition-colors">{quest.title}</h4>
                            <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{subject.name} · {quest.duration} min duration</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-0.5">+120 XP</span>
                          {onStartAssignment && (
                            <Button 
                              size="sm"
                              onClick={() => onStartAssignment(quest, subject)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-7.5 px-3 text-2xs font-semibold cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {activeQuests.length === 0 && (
                    <div className="text-center p-8 border-2 border-dashed border-slate-100 rounded-xl">
                      <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">All Quests Completed!</p>
                      <p className="text-2xs text-slate-400 mt-1">Excellent work, you are fully up to date.</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Performance Chart */}
              <Card className="p-5 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="mb-4">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 font-semibold">Subject Performance Grid</h3>
                  <p className="text-xs text-slate-500">Distribution of average scores across current studies.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_200px] md:items-center md:gap-6">
                  <div className="h-56 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          stroke="#ffffff"
                          strokeWidth={2}
                          fill="#8884d8"
                          dataKey="value"
                          label={renderSliceLabel}
                          labelLine={false}
                        >
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, "Average Score"]}
                          contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e2e8f0" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
                    {performanceData.map((subject) => (
                      <button 
                        key={subject.name} 
                        onClick={() => {
                          const matchingSub = subjects.find(sub => sub.id === subject.id);
                          if (matchingSub && onSelectSubject) onSelectSubject(matchingSub);
                        }}
                        className="flex min-w-0 items-center gap-2 text-left hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="min-w-0 flex-1 truncate text-xs text-slate-500 font-semibold">{subject.name}</span>
                        <span className="font-extrabold text-xs text-slate-800">{subject.value}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Achievements & Top Subjects */}
            <div className="space-y-6">
              
              {/* Badges showcase */}
              <Card className="p-5 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <h3 className="text-base font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  Equipped Title Badge
                </h3>
                <p className="text-xs text-slate-500 mb-4">Calculated from your current ranking percentile.</p>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${activeBadge.color} text-white relative overflow-hidden flex flex-col justify-between aspect-video shadow-xs`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transform translate-x-2 -translate-y-2">
                    <Trophy className="w-24 h-24" />
                  </div>
                  <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 text-3xs font-extrabold w-fit">
                    Rank {classRank} Tier
                  </Badge>
                  <div>
                    <h4 className="text-lg font-black tracking-wide">{activeBadge.name}</h4>
                    <p className="text-[10px] text-white/80 font-bold mt-0.5">{activeBadge.desc}</p>
                  </div>
                </div>
              </Card>

              {/* Top Performing Subjects Quest Log style */}
              <Card className="p-5 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1">Elite Masteries</h3>
                <p className="text-xs text-slate-500 mb-4">Your top subject scores currently unlocked.</p>
                <div className="space-y-4">
                  {performanceData
                    .slice()
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 4)
                    .map((subject, index) => {
                      const medalColors = [
                        "bg-gradient-to-tr from-amber-400 to-yellow-500 text-yellow-950 border-amber-300",
                        "bg-gradient-to-tr from-slate-350 to-slate-450 text-slate-900 border-slate-200",
                        "bg-gradient-to-tr from-amber-600 to-amber-700 text-amber-50 border-amber-500",
                        "bg-slate-100 text-slate-500 border-slate-200"
                      ];

                      return (
                        <div key={subject.name} className="flex items-center gap-3">
                          <div className={`text-2xs font-extrabold h-6 w-6 rounded-full border flex items-center justify-center ${medalColors[index] || "bg-slate-100"}`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-xs font-bold text-slate-700 truncate">{subject.name}</p>
                              <p className="text-xs font-black text-slate-800">{subject.value}%</p>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-indigo-600"
                                style={{
                                  width: `${subject.value}%`,
                                  backgroundColor: subject.color,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
