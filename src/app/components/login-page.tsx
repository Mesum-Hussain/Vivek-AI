import React, { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  ShieldAlert
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import subjects from "../data/subjects";

const STUDENT_DEMO = {
  email: "nobita.nobi@school.edu",
  password: "nobita123",
};

const TEACHER_DEMO = {
  email: "teacher.math@school.edu",
  password: "teacher123",
  subjectId: "math",
};

interface LoginPageProps {
  onLogin: (session: {
    role: "student" | "teacher";
    studentId?: string;
    teacherSubjectId?: string;
    name: string;
    email: string;
  }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");
  const [email, setEmail] = useState(STUDENT_DEMO.email);
  const [password, setPassword] = useState(STUDENT_DEMO.password);
  const [subjectId, setSubjectId] = useState(TEACHER_DEMO.subjectId);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const applyDemoCredentials = (role: "student" | "teacher") => {
    setError(null);
    if (role === "student") {
      setEmail(STUDENT_DEMO.email);
      setPassword(STUDENT_DEMO.password);
    } else {
      setEmail(TEACHER_DEMO.email);
      setPassword(TEACHER_DEMO.password);
      setSubjectId(TEACHER_DEMO.subjectId);
    }
  };

  const switchTab = (tab: "student" | "teacher") => {
    setActiveTab(tab);
    applyDemoCredentials(tab);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all credentials.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (activeTab === "student") {
        const lowerEmail = email.toLowerCase().trim();
        let studentId = "nobita";
        let studentName = "Nobita Nobi";

        if (lowerEmail.includes("shizuka")) {
          studentId = "shizuka";
          studentName = "Shizuka Minamoto";
        } else if (lowerEmail.includes("dekisugi")) {
          studentId = "dekisugi";
          studentName = "Dekisugi Hidetoshi";
        } else if (lowerEmail.includes("suneo")) {
          studentId = "suneo";
          studentName = "Suneo Honekawa";
        } else if (lowerEmail.includes("gian") || lowerEmail.includes("takeshi")) {
          studentId = "gian";
          studentName = "Takeshi Goda";
        }

        onLogin({
          role: "student",
          studentId,
          name: studentName,
          email: email,
        });
      } else {
        const selectedSub = subjects.find((s) => s.id === subjectId);
        const subjectName = selectedSub ? selectedSub.name : "General";
        const teacherName = `Teacher — ${subjectName}`;

        onLogin({
          role: "teacher",
          teacherSubjectId: subjectId,
          name: teacherName,
          email: email,
        });
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex p-3.5 bg-white border border-slate-200 rounded-2xl mb-4 shadow-sm">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Vivek AI</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Smart AI Classroom Platform</p>
        </div>

        <Card className="bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden p-6 md:p-8 animate-slide-up">
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "student"
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              onClick={() => switchTab("student")}
            >
              <User className="w-4 h-4" />
              Student Portal
            </button>
            <button
              type="button"
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "teacher"
                  ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              onClick={() => switchTab("teacher")}
            >
              <GraduationCap className="w-4 h-4" />
              Teacher Portal
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              {activeTab === "student" ? "Welcome back, Student!" : "Teacher Access Portal"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === "student"
                ? "Enter your classroom email to review tasks and chat with your AI Study Buddy."
                : "Select the subject you instruct to audit grades and build assignments."}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex gap-2.5 items-start text-xs text-rose-700 animate-fade-in">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-rose-500" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {activeTab === "teacher" && (
              <div className="space-y-1.5 animate-fade-in">
                <Label htmlFor="subject" className="text-xs font-bold text-slate-700">
                  Subject You Teach
                </Label>
                <Select value={subjectId} onValueChange={setSubjectId}>
                  <SelectTrigger id="subject" className="text-xs h-9.5 border-slate-200 bg-white">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name} Instructor
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={activeTab === "student" ? "e.g. nobita.nobi@school.edu" : "e.g. teacher@school.edu"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-9.5 text-xs border-slate-200 rounded-lg shadow-2xs bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 h-9.5 text-xs border-slate-200 rounded-lg shadow-2xs bg-white"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-xs font-semibold h-10 mt-6 shadow-sm rounded-lg cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? (
                <div className="flex gap-1.5 items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  Sign In to Classroom
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="border-t border-slate-100 mt-6 pt-4 text-center">
            <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Demo credentials
            </span>
            {activeTab === "student" ? (
              <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 text-left">
                <p className="text-3xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Student</p>
                <p className="text-xs text-slate-700 font-mono">{STUDENT_DEMO.email}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Password: {STUDENT_DEMO.password}</p>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => applyDemoCredentials("student")}
                  className="mt-2.5 w-full text-3xs h-7 border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-semibold"
                >
                  Use student demo login
                </Button>
              </div>
            ) : (
              <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 text-left">
                <p className="text-3xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Teacher</p>
                <p className="text-xs text-slate-700 font-mono">{TEACHER_DEMO.email}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Password: {TEACHER_DEMO.password}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Subject: {subjects.find((s) => s.id === TEACHER_DEMO.subjectId)?.name ?? "Mathematics"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => applyDemoCredentials("teacher")}
                  className="mt-2.5 w-full text-3xs h-7 border-slate-200 text-slate-700 hover:bg-white font-semibold"
                >
                  Use teacher demo login
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
