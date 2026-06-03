import { useState, useEffect, useRef, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { BookOpen, Clock, TrendingUp, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import subjects from "../data/subjects";
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
        className="relative w-full p-5 md:p-7 bg-gradient-to-br from-white to-indigo-50/50 border-indigo-100 shadow-sm overflow-hidden"
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
      >
        {notes.length > 1 && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 shadow-sm border border-slate-100 text-slate-600 hover:bg-white"
              aria-label="Previous teacher comment"
              onClick={() => goTo(activeIndex - 1, true)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 shadow-sm border border-slate-100 text-slate-600 hover:bg-white"
              aria-label="Next teacher comment"
              onClick={() => goTo(activeIndex + 1, true)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        <div
          key={activeIndex}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start px-8 sm:px-10 animate-fade-in"
        >
          <img
            src={
              guidance.avatar ??
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces"
            }
            alt={guidance.teacherName}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-indigo-100 shrink-0 mx-auto sm:mx-0"
          />
          <div className="min-w-0 flex-1 text-center sm:text-left w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <Badge className={`${subjectColor} text-white border-0 text-xs font-semibold`}>
                {guidance.subjectName}
              </Badge>
              <span className="text-xs text-slate-500">
                {activeIndex + 1} of {notes.length}
              </span>
            </div>
            <p className="text-sm md:text-base font-semibold text-slate-800">{guidance.teacherName}</p>
            <p className="text-base md:text-lg text-indigo-900/90 mt-3 italic leading-relaxed">
              &ldquo;{guidance.note}&rdquo;
            </p>
          </div>
        </div>
      </Card>

      <div
        className="flex justify-center items-center gap-2 mt-4"
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
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "h-2.5 w-8 bg-indigo-600"
                : "h-2.5 w-2.5 bg-indigo-300 hover:bg-indigo-400"
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
}

export function Dashboard({
  assignments,
  classRank = 3,
  studentName = "Student",
  teacherNotes = [],
}: DashboardProps) {
  const colorMap: Record<string, string> = {
    math: "#3b82f6",
    science: "#22c55e",
    history: "#f59e0b",
    geography: "#14b8a6",
    civics: "#ec4899",
    art: "#ec4899",
    computer: "#a855f7",
    music: "#6366f1",
    health: "#ef4444",
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
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" style={{ fontWeight: 700, fontSize: 12 }}>
        {`${value}%`}
      </text>
    );
  };

  const classAverage = 83; // Mock class average
  const studentRank = overallAverage >= classAverage ? "Above Average" : "Below Average";
  const classPosition = overallAverage >= 90 ? "Top 10%" : overallAverage >= 80 ? "Top 25%" : "Top 50%";

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50 pb-16 md:pb-0">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back, {studentName}!</h2>
            <p className="text-gray-600">Here&apos;s your academic progress overview</p>
          </div>

          {teacherNotes.length > 0 && (
            <div className="mb-6 animate-fade-in w-full">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider">
                  Guidance from your subject teachers
                </h3>
              </div>
              <TeacherGuidanceCarousel notes={teacherNotes} />
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <Card className="p-3 md:p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <div className="w-fit p-2 md:p-3 bg-blue-100 rounded-full shrink-0">
                  <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500">Overall Average</p>
                  <p className="text-xl md:text-2xl font-bold">{overallAverage}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 md:p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <div className="w-fit p-2 md:p-3 bg-amber-100 rounded-full shrink-0">
                  <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500">Class Rank</p>
                  <p className="text-xl md:text-2xl font-bold text-amber-600">#{classRank}</p>
                  <p className="text-xs text-gray-500 mt-1">{classPosition} · {studentRank}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 md:p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <div className="w-fit p-2 md:p-3 bg-green-100 rounded-full shrink-0">
                  <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500">Active Assignments</p>
                  <p className="text-xl md:text-2xl font-bold">
                    {assignments.filter((a) => a.status !== "graded").length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3 md:p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <div className="w-fit p-2 md:p-3 bg-purple-100 rounded-full shrink-0">
                  <Clock className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500">Due This Week</p>
                  <p className="text-xl md:text-2xl font-bold">
                    {assignments.filter((a) => {
                      const today = new Date();
                      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                      return a.dueDate <= weekFromNow && a.status !== "graded";
                    }).length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {/* Performance Chart */}
            <Card className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4">Subject Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] md:items-center md:gap-6">
                <div className="h-56 md:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={80}
                        paddingAngle={2}
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
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
                  {performanceData.map((subject) => (
                    <div key={subject.name} className="flex min-w-0 items-center gap-2 text-sm">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-gray-600">{subject.name}</span>
                      <span className="font-semibold text-gray-900">{subject.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Top Subjects */}
            <Card className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4">Top Performing Subjects</h3>
              <div className="space-y-4">
                {performanceData
                  .slice()
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((subject, index) => (
                    <div key={subject.name} className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-300">#{index + 1}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm font-semibold">{subject.value}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${subject.value}%`,
                              backgroundColor: subject.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
