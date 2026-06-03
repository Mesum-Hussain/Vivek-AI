import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Subject } from "../data/subjects";
import { Assignment } from "./dashboard";
import { CheckCircle, Clock, Calendar, Zap, Sparkles, Award } from "lucide-react";

interface SubjectViewProps {
  subject: Subject;
  assignments: Assignment[];
  onStartAssignment: (assignment: Assignment, subject: Subject) => void;
}

export function SubjectView({ subject, assignments, onStartAssignment }: SubjectViewProps) {
  const Icon = subject.icon;

  const subjectAssignments = assignments.filter((a) => a.subjectId === subject.id);
  const completedAssignments = subjectAssignments.filter((a) => a.status === "graded");
  const pendingAssignments = subjectAssignments.filter((a) => a.status !== "graded");

  // Prepare data for pie chart
  const chartData = completedAssignments.map((assignment, index) => ({
    name: assignment.title,
    value: assignment.percentage || 0,
    color: `hsl(${(index * 360) / Math.max(completedAssignments.length, 1) + 200}, 75%, 60%)`,
  }));

  const averagePerformance = completedAssignments.length > 0
    ? Math.round(
        completedAssignments.reduce((sum, a) => sum + (a.percentage || 0), 0) /
          completedAssignments.length
      )
    : 0;

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-150";
      case "completed":
        return "bg-amber-50 text-amber-700 border-amber-150";
      case "graded":
        return "bg-emerald-50 text-emerald-700 border-emerald-150";
    }
  };

  const getStatusText = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return "Quest Available";
      case "in-progress":
        return "Exploring";
      case "completed":
        return "Under Review";
      case "graded":
        return "Quest Cleared";
    }
  };

  // Grade Tier calculations
  const getSubjectGradeTier = (avg: number) => {
    if (avg >= 90) return { title: "Archon Tier", desc: "Supreme understanding of subject topics" };
    if (avg >= 80) return { title: "Expert Tier", desc: "Capable and highly proficient learner" };
    if (avg >= 70) return { title: "Adept Tier", desc: "Solid baseline of core concepts" };
    return { title: "Novice Tier", desc: "Just beginning the subject journey" };
  };

  const gradeTier = getSubjectGradeTier(averagePerformance);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/50 pb-16 md:pb-0">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Subject Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className={`${subject.color} p-3 rounded-2xl text-white shadow-lg`}>
                <Icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Campaigns</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{subject.name}</h2>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                  {completedAssignments.length} quests cleared · {pendingAssignments.length} available
                </p>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          {completedAssignments.length > 0 && (
            <Card className="p-5 md:p-6 mb-6 md:mb-8 bg-white border border-slate-200 rounded-2xl shadow-2xs">
              <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Subject Analytics Visuals</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, "Score"]}
                        contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e2e8f0" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                  <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-6">
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center shadow-inner">
                        <span className="text-3xl font-black text-slate-850">
                          {averagePerformance}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <Badge className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-3xs font-extrabold uppercase py-0.5 px-2.5 rounded-full mb-1 hover:bg-indigo-50">
                        {gradeTier.title}
                      </Badge>
                      <h4 className="text-sm font-bold text-slate-800">Average Performance</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mt-0.5">
                        {gradeTier.desc} across your {completedAssignments.length} cleared encounters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Pending Assignments (Active Quests) */}
          {pendingAssignments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-600 animate-pulse" />
                Active Expeditions ({pendingAssignments.length})
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {pendingAssignments.map((assignment) => {
                  const isOverdue = assignment.dueDate < new Date();
                  return (
                    <Card
                      key={assignment.id}
                      className="p-4 bg-quest-card border hover:border-indigo-200 shadow-2xs hover:shadow-sm cursor-pointer rounded-2xl transition-all"
                      onClick={() => onStartAssignment(assignment, subject)}
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className={`${subject.color} flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-white md:min-h-20 md:w-28 md:flex-col md:gap-1 md:p-3 shrink-0`}>
                          <Icon className="h-4.5 w-4.5 shrink-0 md:h-6 md:w-6" />
                          <span className="text-xs font-bold leading-tight uppercase tracking-wider text-center">{subject.name}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-1.5">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-extrabold text-slate-850 text-base md:text-lg truncate leading-snug">{assignment.title}</h4>
                            </div>
                            <Badge className={`${getStatusColor(assignment.status)} border text-2xs font-bold py-0.5 px-2 rounded-full`}>
                              {getStatusText(assignment.status)}
                            </Badge>
                          </div>
                          
                          <p className="text-xs md:text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed font-medium">
                            {assignment.description}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100/80">
                            <div className="flex flex-wrap items-center gap-3 text-2xs font-bold text-slate-500">
                              <span className={`flex items-center gap-1 ${isOverdue ? "text-rose-500" : ""}`}>
                                <Calendar className="w-3.5 h-3.5" />
                                Due: {assignment.dueDate.toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {assignment.duration} min
                              </span>
                              <span className="flex items-center gap-1 text-indigo-650 bg-indigo-50 border border-indigo-100 rounded-md px-1.5 py-0.5">
                                <Zap className="w-3 h-3 fill-current text-indigo-500" />
                                +120 XP
                              </span>
                            </div>
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartAssignment(assignment, subject);
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-8 shadow-2xs rounded-lg cursor-pointer flex items-center justify-center gap-1"
                            >
                              <span>{assignment.status === "pending" ? "Start" : "Resume"}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Assignments */}
          {completedAssignments.length > 0 && (
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Cleared Encounters ({completedAssignments.length})
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {completedAssignments.map((assignment) => (
                  <Card key={assignment.id} className="p-4 bg-quest-card border border-emerald-100 hover:border-emerald-250 shadow-2xs rounded-2xl transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 pointer-events-none text-emerald-500/10">
                      <CheckCircle className="w-20 h-20 rotate-12" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className={`${subject.color} flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-white md:min-h-20 md:w-28 md:flex-col md:gap-1 md:p-3 shrink-0`}>
                        <CheckCircle className="h-4.5 w-4.5 shrink-0 md:h-6 md:w-6" />
                        <span className="text-xs font-bold leading-tight uppercase tracking-wider text-center">{subject.name}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-1.5">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-slate-850 text-base md:text-lg truncate leading-snug">{assignment.title}</h4>
                          </div>
                          <Badge className={`${getStatusColor(assignment.status)} border text-2xs font-bold py-0.5 px-2 rounded-full`}>
                            {getStatusText(assignment.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-xs md:text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed font-medium">
                          {assignment.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100/80 text-2xs font-bold text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Cleared: {assignment.dueDate.toLocaleDateString()}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-emerald-600 font-extrabold text-xs md:text-sm bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                              Score: {assignment.percentage}%
                            </span>
                            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold border-0 text-3xs">
                              Grade: {assignment.grade}
                            </Badge>
                            <Badge className="bg-blue-600 text-white font-extrabold border-0 text-3xs">
                              Rank: #{assignment.rank}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {subjectAssignments.length === 0 && (
            <Card className="p-8 md:p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
              <Icon className="w-12 h-12 md:w-16 md:h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg md:text-xl font-extrabold text-slate-850 mb-2">No Campaigns Yet</h3>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Your instructor hasn't scheduled any quests for {subject.name} yet.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
