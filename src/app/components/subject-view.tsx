import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Subject } from "../data/subjects";
import { Assignment } from "./dashboard";
import { CheckCircle, Clock } from "lucide-react";

interface SubjectViewProps {
  subject: Subject;
  assignments: Assignment[];
  onStartAssignment: (assignment: Assignment) => void;
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
    color: `hsl(${(index * 360) / completedAssignments.length}, 70%, 60%)`,
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
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className={`${subject.color} p-3 rounded-full text-white`}>
                <Icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">{subject.name}</h2>
                <p className="text-sm md:text-base text-gray-600">
                  {completedAssignments.length} completed, {pendingAssignments.length} pending
                </p>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          {completedAssignments.length > 0 && (
            <Card className="p-4 md:p-6 mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Assignment Performance</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                          {
                            (() => {
                              const renderLabel = (props: any) => {
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

                              return (
                                <Pie
                                  data={chartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={0}
                                  outerRadius={80}
                                  label={renderLabel}
                                  labelLine={false}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                              );
                            })()
                          }
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">Average Performance</p>
                    <p className="text-5xl md:text-6xl font-bold" style={{ color: subject.color.replace('bg-', '#').replace('500', '') }}>
                      {averagePerformance}%
                    </p>
                    <p className="text-gray-500 mt-2">Across {completedAssignments.length} assignments</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Pending Assignments */}
          {pendingAssignments.length > 0 && (
            <div className="mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold mb-4">Pending Assignments</h3>
              <div className="grid grid-cols-1 gap-4">
                {pendingAssignments.map((assignment) => {
                  const isOverdue = assignment.dueDate < new Date();
                  return (
                    <Card
                      key={assignment.id}
                      className="p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => onStartAssignment(assignment)}
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className={`${subject.color} flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-center text-white md:min-h-20 md:w-28 md:flex-col md:gap-1 md:rounded-lg md:p-3`}>
                          <Icon className="h-4 w-4 shrink-0 md:h-6 md:w-6" />
                          <span className="text-xs font-semibold leading-tight">{subject.name}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base md:text-lg truncate">{assignment.title}</h4>
                            </div>
                            <Badge className={getStatusColor(assignment.status)}>
                              {getStatusText(assignment.status)}
                            </Badge>
                          </div>
                          <p className="text-sm md:text-base text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                            <span className={isOverdue ? "text-red-500 font-medium" : "text-gray-500"}>
                              Due: {assignment.dueDate.toLocaleDateString()}
                            </span>
                            <span className="text-gray-500">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                              {assignment.duration} min
                            </span>
                          </div>
                        </div>
                        <Button className="w-36 self-center shrink-0 bg-teal-700 text-white hover:bg-teal-800 md:w-auto md:self-auto">
                          {assignment.status === "pending" ? "Start" : "Continue"}
                        </Button>
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
              <h3 className="text-xl md:text-2xl font-bold mb-4">Completed Assignments</h3>
              <div className="grid grid-cols-1 gap-4">
                {completedAssignments.map((assignment) => (
                  <Card key={assignment.id} className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className={`${subject.color} flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-center text-white md:min-h-20 md:w-28 md:flex-col md:gap-1 md:rounded-lg md:p-3`}>
                        <CheckCircle className="h-4 w-4 shrink-0 md:h-6 md:w-6" />
                        <span className="text-xs font-semibold leading-tight">{subject.name}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base md:text-lg truncate">{assignment.title}</h4>
                          </div>
                          <Badge className={getStatusColor(assignment.status)}>
                            {getStatusText(assignment.status)}
                          </Badge>
                        </div>
                        <p className="text-sm md:text-base text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                          <span className="text-gray-500">
                            Completed: {assignment.dueDate.toLocaleDateString()}
                          </span>
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
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {subjectAssignments.length === 0 && (
            <Card className="p-8 md:p-12 text-center">
              <Icon className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">No Assignments Yet</h3>
              <p className="text-sm md:text-base text-gray-600">
                Your teacher hasn't assigned any tasks for {subject.name} yet.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
