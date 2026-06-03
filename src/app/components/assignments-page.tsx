import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Assignment } from "./dashboard";
import { Subject, subjects } from "../data/subjects";

interface AssignmentsPageProps {
  assignments: Assignment[];
  onStartAssignment: (assignment: Assignment, subject: Subject) => void;
}

export function AssignmentsPage({ assignments, onStartAssignment }: AssignmentsPageProps) {
  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-200 text-gray-700";
      case "in-progress":
        return "bg-blue-200 text-blue-700";
      case "completed":
        return "bg-yellow-200 text-yellow-700";
      case "graded":
        return "bg-green-200 text-green-700";
    }
  };

  const getStatusText = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return "Not Started";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Awaiting Grade";
      case "graded":
        return "Graded";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50 pb-16 md:pb-0">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Assignments</h2>
            <p className="text-sm md:text-base text-gray-600">Review pending work and graded submissions</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {assignments.map((assignment) => {
              const subject = subjects.find((s) => s.id === assignment.subjectId);
              if (!subject) return null;

              const Icon = subject.icon;
              const isOverdue = assignment.dueDate < new Date() && assignment.status !== "graded";

              return (
                <Card key={assignment.id} className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className={`${subject.color} flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-center text-white md:min-h-20 md:w-28 md:flex-col md:gap-1 md:rounded-lg md:p-3`}>
                      <Icon className="h-4 w-4 shrink-0 md:h-6 md:w-6" />
                      <span className="text-xs font-semibold leading-tight">{subject.name}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base md:text-lg truncate">{assignment.title}</h4>
                          <p className="text-xs md:text-sm text-gray-500">{subject.name}</p>
                        </div>
                        <Badge className={getStatusColor(assignment.status)}>
                          {getStatusText(assignment.status)}
                        </Badge>
                      </div>
                      <p className="text-sm md:text-base text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                          <span className={isOverdue ? "text-red-500 font-medium" : "text-gray-500"}>
                            Due: {assignment.dueDate.toLocaleDateString()}
                          </span>
                          <span className="text-gray-500">
                            Duration: {assignment.duration} min
                          </span>
                          {assignment.percentage !== undefined && (
                            <div className="flex basis-full flex-wrap items-center gap-2">
                              <span className="text-green-600 font-semibold text-sm md:text-base">
                                {assignment.percentage}%
                              </span>
                              <Badge className="bg-purple-600 text-white">
                                Grade: {assignment.grade}
                              </Badge>
                              <Badge className="bg-blue-600 text-white">
                                Rank: #{assignment.rank}
                              </Badge>
                            </div>
                          )}
                        </div>
                        {assignment.status !== "graded" && (
                          <Button
                            onClick={() => onStartAssignment(assignment, subject)}
                            className="w-36 self-center shrink-0 bg-teal-700 text-white hover:bg-teal-800 md:w-auto md:self-auto"
                          >
                            {assignment.status === "pending" ? "Start" : "Continue"}
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
