import { LayoutDashboard, ListChecks, X, GraduationCap } from "lucide-react";
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
}: SidebarNavProps) {
  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col overflow-hidden">
      <div className="p-6 border-b shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Vivek AI</h1>
          <p className="text-sm text-gray-500 mt-1">Student Portal</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        <div className="mb-6">
          <Button
            variant={selectedSubject === null && !isAssignmentsView && !isProfileView ? "default" : "ghost"}
            className="w-full justify-start gap-3"
            onClick={() => onSelectSubject(null)}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Button>
          <Button
            variant={isAssignmentsView ? "default" : "ghost"}
            className="w-full justify-start gap-3 mt-1"
            onClick={onOpenAssignments}
          >
            <ListChecks className="w-5 h-5" />
            Assignments
          </Button>
        </div>

        <div className="mb-2 px-3">
          <p className="text-xs font-semibold text-gray-500 uppercase">Subjects</p>
        </div>

        <div className="space-y-1">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            const isSelected = selectedSubject?.id === subject.id && !isAssignmentsView && !isProfileView;
            return (
              <Button
                key={subject.id}
                variant={isSelected ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${isSelected ? subject.color : ""}`}
                onClick={() => onSelectSubject(subject)}
              >
                <Icon className="w-5 h-5" />
                {subject.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t shrink-0 space-y-3">
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 w-full hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
        >
          <img
            src={studentAvatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=faces"}
            alt={studentName || "Nobita Nobi"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="text-sm font-medium">{studentName || "Nobita Nobi"}</p>
            <p className="text-xs text-gray-500">Class Rank: #{classRank}</p>
          </div>
        </button>
      </div>
    </div>
  );
}
