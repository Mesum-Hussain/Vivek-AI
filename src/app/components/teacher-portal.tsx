import React, { useState } from "react";
import {
  Users,
  PlusCircle,
  Award,
  Sparkles,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Clock,
  ArrowRight,
  MessageSquare,
  Edit,
  Trash2,
  Star,
  Filter,
  Search,
  RotateCcw,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  X,
  Menu,
  Loader2,
  Wand2
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from "recharts";
import subjects, { Subject } from "../data/subjects";
import { Assignment } from "./dashboard";
import { Message } from "./chat-interface";
import { TeacherProfile } from "./teacher-profile";
import confetti from "canvas-confetti";

type TeacherTab = "dashboard" | "students" | "assignments" | "reviews" | "profile";

function getTeacherHeaderTitle(tab: TeacherTab): string {
  switch (tab) {
    case "dashboard":
      return "Dashboard";
    case "students":
      return "Students";
    case "assignments":
      return "Assignments";
    case "reviews":
      return "Reviews";
    case "profile":
      return "Profile";
    default:
      return "Portal";
  }
}

export interface TeacherGuidanceNote {
  subjectId: string;
  subjectName: string;
  teacherName: string;
  note: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  classRank: number;
  averageScore: number;
  completedCount: number;
  pendingCount: number;
  subjectAverages: Record<string, number>;
  teacherNotes?: TeacherGuidanceNote[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  title: string;
  submittedAt: Date;
  status: "completed" | "graded";
  percentage: number;
  grade: string;
  rank: number;
  chatHistory: Message[];
  aiFeedback: string;
  teacherFeedback?: string;
  originalFeedback?: string;
}

function buildAISuggestedAssignment(
  topic: string,
  subjectId: string
): { title: string; description: string; rubric: string } {
  const subject = subjects.find((s) => s.id === subjectId);
  const subjectName = subject?.name ?? "this subject";
  const trimmed = topic.trim();
  const title = `Critical Discussion: ${trimmed}`;
  const description = `Engage in a structured debate and discussion on "${trimmed}" within ${subjectName}. Present evidence-based arguments, consider opposing viewpoints, and demonstrate critical thinking through reasoned analysis. Be prepared to defend your position and respond thoughtfully to counterarguments raised by the AI Study Buddy.`;
  const rubric = `Evaluate critical thinking on "${trimmed}": clarity of thesis (25%), subject-relevant evidence (25%), engagement with counterarguments (25%), and communication quality including vocabulary and reasoning depth (25%).`;
  return { title, description, rubric };
}

interface TeacherPortalProps {
  assignments: Assignment[];
  submissions: Submission[];
  students: Student[];
  onAddAssignment: (assignment: Omit<Assignment, "id" | "status"> & { aiRubric?: string }) => void;
  onDeleteAssignment: (id: string) => void;
  onGradeSubmission: (submissionId: string, percentage: number, grade: string, feedback: string) => void;
  onSaveTeacherNote: (studentId: string, note: string, subjectId: string) => void;
  teacherSubjectId?: string;
  teacherName?: string;
  teacherEmail?: string;
  onLogout?: () => void;
}

export function TeacherPortal({
  assignments: rawAssignments,
  submissions: rawSubmissions,
  students,
  onAddAssignment,
  onDeleteAssignment,
  onGradeSubmission,
  onSaveTeacherNote,
  teacherSubjectId,
  teacherName = "Teacher",
  teacherEmail = "teacher@school.edu",
  onLogout
}: TeacherPortalProps) {
  // Shadow arrays based on single-subject teacher authorization
  const assignments = teacherSubjectId
    ? rawAssignments.filter(a => a.subjectId === teacherSubjectId)
    : rawAssignments;

  const submissions = teacherSubjectId
    ? rawSubmissions.filter(s => s.subjectId === teacherSubjectId)
    : rawSubmissions;
  const [currentTab, setCurrentTab] = useState<TeacherTab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  
  // Custom states for forms
  const [newAssignmentOpen, setNewAssignmentOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSubjectId, setNewSubjectId] = useState("math");
  const [newDuration, setNewDuration] = useState("15");
  const [newDueDate, setNewDueDate] = useState("2026-06-15");
  const [newRubric, setNewRubric] = useState("");
  const [debateTopic, setDebateTopic] = useState("");
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [aiSuggestionError, setAiSuggestionError] = useState<string | null>(null);

  // Grade Override form states
  const [overrideScore, setOverrideScore] = useState<number>(0);
  const [overrideGrade, setOverrideGrade] = useState<string>("A");
  const [teacherFeedback, setTeacherFeedback] = useState<string>("");

  const getSubjectColor = (subId: string) => {
    const subject = subjects.find(s => s.id === subId);
    return subject ? subject.color : "bg-gray-500";
  };

  const getSubjectName = (subId: string) => {
    const subject = subjects.find(s => s.id === subId);
    return subject ? subject.name : "General";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      case "in-progress":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "completed":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "graded":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  // Recharts color maps
  const colorMap: Record<string, string> = {
    math: "#3b82f6",
    science: "#22c55e",
    history: "#f59e0b",
    geography: "#14b8a6",
    civics: "#ec4899",
    computer: "#a855f7",
  };

  React.useEffect(() => {
    if (teacherSubjectId) {
      setNewSubjectId(teacherSubjectId);
    }
  }, [teacherSubjectId]);

  // Calculate stats based on authorization scope
  const totalStudents = students.length;
  
  const classAvg = teacherSubjectId
    ? (() => {
        const scores = students.map(s => s.subjectAverages[teacherSubjectId] || 0).filter(score => score > 0);
        return scores.length ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 80;
      })()
    : Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents);

  const pendingReviews = submissions.filter(s => s.status === "completed").length;
  const activeAssignments = assignments.filter(a => a.status !== "graded").length;

  // Chart data: Single Subject Student Performance vs. Multi-Subject Averages
  const chartData = teacherSubjectId
    ? students.map(std => ({
        name: std.name.split(" ")[0], // first name for neat chart X-axis labels
        average: std.subjectAverages[teacherSubjectId] || 0,
        color: colorMap[teacherSubjectId] || "#8884d8"
      }))
    : subjects.map(sub => {
        const subjectGrades = submissions.filter(s => s.subjectId === sub.id && s.status === "graded");
        const avg = subjectGrades.length 
          ? Math.round(subjectGrades.reduce((sum, s) => sum + s.percentage, 0) / subjectGrades.length)
          : Math.round(students.reduce((sum, std) => sum + (std.subjectAverages[sub.id] || 80), 0) / students.length);
        return {
          name: sub.name,
          average: avg,
          color: colorMap[sub.id] || "#8884d8"
        };
      });

  // Handle creating assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    onAddAssignment({
      title: newTitle,
      description: newDesc,
      subjectId: newSubjectId,
      duration: parseInt(newDuration, 10) || 15,
      dueDate: new Date(newDueDate),
      aiRubric: newRubric
    });

    // Reset fields
    setNewTitle("");
    setNewDesc("");
    setNewSubjectId("math");
    setNewDuration("15");
    setNewDueDate("2026-06-15");
    setNewRubric("");
    setDebateTopic("");
    setAiSuggestionError(null);
    setNewAssignmentOpen(false);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const navigateToTab = (
    tab: TeacherTab,
    options?: { clearStudent?: boolean; clearSubmission?: boolean }
  ) => {
    setCurrentTab(tab);
    if (options?.clearStudent !== false) setSelectedStudentId(null);
    if (options?.clearSubmission !== false) setSelectedSubmissionId(null);
    setIsSidebarOpen(false);
  };

  const handleGenerateAISuggestions = async () => {
    if (!debateTopic.trim()) {
      setAiSuggestionError("Enter a debate or discussion topic to generate suggestions.");
      return;
    }
    setAiSuggestionError(null);
    setIsGeneratingSuggestions(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const suggested = buildAISuggestedAssignment(debateTopic, newSubjectId);
    setNewTitle(suggested.title);
    setNewDesc(suggested.description);
    setNewRubric(suggested.rubric);
    setIsGeneratingSuggestions(false);
  };

  // Select a submission to review
  const handleOpenReview = (sub: Submission) => {
    setSelectedSubmissionId(sub.id);
    setOverrideScore(sub.percentage);
    setOverrideGrade(sub.grade);
    setTeacherFeedback(sub.teacherFeedback || "");
  };

  // Handle grade publication
  const handlePublishGrade = () => {
    if (!selectedSubmissionId) return;
    
    onGradeSubmission(
      selectedSubmissionId,
      overrideScore,
      overrideGrade,
      teacherFeedback
    );

    setSelectedSubmissionId(null);

    // Blast confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId);

  // Filters
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = assignments.filter(a => {
    if (subjectFilter !== "all" && a.subjectId !== subjectFilter) return false;
    return a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           a.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderSidebar = (onClose?: () => void) => (
    <aside className="w-64 bg-white text-slate-900 flex flex-col shrink-0 border-r border-slate-200 h-full">
      <div className="p-6 border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Vivek AI</h1>
          <p className="text-sm text-gray-500 mt-1">Teacher Portal</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Button
          variant={currentTab === "dashboard" ? "default" : "ghost"}
          className="w-full justify-start gap-3"
          onClick={() => navigateToTab("dashboard")}
        >
          <Layers className="w-5 h-5" />
          Dashboard
        </Button>

        <Button
          variant={currentTab === "students" ? "default" : "ghost"}
          className="w-full justify-start gap-3 mt-1"
          onClick={() => navigateToTab("students")}
        >
          <Users className="w-5 h-5" />
          Stats
        </Button>

        <Button
          variant={currentTab === "assignments" ? "default" : "ghost"}
          className="w-full justify-start gap-3 mt-1"
          onClick={() => navigateToTab("assignments")}
        >
          <BookOpen className="w-5 h-5" />
          Assign
        </Button>

        <Button
          variant={currentTab === "reviews" ? "default" : "ghost"}
          className="w-full justify-start gap-3 mt-1"
          onClick={() => navigateToTab("reviews")}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            {pendingReviews > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
            )}
          </div>
          Reviews
          {pendingReviews > 0 && (
            <Badge className="ml-auto bg-rose-500 text-white border-0 text-2xs px-1.5 py-0.5">{pendingReviews}</Badge>
          )}
        </Button>
      </nav>

      <div className="p-4 border-t border-slate-200 shrink-0">
        <button
          type="button"
          onClick={() => navigateToTab("profile")}
          className={`flex items-center gap-3 px-2 py-2 w-full rounded-lg transition-colors text-left cursor-pointer ${
            currentTab === "profile" ? "bg-indigo-50 ring-1 ring-indigo-100" : "hover:bg-slate-100"
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces"
            alt="Teacher Profile"
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{teacherName}</p>
            <p className="text-xs text-gray-500 truncate">Profile</p>
          </div>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <div className="hidden md:block shrink-0">{renderSidebar()}</div>

      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden">
            {renderSidebar(() => setIsSidebarOpen(false))}
          </div>
        </>
      )}

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar — desktop only (mobile uses FAB + content padding like student portal) */}
        <header className="hidden md:flex bg-white border-b h-14 shrink-0 items-center px-6 z-10 shadow-2xs">
          <h2 className="text-base font-bold text-slate-800 truncate">
            {getTeacherHeaderTitle(currentTab)}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 pt-14 md:pt-6">
          {currentTab === "profile" && (
            <TeacherProfile
              teacherName={teacherName}
              teacherEmail={teacherEmail}
              teacherSubjectId={teacherSubjectId}
              onLogout={onLogout}
            />
          )}

          {/* TAB 1: DASHBOARD */}
          {currentTab === "dashboard" && !selectedStudentId && !selectedSubmissionId && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              {/* Header card with gradient */}
              <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-8 select-none">
                  <GraduationCap className="w-80 h-80" />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <span className="bg-indigo-500/40 text-indigo-200 font-semibold px-2.5 py-1 rounded-full text-xs uppercase tracking-wider">
                    Overview
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">Welcome, {teacherName}!</h2>
                  <p className="text-slate-200 text-sm md:text-base mt-2 leading-relaxed opacity-90">
                    Track class-wide learning analytics, manage dynamic assignments, and audit AI-facilitated academic evaluations in real-time.
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Total Students</p>
                    <p className="text-2xl font-bold text-slate-800">{totalStudents}</p>
                  </div>
                </Card>

                <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Class Average</p>
                    <p className="text-2xl font-bold text-green-600">{classAvg}%</p>
                  </div>
                </Card>

                <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow relative">
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <Sparkles className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">{pendingReviews}</p>
                  </div>
                  {pendingReviews > 0 && (
                    <span className="absolute top-3 right-3 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}
                </Card>

                <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Active Tasks</p>
                    <p className="text-2xl font-bold text-slate-800">{activeAssignments}</p>
                  </div>
                </Card>
              </div>

              {/* Grid Section: Chart & Submissions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subject Performance Graph */}
                <Card className="p-6 lg:col-span-2 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      {teacherSubjectId ? `Student Grades: ${getSubjectName(teacherSubjectId)}` : "Class Subject Averages"}
                    </h3>
                    <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-0">Term Analytics</Badge>
                  </div>
                  <div className="h-64 flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(value) => [`${value}%`, teacherSubjectId ? "Grade" : "Class Avg"]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                        <Bar dataKey="average" radius={[6, 6, 0, 0]} maxBarSize={45}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Top Performing Leaderboard */}
                <Card className="p-6 flex flex-col">
                  <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    Top Performing Students
                  </h3>
                  <div className="space-y-4 flex-1 overflow-y-auto max-h-64">
                    {students
                      .slice()
                      .sort((a, b) => b.averageScore - a.averageScore)
                      .map((student, idx) => (
                        <div key={student.id} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? "bg-amber-100 text-amber-700" : idx === 1 ? "bg-slate-100 text-slate-600" : "bg-orange-50 text-orange-700"}`}>
                              #{idx + 1}
                            </div>
                            <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{student.name}</p>
                              <p className="text-3xs text-slate-500">Rank #{student.classRank}</p>
                            </div>
                          </div>
                          <Badge className="bg-indigo-50 text-indigo-700 border-0 font-bold">{student.averageScore}%</Badge>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>

              {/* Submissions Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <span className="hidden sm:inline">Recent Submissions Awaiting Audit</span>
                    <span className="sm:hidden">Pending Reviews</span>
                  </h3>
                  <Button variant="outline" size="sm" className="text-xs h-8 text-indigo-600 hover:text-indigo-700 border-indigo-200" onClick={() => setCurrentTab("reviews")}>
                    View All Reviews
                  </Button>
                </div>

                {submissions.filter(s => s.status === "completed").length === 0 ? (
                  <div className="text-center py-8 bg-slate-50/50 border border-dashed rounded-xl">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-slate-800 font-semibold text-sm">All Submissions Graded</p>
                    <p className="text-xs text-slate-500 mt-1">There are no pending submissions requiring review.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b text-slate-500 font-semibold text-xs uppercase">
                          <th className="pb-3 pl-2">Student</th>
                          <th className="pb-3">Assignment</th>
                          <th className="pb-3">Subject</th>
                          <th className="pb-3">Completed Date</th>
                          <th className="pb-3">Suggested Grade</th>
                          <th className="pb-3 text-right pr-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions
                          .filter(s => s.status === "completed")
                          .slice(0, 5)
                          .map((sub) => (
                            <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50/50 last:border-0">
                              <td className="py-3 pl-2 flex items-center gap-3">
                                <span className="font-semibold text-sm text-slate-800">{sub.studentName}</span>
                              </td>
                              <td className="py-3 font-semibold text-sm text-slate-800">{sub.title}</td>
                              <td className="py-3">
                                <span className="flex items-center gap-1.5">
                                  <span className={`w-2.5 h-2.5 rounded-full ${getSubjectColor(sub.subjectId)}`} />
                                  <span className="text-xs text-slate-600">{getSubjectName(sub.subjectId)}</span>
                                </span>
                              </td>
                              <td className="py-3 text-xs text-slate-500">{sub.submittedAt.toLocaleDateString()}</td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 font-bold border-0">{sub.percentage}%</Badge>
                                  <span className="text-xs font-semibold text-indigo-600">Grade: {sub.grade}</span>
                                </div>
                              </td>
                              <td className="py-3 text-right pr-2">
                                <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs h-8 px-3" onClick={() => handleOpenReview(sub)}>
                                  <span className="hidden sm:inline">Audit Grade</span>
                                  <span className="sm:hidden">Audit</span>
                                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB 2: STUDENT STATS */}
          {currentTab === "students" && !selectedStudentId && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-800">Student Stats</h3>
                  <p className="text-xs text-slate-500">View individual student portfolios, subject grades, and logs.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by student name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 border-slate-200 text-xs shadow-2xs rounded-lg"
                  />
                </div>
              </div>

              {/* Roster Cards/Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b text-slate-500 font-semibold text-xs uppercase">
                        <th className="py-3.5 px-6">Student Info</th>
                        <th className="py-3.5 px-6">{teacherSubjectId ? `${getSubjectName(teacherSubjectId)} Average` : "Overall Average"}</th>
                        <th className="py-3.5 px-6">Class Rank</th>
                        <th className="py-3.5 px-6">Completed Assignments</th>
                        <th className="py-3.5 px-6">Pending Tasks</th>
                        <th className="py-3.5 px-6 text-right pr-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((std) => (
                        <tr key={std.id} className="hover:bg-slate-50/40">
                          <td className="py-4 px-6 flex items-center gap-4">
                            <img src={std.avatar} alt={std.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50" />
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{std.name}</p>
                              <p className="text-xs text-slate-400">{std.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">{teacherSubjectId ? (std.subjectAverages[teacherSubjectId] || 0) : std.averageScore}%</span>
                              <div className="w-20 bg-slate-200 rounded-full h-1.5 hidden md:block">
                                <div 
                                  className="h-1.5 rounded-full bg-indigo-600" 
                                  style={{ width: `${teacherSubjectId ? (std.subjectAverages[teacherSubjectId] || 0) : std.averageScore}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 font-bold border-0">
                              Rank #{std.classRank}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-600">{std.completedCount}</td>
                          <td className="py-4 px-6">
                            <Badge className={std.pendingCount > 0 ? "bg-rose-50 text-rose-700 font-bold border-0" : "bg-slate-100 text-slate-500 font-bold"}>
                              {std.pendingCount} pending
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-right pr-6">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs text-indigo-600 hover:text-indigo-700 border-indigo-100 hover:bg-indigo-50"
                              onClick={() => setSelectedStudentId(std.id)}
                            >
                              View Portfolio
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2 DETAIL: STUDENT DETAIL VIEW */}
          {currentTab === "students" && selectedStudentId && selectedStudent && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
              {/* Back Link */}
              <button 
                onClick={() => setSelectedStudentId(null)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Student Stats</span>
                <span className="sm:hidden">Back</span>
              </button>

              {/* Student Hero Card */}
              <Card className="p-6 bg-white shadow-2xs">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <img 
                    src={selectedStudent.avatar} 
                    alt={selectedStudent.name} 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-indigo-50 ring-4 ring-indigo-600/10 shrink-0" 
                  />
                  <div className="flex-1 text-center md:text-left min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-1">
                      <h3 className="text-xl font-bold text-slate-800 truncate">{selectedStudent.name}</h3>
                      <Badge className="bg-indigo-50 text-indigo-700 border-0 font-bold w-fit mx-auto md:mx-0">
                        Class Rank: #{selectedStudent.classRank}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{selectedStudent.email}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-600">
                      <span>Overall Score: <strong className="text-indigo-600 font-bold">{selectedStudent.averageScore}%</strong></span>
                      <span>•</span>
                      <span>Graded Submissions: <strong className="text-slate-800 font-semibold">{selectedStudent.completedCount}</strong></span>
                      <span>•</span>
                      <span>Active Tasks: <strong className="text-slate-800 font-semibold">{selectedStudent.pendingCount}</strong></span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Subject Performances */}
                <Card className="p-6 lg:col-span-2">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Subject-wise Average Score</h4>
                  <div className="space-y-4">
                    {subjects.map((sub) => {
                      const score = selectedStudent.subjectAverages[sub.id] || 0;
                      const isGraded = score > 0;
                      return (
                        <div key={sub.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-700 flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${sub.color}`} />
                              {sub.name}
                            </span>
                            <span className={isGraded ? "text-slate-800 font-bold" : "text-slate-400 italic"}>
                              {isGraded ? `${score}%` : "No submissions"}
                            </span>
                          </div>
                          {isGraded ? (
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ width: `${score}%`, backgroundColor: colorMap[sub.id] }}
                              />
                            </div>
                          ) : (
                            <div className="w-full bg-slate-100 border border-dashed rounded-full h-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Right Panel: Teacher Guidance Note */}
                <Card className="p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-4.5 h-4.5 text-indigo-600" />
                      Guidance Note
                    </h4>
                    <p className="text-3xs text-slate-500 mb-4">
                      Write guidance for{" "}
                      <span className="font-semibold text-slate-700">
                        {teacherSubjectId
                          ? getSubjectName(teacherSubjectId)
                          : "this subject"}
                      </span>
                      . It appears on the student dashboard under that subject teacher.
                    </p>
                    <Textarea
                      placeholder="e.g. You're showing fantastic critical thinking! Let's review quadratic properties this week..."
                      defaultValue={
                        selectedStudent.teacherNotes?.find(
                          (n) => n.subjectId === (teacherSubjectId ?? "math")
                        )?.note ?? ""
                      }
                      id="teacher-note-textarea"
                      className="text-xs h-28 border-slate-200 rounded-lg"
                      key={`${selectedStudent.id}-${teacherSubjectId ?? "math"}`}
                    />
                  </div>
                  <Button 
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold h-9"
                    onClick={() => {
                      const txtarea = document.getElementById("teacher-note-textarea") as HTMLTextAreaElement;
                      const subjectForNote = teacherSubjectId ?? "math";
                      onSaveTeacherNote(selectedStudent.id, txtarea.value, subjectForNote);
                      confetti({
                        particleCount: 40,
                        spread: 40
                      });
                    }}
                  >
                    Save Note
                  </Button>
                </Card>
              </div>

              {/* Submissions by this student */}
              <Card className="p-6">
                <h4 className="text-sm font-bold text-slate-800 mb-4">Assignment & Academic History</h4>
                {submissions.filter(s => s.studentId === selectedStudent.id).length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No completed submissions found for this student.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions
                      .filter(s => s.studentId === selectedStudent.id)
                      .map((sub) => (
                        <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/30 hover:shadow-2xs transition-shadow">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Badge className={`${getSubjectColor(sub.subjectId)} text-white hover:${getSubjectColor(sub.subjectId)} border-0 text-3xs font-semibold px-2 py-0.5`}>
                                {getSubjectName(sub.subjectId)}
                              </Badge>
                              <span className="text-3xs text-slate-400">{sub.submittedAt.toLocaleDateString()}</span>
                            </div>
                            <h5 className="font-semibold text-slate-800 text-sm truncate">{sub.title}</h5>
                            <p className="text-3xs text-slate-500 mt-1 line-clamp-1 italic">
                              AI Feedback: {sub.aiFeedback}
                            </p>
                            {sub.teacherFeedback && (
                              <p className="text-3xs text-indigo-600 mt-1 font-medium">
                                Teacher Feedback: "{sub.teacherFeedback}"
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <p className="text-lg font-extrabold text-indigo-600 leading-none">{sub.percentage}%</p>
                              <span className="text-3xs text-slate-500 font-bold">Grade: {sub.grade}</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-8 text-slate-600 border-slate-200"
                              onClick={() => {
                                handleOpenReview(sub);
                                setCurrentTab("reviews");
                              }}
                            >
                              Audit
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB 3: ASSIGNMENTS MANAGER */}
          {currentTab === "assignments" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-800">Assignments</h3>
                  <p className="text-xs text-slate-500 hidden sm:block">Configure tasks, duration, due dates, and AI rubrics.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Create Assignment Dialog Trigger */}
                  <Dialog open={newAssignmentOpen} onOpenChange={setNewAssignmentOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-xs h-9 px-4 shrink-0 rounded-lg shadow-sm">
                        <PlusCircle className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Create Assignment</span>
                        <span className="sm:hidden">New</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[min(85vh,36rem)] flex flex-col gap-0 p-0 overflow-hidden sm:max-w-md">
                      <form onSubmit={handleCreateAssignment} className="flex flex-col min-h-0 flex-1">
                      <DialogHeader className="shrink-0 px-5 pt-5 pb-2">
                        <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <PlusCircle className="w-5 h-5 text-indigo-600" />
                          Create New Assignment
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                          Students discuss the topic in real-time with an AI Study Buddy.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 min-h-0 overflow-y-auto px-5 space-y-3">
                        <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-2.5 space-y-2">
                          <Label htmlFor="debateTopic" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                            <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                            AI-Suggested Assignment
                          </Label>
                          <p className="text-3xs text-slate-500 leading-snug">
                            Debate or discussion topic — AI fills title, prompt, and rubric.
                          </p>
                          <Input
                            id="debateTopic"
                            value={debateTopic}
                            onChange={(e) => {
                              setDebateTopic(e.target.value);
                              setAiSuggestionError(null);
                            }}
                            placeholder="e.g. Should renewable energy fully replace fossil fuels by 2040?"
                            className="text-xs h-9 border-slate-200 rounded-lg bg-white"
                          />
                          {aiSuggestionError && (
                            <p className="text-3xs text-rose-600 font-medium">{aiSuggestionError}</p>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isGeneratingSuggestions}
                            onClick={handleGenerateAISuggestions}
                            className="w-full text-xs h-9 border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-semibold"
                          >
                            {isGeneratingSuggestions ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                <span className="hidden sm:inline">Generating...</span>
                                <span className="sm:hidden">...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Generate AI Suggestions</span>
                                <span className="sm:hidden">AI Suggest</span>
                              </>
                            )}
                          </Button>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Assignment Title</Label>
                          <Input
                            id="title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="e.g. Discuss Quadratic Equations"
                            className="text-xs h-9 border-slate-200 rounded-lg"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="subject" className="text-xs font-semibold text-slate-700">Subject</Label>
                            <Select value={newSubjectId} onValueChange={setNewSubjectId} disabled={!!teacherSubjectId}>
                              <SelectTrigger id="subject" className="text-xs h-9 bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Select Subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {subjects.map((sub) => (
                                  <SelectItem key={sub.id} value={sub.id}>
                                    {sub.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="duration" className="text-xs font-semibold text-slate-700">Duration (Minutes)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={newDuration}
                              onChange={(e) => setNewDuration(e.target.value)}
                              placeholder="15"
                              min="5"
                              max="60"
                              className="text-xs h-9 border-slate-200 rounded-lg"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="dueDate" className="text-xs font-semibold text-slate-700">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            className="text-xs h-9 border-slate-200 rounded-lg"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Task Description (Student Prompt)</Label>
                          <Textarea
                            id="description"
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            placeholder="Explain the real-world applications of quadratic equations and solve sample problems..."
                            className="text-xs min-h-[3.5rem] max-h-20 resize-y border-slate-200 rounded-lg"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="rubric" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            AI Evaluator Rubric (Optional)
                          </Label>
                          <Textarea
                            id="rubric"
                            value={newRubric}
                            onChange={(e) => setNewRubric(e.target.value)}
                            placeholder="Evaluate student's understanding of the discriminant (b^2-4ac), parabolas, and projectile math paths..."
                            className="text-xs min-h-[3.5rem] max-h-20 resize-y border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                        <DialogFooter className="shrink-0 flex flex-row items-center justify-end gap-2 border-t px-5 py-3 bg-white">
                          <DialogClose asChild>
                            <Button type="button" variant="outline" className="text-xs h-9 border-slate-200 rounded-lg">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 rounded-lg">
                            <span className="hidden sm:inline">Publish Assignment</span>
                            <span className="sm:hidden">Publish</span>
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Subject filter */}
                  {!teacherSubjectId && (
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                      <SelectTrigger className="text-xs h-9 border-slate-200 bg-white w-32 shrink-0">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Assignments Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map((assignment) => {
                  const subject = subjects.find(s => s.id === assignment.subjectId);
                  const isPending = assignment.status !== "graded";
                  const submissionsCount = submissions.filter(s => s.assignmentId === assignment.id).length;
                  return (
                    <Card key={assignment.id} className="p-5 bg-white shadow-2xs hover:shadow-md transition-shadow relative flex flex-col justify-between group">
                      <div>
                        {/* Subject Badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <Badge className={`${subject?.color || "bg-indigo-500"} text-white border-0 text-3xs font-semibold px-2 py-0.5`}>
                            {getSubjectName(assignment.subjectId)}
                          </Badge>
                          <span className="text-3xs font-medium text-slate-400">Due: {assignment.dueDate.toLocaleDateString()}</span>
                        </div>

                        <h4 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{assignment.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">{assignment.description}</p>
                      </div>

                      <div className="border-t pt-3 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 text-3xs font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {assignment.duration} min
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {submissionsCount} Graded
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 shrink-0"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this assignment?")) {
                              onDeleteAssignment(assignment.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredAssignments.length === 0 && (
                <div className="text-center py-16 bg-white border rounded-2xl shadow-3xs max-w-lg mx-auto">
                  <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-base">No Assignments Found</h4>
                  <p className="text-xs text-slate-500 mt-1.5 px-6 leading-relaxed">
                    There are no assignments matching your search criteria. Create one using the "Create Assignment" button above!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AI REVIEW CENTER & EVALUATIONS */}
          {currentTab === "reviews" && !selectedSubmissionId && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-800">Reviews</h3>
                  <p className="text-xs text-slate-500 hidden sm:block">Audit chats, BERT scores, and publish grades.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge className="bg-amber-100 text-amber-700 font-bold border-0 text-xs px-2.5 py-1">
                    {pendingReviews} <span className="hidden sm:inline">Awaiting</span>
                  </Badge>
                </div>
              </div>

              {/* Submissions List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submissions.map((sub) => {
                  const subject = subjects.find(s => s.id === sub.subjectId);
                  const isAwaitingAudit = sub.status === "completed";
                  return (
                    <Card key={sub.id} className={`p-5 bg-white border shadow-2xs hover:shadow-md transition-shadow relative flex flex-col justify-between ${isAwaitingAudit ? "border-amber-200 ring-2 ring-amber-500/5 bg-amber-50/5" : "border-slate-100"}`}>
                      {isAwaitingAudit && (
                        <span className="absolute -top-2.5 left-5 bg-amber-500 text-white font-extrabold text-3xs px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                          <Badge className={`${subject?.color || "bg-indigo-500"} text-white border-0 text-3xs font-semibold px-2.5 py-0.5`}>
                            {getSubjectName(sub.subjectId)}
                          </Badge>
                          <span className="text-3xs font-medium text-slate-400">{sub.submittedAt.toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-extrabold text-slate-800 text-sm truncate">{sub.studentName}</h4>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-xs text-slate-600 font-medium truncate">{sub.title}</span>
                        </div>

                        <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 mt-2">
                          "AI Assessment: {sub.aiFeedback}"
                        </p>
                        
                        {sub.teacherFeedback && (
                          <div className="mt-3 bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5">
                            <p className="text-3xs font-bold text-indigo-700">Teacher Note:</p>
                            <p className="text-3xs text-indigo-600 italic mt-0.5">"{sub.teacherFeedback}"</p>
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-4 mt-5 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-indigo-600 leading-none">{sub.percentage}%</span>
                          <span className="text-3xs font-bold text-slate-400 uppercase">Suggested: {sub.grade}</span>
                        </div>

                        <Button
                          size="sm"
                          className={isAwaitingAudit ? "bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 font-semibold px-3" : "bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 font-semibold px-3"}
                          onClick={() => handleOpenReview(sub)}
                        >
                          {isAwaitingAudit ? (
                            <>
                              <span className="hidden sm:inline">Audit & Grade</span>
                              <span className="sm:hidden">Audit</span>
                            </>
                          ) : (
                            <>
                              <span className="hidden sm:inline">Review</span>
                              <span className="sm:hidden">Open</span>
                            </>
                          )}
                          <ArrowRight className="w-3.5 h-3.5 ml-0.5 sm:ml-1" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {submissions.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No submissions recorded yet in the portal.
                </div>
              )}
            </div>
          )}

          {/* TAB 4 DETAILED REVIEW: CHAT TRANSCRIPT AUDIT & SCORE OVERRIDE SCREEN */}
          {currentTab === "reviews" && selectedSubmissionId && selectedSubmission && (
            <div className="max-w-6xl mx-auto space-y-4 animate-fade-in pb-8">
              <button 
                onClick={() => setSelectedSubmissionId(null)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Evaluation Center</span>
                <span className="sm:hidden">Back</span>
              </button>

              <Card className="p-4 bg-white shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">Reviewing Student: {selectedSubmission.studentName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Task: "{selectedSubmission.title}" · Subject: {getSubjectName(selectedSubmission.subjectId)}</p>
                </div>
                <Badge className={getStatusBadgeColor(selectedSubmission.status)}>
                  {selectedSubmission.status === "completed" ? "Pending" : "Graded"}
                </Badge>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <Card className="flex flex-col bg-slate-900 border-slate-800 text-slate-100 min-h-[32rem]">
                  <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      Original Chat Transcript
                    </span>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-3xs font-semibold">
                      {selectedSubmission.chatHistory.length} messages
                    </Badge>
                  </div>
                  
                  <ScrollArea className="h-[28rem] w-full">
                    <div className="p-4 space-y-4 pr-3">
                      {selectedSubmission.chatHistory.map((msg, index) => {
                        const isStudent = msg.role === "user";
                        return (
                          <div key={index} className={`flex gap-3 ${isStudent ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isStudent ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400 ring-1 ring-slate-700"}`}>
                              {isStudent ? "You" : "AI"}
                            </div>
                            <div className={`p-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${isStudent ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-100"}`}>
                              <p className="whitespace-pre-line">{msg.content}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </Card>

                <Card className="p-6 bg-white shadow-3xs min-h-[32rem] flex flex-col">
                  <div className="space-y-6 flex-1">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                        BERT Evaluation
                      </h4>
                      <p className="text-3xs text-slate-500 mt-0.5 hidden sm:block">
                        NLP rubric scores from the student discussion.
                      </p>
                    </div>

                    {/* AI score detail grids */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-3xs text-slate-500 font-semibold block mb-0.5">Vocabulary Complexity</span>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs font-extrabold text-slate-800">Advanced 88%</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-3xs text-slate-500 font-semibold block mb-0.5">Semantic Core Alignment</span>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-extrabold text-slate-800">Optimal 94%</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-3xs text-slate-500 font-semibold block mb-0.5">Discussion Participation</span>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs font-extrabold text-slate-800">High 90%</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-3xs text-slate-500 font-semibold block mb-0.5">Critical Reasoning Depth</span>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs font-extrabold text-slate-800">Excellent 92%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50/40 p-4 border border-amber-100 rounded-xl min-h-[8rem]">
                      <span className="text-2xs font-bold text-amber-800 block mb-2">AI Evaluator Feedback:</span>
                      <p className="text-sm text-amber-900 italic leading-relaxed">
                        "{selectedSubmission.aiFeedback}"
                      </p>
                    </div>

                    {/* Grade Audit Override Form */}
                    <div className="border-t pt-4 space-y-4">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <GraduationCap className="w-4.5 h-4.5 text-indigo-600" />
                        Grade Override
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="override-score" className="text-2xs font-semibold text-slate-700">Percentage Score (0 - 100)</Label>
                          <Input
                            id="override-score"
                            type="number"
                            min="0"
                            max="100"
                            value={overrideScore}
                            onChange={(e) => setOverrideScore(parseInt(e.target.value, 10) || 0)}
                            className="text-xs h-9 border-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="override-grade" className="text-2xs font-semibold text-slate-700">Letter Grade</Label>
                          <Select value={overrideGrade} onValueChange={setOverrideGrade}>
                            <SelectTrigger id="override-grade" className="text-xs h-9 border-slate-200">
                              <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {["A+", "A", "B+", "B", "C+", "C", "D", "F"].map((g) => (
                                <SelectItem key={g} value={g}>{g}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="teacher-notes" className="text-2xs font-semibold text-slate-700">Feedback</Label>
                        <Textarea
                          id="teacher-notes"
                          placeholder="Provide encouraging words and suggestions for academic improvements..."
                          value={teacherFeedback}
                          onChange={(e) => setTeacherFeedback(e.target.value)}
                          className="text-xs min-h-[5rem] border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-6 flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-xs h-9 border-slate-200 text-slate-700 font-semibold"
                      onClick={() => setSelectedSubmissionId(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9"
                      onClick={handlePublishGrade}
                    >
                      <span className="hidden sm:inline">Publish Grade & Feedback</span>
                      <span className="sm:hidden">Publish</span>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
        className="md:hidden fixed left-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-colors hover:bg-slate-50 hover:text-slate-900"
      >
        <Menu className="h-5 w-5" />
      </button>
    </div>
  );
}
