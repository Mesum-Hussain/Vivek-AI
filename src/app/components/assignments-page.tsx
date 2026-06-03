import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Assignment } from "./dashboard";
import { Subject, subjects } from "../data/subjects";
import { Award, Sparkles, Zap, Clock, Calendar, CheckCircle } from "lucide-react";

interface AssignmentsPageProps {
  assignments: Assignment[];
  onStartAssignment: (assignment: Assignment, subject: Subject) => void;
}

export function AssignmentsPage({ assignments, onStartAssignment }: AssignmentsPageProps) {
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

  const gradedQuests = assignments.filter((a) => a.status === "graded");
  const activeQuests = assignments.filter((a) => a.status !== "graded");
  const completionProgress = assignments.length > 0 
    ? Math.round((gradedQuests.length / assignments.length) * 100) 
    : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/50 pb-16 md:pb-0">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Campaign Progress */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Active Campaigns</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Quest Ledger</h2>
              <p className="text-slate-550 text-sm font-medium">Review and complete your AI-guided academic encounters.</p>
            </div>

            {/* Campaign Progress Card */}
            <Card className="p-4 w-full md:w-80 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>Campaign Progress</span>
                <span>{gradedQuests.length} / {assignments.length} Quests Cleared</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-indigo-600 transition-all duration-500" 
                  style={{ width: `${completionProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider text-right">
                {completionProgress}% Complete
              </p>
            </Card>
          </div>

          {/* Quest Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {assignments.map((assignment) => {
              const subject = subjects.find((s) => s.id === assignment.subjectId);
              if (!subject) return null;

              const Icon = subject.icon;
              const isOverdue = assignment.dueDate < new Date() && assignment.status !== "graded";
              const isCleared = assignment.status === "graded";

              return (
                <Card 
                  key={assignment.id} 
                  className={`p-4 md:p-6 bg-quest-card border shadow-2xs transition-all relative overflow-hidden ${
                    isCleared ? "border-emerald-100 hover:border-emerald-300" : "hover:border-indigo-200"
                  }`}
                >
                  {isCleared && (
                    <div className="absolute top-0 right-0 p-3 pointer-events-none text-emerald-500/10">
                      <CheckCircle className="w-20 h-20 rotate-12" />
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Subject Icon Plate */}
                    <div className={`${subject.color} flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-white md:min-h-20 md:w-28 md:flex-col md:gap-1 md:p-3 shrink-0`}>
                      <Icon className="h-4.5 w-4.5 shrink-0 md:h-6 md:w-6" />
                      <span className="text-xs font-bold leading-tight uppercase tracking-wider text-center">{subject.name}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-base md:text-lg text-slate-800 truncate group-hover:text-indigo-650">
                            {assignment.title}
                          </h4>
                          <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider">{subject.name}</p>
                        </div>
                        <Badge className={`${getStatusColor(assignment.status)} border text-2xs font-bold py-0.5 px-2.5 rounded-full`}>
                          {getStatusText(assignment.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-xs md:text-sm text-slate-500 mb-4 line-clamp-2 font-medium leading-relaxed">
                        {assignment.description}
                      </p>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 border-t border-slate-100/80">
                        <div className="flex flex-wrap items-center gap-3 text-2xs font-bold text-slate-500">
                          <span className={`flex items-center gap-1 ${isOverdue ? "text-rose-500" : ""}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            Due: {assignment.dueDate.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Duration: {assignment.duration} min
                          </span>
                          
                          {!isCleared && (
                            <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-1.5 py-0.5">
                              <Zap className="w-3 h-3 fill-current text-indigo-500" />
                              Reward: +120 XP
                            </span>
                          )}

                          {assignment.percentage !== undefined && (
                            <div className="flex flex-wrap items-center gap-2 mt-1 md:mt-0">
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
                          )}
                        </div>

                        {assignment.status !== "graded" && (
                          <Button
                            onClick={() => onStartAssignment(assignment, subject)}
                            className="w-36 self-center shrink-0 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs h-9 shadow-2xs rounded-lg cursor-pointer md:w-auto md:self-auto flex items-center justify-center gap-1.5"
                          >
                            <span>{assignment.status === "pending" ? "Start Quest" : "Resume Quest"}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
