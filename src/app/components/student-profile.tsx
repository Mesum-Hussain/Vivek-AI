import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { User, Mail, Bell, Moon, Lock, Globe, Save, LogOut, Award, Trophy, Star, Sparkles, Zap, Shield } from "lucide-react";
import { Badge } from "./ui/badge";

interface StudentProfileProps {
  studentName?: string;
  studentEmail?: string;
  classRank?: number;
  averageScore?: number;
  completedCount?: number;
  subjectAverages?: Record<string, number>;
  onLogout?: () => void;
}

export function StudentProfile({
  studentName = "Nobita Nobi",
  studentEmail = "nobita.nobi@school.edu",
  classRank = 3,
  averageScore = 88,
  completedCount = 6,
  subjectAverages = { math: 86, science: 95, history: 86, geography: 87, civics: 92, computer: 92 },
  onLogout,
}: StudentProfileProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Gamified calculations matching dashboard & sidebar
  const totalXp = completedCount * 120 + averageScore * 8;
  const xpPerLevel = 500;
  const currentLevel = Math.floor(totalXp / xpPerLevel) + 1;
  const xpInCurrentLevel = totalXp % xpPerLevel;
  const progressPercent = Math.min(Math.round((xpInCurrentLevel / xpPerLevel) * 100), 100);

  // Mock Achievements
  const achievements = [
    { id: "1", title: "First Contact", desc: "Initiated first discussion with AI Study Buddy", unlocked: true, icon: Sparkles, color: "bg-indigo-500 text-white" },
    { id: "2", title: "Apex Mind", desc: "Achieved score of 95% or higher on an expedition", unlocked: true, icon: Trophy, color: "bg-amber-500 text-white" },
    { id: "3", title: "Trio Campaigner", desc: "Completed 3 assignments in a single week", unlocked: true, icon: Zap, color: "bg-blue-500 text-white" },
    { id: "4", title: "Polymath", desc: "Cleared an assignment in all subjects", unlocked: false, icon: Award, color: "bg-slate-200 text-slate-400 border-slate-300" },
    { id: "5", title: "Sentinel", desc: "Maintained a 5-day study discussion streak", unlocked: false, icon: Shield, color: "bg-slate-200 text-slate-400 border-slate-300" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/50 pb-16 md:pb-0">
      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Student Ledger & Profile</h2>
            <p className="text-sm text-slate-500 font-medium">Inspect achievements, track subject masteries, and manage preferences.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left/Main Content: Profile Detail & Skill Tree */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Card with XP Level */}
              <Card className="p-5 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs">
                <div className="flex flex-col sm:flex-row items-center gap-5 mb-6">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces"
                      alt={studentName}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-xs text-white border-2 border-white shadow-md">
                      {currentLevel}
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <h3 className="text-lg md:text-xl font-extrabold text-slate-800 truncate">{studentName}</h3>
                      <Badge className="bg-indigo-50 border border-indigo-150 text-indigo-700 text-3xs font-extrabold px-2 py-0.5 rounded-full hover:bg-indigo-50">
                        Class Rank #{classRank}
                      </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">{studentEmail}</p>
                    
                    {/* XP Level progression */}
                    <div className="mt-4 max-w-md mx-auto sm:mx-0">
                      <div className="flex justify-between text-3xs font-bold text-slate-500 uppercase mb-1">
                        <span>Level {currentLevel} Scholar</span>
                        <span>{xpInCurrentLevel} / {xpPerLevel} XP</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full Name</Label>
                      <div className="flex gap-2 mt-1">
                        <Input id="name" defaultValue={studentName} className="text-xs h-9" />
                        <Button variant="outline" size="icon" className="shrink-0 h-9 w-9">
                          <Save className="w-4 h-4 text-slate-500" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                      <div className="flex gap-2 mt-1">
                        <Input id="email" type="email" defaultValue={studentEmail} className="text-xs h-9" />
                        <Button variant="outline" size="icon" className="shrink-0 h-9 w-9">
                          <Save className="w-4 h-4 text-slate-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* RPG-style Skill Tree (Subject Masteries) */}
              <Card className="p-5 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs">
                <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-indigo-600" />
                  Subject Skill tree
                </h3>
                <p className="text-xs text-slate-500 mb-5">Your current mastery level across different subject tracks.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(subjectAverages).map(([subjectId, score]) => {
                    const mathColor = subjectId === "math" ? "from-blue-500 to-indigo-600" :
                                      subjectId === "science" ? "from-emerald-500 to-teal-600" :
                                      subjectId === "history" ? "from-amber-500 to-orange-600" :
                                      subjectId === "geography" ? "from-cyan-500 to-blue-600" :
                                      subjectId === "civics" ? "from-rose-500 to-pink-600" :
                                      "from-violet-500 to-fuchsia-600";
                    const subjectName = subjectId === "math" ? "Mathematics" :
                                        subjectId === "science" ? "Science" :
                                        subjectId === "history" ? "History" :
                                        subjectId === "geography" ? "Geography" :
                                        subjectId === "civics" ? "Civics" : "Computer Science";

                    return (
                      <div key={subjectId} className="p-3 border border-slate-100 rounded-xl bg-slate-50/30">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-bold text-slate-700">{subjectName}</span>
                          <span className="text-xs font-black text-slate-800">{score}%</span>
                        </div>
                        <div className="w-full bg-slate-150 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${mathColor} transition-all duration-700`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          {score >= 90 ? "Master Rank" : score >= 80 ? "Adept Rank" : "Acolyte"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>

            </div>

            {/* Right Column: Achievements & Preferences */}
            <div className="space-y-6">
              
              {/* Achievements Rack */}
              <Card className="p-5 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs">
                <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600 animate-bounce" />
                  Achievements Rack
                </h3>
                <p className="text-xs text-slate-500 mb-4">Complete AI chats to unlock custom titles.</p>
                <div className="space-y-3">
                  {achievements.map((ach) => {
                    const AchIcon = ach.icon;
                    return (
                      <div 
                        key={ach.id} 
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                          ach.unlocked 
                            ? "bg-slate-50/50 border-slate-100" 
                            : "bg-slate-50/20 border-slate-150/40 opacity-55"
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${ach.color}`}>
                          <AchIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{ach.title}</h4>
                            {ach.unlocked && <span className="text-[9px] font-bold text-emerald-600 uppercase">Unlocked</span>}
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{ach.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Preferences */}
              <Card className="p-5 md:p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-650" />
                  System Preferences
                </h3>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div>
                      <p className="font-bold text-xs text-slate-700">Dark Mode</p>
                      <p className="text-[10px] text-slate-400">Toggle dark interfaces</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div>
                      <p className="font-bold text-xs text-slate-700">Quest Reminders</p>
                      <p className="text-[10px] text-slate-400">Receive desktop alerts</p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>

                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div>
                      <p className="font-bold text-xs text-slate-700">Email Updates</p>
                      <p className="text-[10px] text-slate-400">Receive reports in inbox</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Button variant="outline" className="w-full text-xs h-9 justify-start gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg cursor-pointer">
                    <Lock className="w-3.5 h-3.5" />
                    Change Password
                  </Button>
                  {onLogout && (
                    <Button
                      onClick={onLogout}
                      variant="outline"
                      className="w-full text-xs h-9 justify-start gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-bold rounded-lg cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </Card>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
