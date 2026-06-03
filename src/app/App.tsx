import { useState } from "react";
import { Subject } from "./data/subjects";
import { ChatInterface, Message } from "./components/chat-interface";
import { SidebarNav } from "./components/sidebar-nav";
import { Dashboard, Assignment } from "./components/dashboard";
import { AssignmentsPage } from "./components/assignments-page";
import { SubjectView } from "./components/subject-view";
import { StudentProfile } from "./components/student-profile";
import { TeacherPortal, Student, Submission, TeacherGuidanceNote } from "./components/teacher-portal";
import subjects from "./data/subjects";
import { LoginPage } from "./components/login-page";

// Mock assignments data
const mockAssignments: Assignment[] = [
  // Mathematics
  { id: "1", subjectId: "math", title: "Discuss Quadratic Equations", description: "Explain the real-world applications of quadratic equations and solve sample problems", dueDate: new Date(2026, 5, 5), duration: 15, status: "pending" },
  { id: "2", subjectId: "math", title: "Trigonometry Applications", description: "Discuss how trigonometry is used in architecture and engineering", dueDate: new Date(2026, 4, 20), duration: 12, status: "graded", percentage: 87, grade: "B+", rank: 4 },
  { id: "3", subjectId: "math", title: "Linear Algebra Basics", description: "Explore matrices and their applications in computer graphics", dueDate: new Date(2026, 5, 12), duration: 18, status: "pending" },
  { id: "4", subjectId: "math", title: "Calculus and Rate of Change", description: "Discuss derivatives and their real-world applications", dueDate: new Date(2026, 4, 15), duration: 20, status: "graded", percentage: 91, grade: "A", rank: 2 },
  { id: "5", subjectId: "math", title: "Probability and Statistics", description: "Analyze data sets and calculate probabilities", dueDate: new Date(2026, 5, 8), duration: 15, status: "pending" },
  { id: "6", subjectId: "math", title: "Geometry in Architecture", description: "Explain geometric principles used in building design", dueDate: new Date(2026, 4, 10), duration: 14, status: "graded", percentage: 85, grade: "B+", rank: 6 },

  // Science
  { id: "7", subjectId: "science", title: "Debate on Climate Change", description: "Present arguments about human impact on climate change with scientific evidence", dueDate: new Date(2026, 5, 7), duration: 20, status: "pending" },
  { id: "8", subjectId: "science", title: "The Water Cycle", description: "Explain the stages of the water cycle and its importance to Earth's ecosystem", dueDate: new Date(2026, 4, 25), duration: 8, status: "graded", percentage: 95, grade: "A+", rank: 1 },
  { id: "9", subjectId: "science", title: "Photosynthesis Process", description: "Discuss how plants convert sunlight into energy", dueDate: new Date(2026, 5, 14), duration: 12, status: "pending" },
  { id: "10", subjectId: "science", title: "Newton's Laws of Motion", description: "Explain and demonstrate the three laws of motion", dueDate: new Date(2026, 4, 18), duration: 15, status: "graded", percentage: 89, grade: "B+", rank: 3 },
  { id: "11", subjectId: "science", title: "Chemical Reactions", description: "Analyze different types of chemical reactions and their applications", dueDate: new Date(2026, 5, 16), duration: 16, status: "pending" },
  { id: "12", subjectId: "science", title: "DNA and Genetics", description: "Discuss how genetic information is inherited", dueDate: new Date(2026, 4, 12), duration: 18, status: "graded", percentage: 93, grade: "A", rank: 1 },

  // History
  { id: "13", subjectId: "history", title: "Analyze the Industrial Revolution", description: "Discuss the social and economic impacts of the Industrial Revolution", dueDate: new Date(2026, 5, 3), duration: 15, status: "in-progress" },
  { id: "14", subjectId: "history", title: "World War II Impact", description: "Examine the global impact of World War II on modern society", dueDate: new Date(2026, 5, 9), duration: 20, status: "pending" },
  { id: "15", subjectId: "history", title: "Ancient Civilizations", description: "Compare and contrast ancient Egyptian and Mesopotamian civilizations", dueDate: new Date(2026, 4, 22), duration: 18, status: "graded", percentage: 86, grade: "B+", rank: 5 },
  { id: "16", subjectId: "history", title: "The Renaissance Period", description: "Discuss the cultural and intellectual movement of the Renaissance", dueDate: new Date(2026, 5, 11), duration: 16, status: "pending" },
  { id: "17", subjectId: "history", title: "Cold War Tensions", description: "Analyze the political and military tensions during the Cold War", dueDate: new Date(2026, 4, 16), duration: 17, status: "graded", percentage: 88, grade: "B+", rank: 4 },
  { id: "18", subjectId: "history", title: "Independence Movements", description: "Examine various independence movements across the world", dueDate: new Date(2026, 5, 15), duration: 15, status: "pending" },

  // Geography
  { id: "19", subjectId: "geography", title: "Climate Zones and Weather Patterns", description: "Discuss different climate zones and how they affect human settlement", dueDate: new Date(2026, 4, 28), duration: 10, status: "graded", percentage: 88, grade: "B+", rank: 5 },
  { id: "20", subjectId: "geography", title: "Tectonic Plates and Earthquakes", description: "Explain plate tectonics and their role in earthquakes", dueDate: new Date(2026, 5, 6), duration: 14, status: "pending" },
  { id: "21", subjectId: "geography", title: "River Systems", description: "Discuss major river systems and their importance to civilizations", dueDate: new Date(2026, 5, 13), duration: 12, status: "pending" },
  { id: "22", subjectId: "geography", title: "Population Distribution", description: "Analyze factors affecting population distribution globally", dueDate: new Date(2026, 4, 19), duration: 15, status: "graded", percentage: 90, grade: "A", rank: 3 },
  { id: "23", subjectId: "geography", title: "Natural Resources", description: "Discuss the distribution and management of natural resources", dueDate: new Date(2026, 5, 17), duration: 13, status: "pending" },
  { id: "24", subjectId: "geography", title: "Urbanization Trends", description: "Examine the causes and effects of rapid urbanization", dueDate: new Date(2026, 4, 14), duration: 16, status: "graded", percentage: 84, grade: "B", rank: 7 },

  // Civics
  { id: "25", subjectId: "civics", title: "Democratic Principles", description: "Discuss the fundamental principles of democracy", dueDate: new Date(2026, 5, 10), duration: 15, status: "pending" },
  { id: "26", subjectId: "civics", title: "Rights and Responsibilities", description: "Explain the rights and responsibilities of citizens", dueDate: new Date(2026, 5, 4), duration: 12, status: "pending" },
  { id: "27", subjectId: "civics", title: "Government Structure", description: "Analyze the three branches of government and their functions", dueDate: new Date(2026, 4, 24), duration: 18, status: "graded", percentage: 92, grade: "A", rank: 2 },
  { id: "28", subjectId: "civics", title: "Constitutional Rights", description: "Discuss fundamental rights guaranteed by the constitution", dueDate: new Date(2026, 5, 18), duration: 14, status: "pending" },
  { id: "29", subjectId: "civics", title: "Electoral Process", description: "Explain how elections work in a democracy", dueDate: new Date(2026, 4, 17), duration: 16, status: "graded", percentage: 87, grade: "B+", rank: 5 },
  { id: "30", subjectId: "civics", title: "Social Justice", description: "Examine issues of equality and social justice in modern society", dueDate: new Date(2026, 5, 19), duration: 17, status: "pending" },

  // Computer Science
  { id: "31", subjectId: "computer", title: "Explain Object-Oriented Programming", description: "Describe OOP concepts with examples and explain why they are important", dueDate: new Date(2026, 5, 2), duration: 10, status: "graded", percentage: 92, grade: "A", rank: 2 },
  { id: "32", subjectId: "computer", title: "Data Structures and Algorithms", description: "Discuss common data structures and their use cases", dueDate: new Date(2026, 5, 8), duration: 20, status: "pending" },
  { id: "33", subjectId: "computer", title: "Web Development Basics", description: "Explain HTML, CSS, and JavaScript fundamentals", dueDate: new Date(2026, 5, 15), duration: 18, status: "pending" },
  { id: "34", subjectId: "computer", title: "Database Management", description: "Discuss relational databases and SQL queries", dueDate: new Date(2026, 4, 21), duration: 16, status: "graded", percentage: 89, grade: "B+", rank: 4 },
  { id: "35", subjectId: "computer", title: "Artificial Intelligence Basics", description: "Explore the fundamentals of AI and machine learning", dueDate: new Date(2026, 5, 12), duration: 22, status: "pending" },
  { id: "36", subjectId: "computer", title: "Cybersecurity Principles", description: "Discuss common security threats and protective measures", dueDate: new Date(2026, 4, 13), duration: 15, status: "graded", percentage: 94, grade: "A+", rank: 1 },
];

const initialStudents: Student[] = [
  {
    id: "nobita",
    name: "Nobita Nobi",
    email: "nobita.nobi@school.edu",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=faces",
    classRank: 3,
    averageScore: 88,
    completedCount: 6,
    pendingCount: 2,
    subjectAverages: { math: 86, science: 95, history: 86, geography: 87, civics: 92, computer: 92 },
    teacherNotes: [
      {
        subjectId: "science",
        subjectName: "Science",
        teacherName: "Teacher — Science",
        note: "Great improvement in science, Nobita! Keep building on your lab explanations.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
      },
      {
        subjectId: "math",
        subjectName: "Mathematics",
        teacherName: "Teacher — Mathematics",
        note: "Work a bit more on quadratic formulas — practice discriminant problems twice a week.",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces",
      },
      {
        subjectId: "history",
        subjectName: "History",
        teacherName: "Teacher — History",
        note: "Your Industrial Revolution discussion showed strong critical thinking. Keep citing primary sources.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
      },
      {
        subjectId: "computer",
        subjectName: "Computer Science",
        teacherName: "Teacher — Computer Science",
        note: "Excellent OOP answers. Next, focus on explaining inheritance with a real project example.",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
      },
    ],
  },
  {
    id: "shizuka",
    name: "Shizuka Minamoto",
    email: "shizuka.m@school.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    classRank: 1,
    averageScore: 95,
    completedCount: 6,
    pendingCount: 1,
    subjectAverages: { math: 95, science: 98, history: 92, geography: 96, civics: 94, computer: 95 },
    teacherNotes: [
      {
        subjectId: "science",
        subjectName: "Science",
        teacherName: "Teacher — Science",
        note: "Outstanding mastery of ecosystem concepts. Consider mentoring classmates in group discussions.",
      },
      {
        subjectId: "math",
        subjectName: "Mathematics",
        teacherName: "Teacher — Mathematics",
        note: "Your problem-solving speed is excellent. Challenge yourself with advanced calculus previews.",
      },
    ],
  },
  {
    id: "dekisugi",
    name: "Dekisugi Hidetoshi",
    email: "dekisugi.h@school.edu",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces",
    classRank: 2,
    averageScore: 94,
    completedCount: 6,
    pendingCount: 1,
    subjectAverages: { math: 96, science: 94, history: 95, geography: 91, civics: 93, computer: 96 }
  },
  {
    id: "suneo",
    name: "Suneo Honekawa",
    email: "suneo.h@school.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    classRank: 4,
    averageScore: 82,
    completedCount: 5,
    pendingCount: 2,
    subjectAverages: { math: 81, science: 85, history: 80, geography: 84, civics: 80, computer: 83 }
  },
  {
    id: "gian",
    name: "Takeshi Goda",
    email: "gian.goda@school.edu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    classRank: 5,
    averageScore: 74,
    completedCount: 4,
    pendingCount: 3,
    subjectAverages: { math: 70, science: 75, history: 72, geography: 78, civics: 76 }
  }
];

const initialSubmissions: Submission[] = [
  {
    id: "sub_1",
    assignmentId: "1", // Discuss Quadratic Equations
    studentId: "suneo",
    studentName: "Suneo Honekawa",
    subjectId: "math",
    title: "Discuss Quadratic Equations",
    submittedAt: new Date(2026, 5, 1),
    status: "completed", // Awaiting Grade
    percentage: 84,
    grade: "B",
    rank: 4,
    chatHistory: [
      { id: "m1", role: "assistant", content: "Hi Suneo! Let's discuss quadratic equations. Do you know what a quadratic equation is?", timestamp: new Date(2026, 5, 1, 10, 0) },
      { id: "m2", role: "user", content: "Yes! It is an equation like ax^2 + bx + c = 0, where a is not zero.", timestamp: new Date(2026, 5, 1, 10, 1) },
      { id: "m3", role: "assistant", content: "Exactly correct! What can you tell me about the roots of this equation?", timestamp: new Date(2026, 5, 1, 10, 2) },
      { id: "m4", role: "user", content: "We can find them using the quadratic formula: x = (-b +- sqrt(b^2 - 4ac)) / 2a.", timestamp: new Date(2026, 5, 1, 10, 3) },
      { id: "m5", role: "assistant", content: "Excellent! The part inside the square root, b^2 - 4ac, has a special name. Do you know what it is?", timestamp: new Date(2026, 5, 1, 10, 4) },
      { id: "m6", role: "user", content: "It is called the discriminant. It tells us if the roots are real or imaginary.", timestamp: new Date(2026, 5, 1, 10, 5) },
      { id: "m7", role: "assistant", content: "Splendid! You have a very clear understanding. Can you tell me a real-world application where quadratic equations are useful?", timestamp: new Date(2026, 5, 1, 10, 6) },
      { id: "m8", role: "user", content: "We can use it in physics, like finding the maximum height of a thrown ball because its path is a parabola.", timestamp: new Date(2026, 5, 1, 10, 7) },
      { id: "m9", role: "assistant", content: "Excellent job Suneo! You've explained the concepts perfectly.", timestamp: new Date(2026, 5, 1, 10, 8) }
    ],
    aiFeedback: "Suneo demonstrated solid knowledge of quadratic equations, roots, discriminant function, and projectile motion. Excellent engagement and vocabulary usage."
  },
  {
    id: "sub_2",
    assignmentId: "8", // The Water Cycle
    studentId: "shizuka",
    studentName: "Shizuka Minamoto",
    subjectId: "science",
    title: "The Water Cycle",
    submittedAt: new Date(2026, 4, 25),
    status: "graded",
    percentage: 98,
    grade: "A+",
    rank: 1,
    chatHistory: [
      { id: "c1", role: "assistant", content: "Hello Shizuka! Let's discuss the water cycle and its importance. Can you name the main stages of the water cycle?", timestamp: new Date(2026, 4, 25, 14, 0) },
      { id: "c2", role: "user", content: "The main stages are evaporation, condensation, precipitation, and collection/runoff.", timestamp: new Date(2026, 4, 25, 14, 1) },
      { id: "c3", role: "assistant", content: "Perfect! Can you explain what happens during evaporation and what drives it?", timestamp: new Date(2026, 4, 25, 14, 2) },
      { id: "c4", role: "user", content: "Evaporation is when liquid water turns into water vapor. It is driven by heat from the sun heating up oceans and rivers.", timestamp: new Date(2026, 4, 25, 14, 3) },
      { id: "c5", role: "assistant", content: "Brilliant. How does condensation lead to precipitation?", timestamp: new Date(2026, 4, 25, 14, 4) },
      { id: "c6", role: "user", content: "As water vapor rises, it cools down and forms clouds through condensation. When droplets in the clouds become too heavy, they fall as rain or snow (precipitation).", timestamp: new Date(2026, 4, 25, 14, 5) },
      { id: "c7", role: "assistant", content: "Absolutely stellar explanation! You have completely mastered this ecosystem concept.", timestamp: new Date(2026, 4, 25, 14, 6) }
    ],
    aiFeedback: "Shizuka has a perfect understanding of all water cycle stages and solar driving factors. Vocabulary complexity and response depth were outstanding.",
    teacherFeedback: "Flawless work Shizuka! Your understanding of thermodynamics in the context of weather cycles is beautiful."
  }
];

type ViewMode = "dashboard" | "assignments" | "subject" | "chat" | "profile";

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [returnViewMode, setReturnViewMode] = useState<ViewMode>("dashboard");

  // Stateful Session: Null represents logged-out state
  const [session, setSession] = useState<{
    role: "student" | "teacher";
    studentId?: string;
    teacherSubjectId?: string;
    name: string;
    email: string;
  } | null>(null);

  // Integrated databases states
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  // Logged-in Student portfolio tracking
  const activeStudent = session?.role === "student" && session.studentId
    ? students.find(s => s.id === session.studentId)
    : students.find(s => s.id === "nobita");

  const studentClassRank = activeStudent ? activeStudent.classRank : 3;
  const teacherNotes = activeStudent?.teacherNotes ?? [];

  const handleLogin = (loginSession: {
    role: "student" | "teacher";
    studentId?: string;
    teacherSubjectId?: string;
    name: string;
    email: string;
  }) => {
    setSession(loginSession);
    if (loginSession.role === "student") {
      setViewMode("dashboard");
      setSelectedSubject(null);
      setCurrentAssignment(null);
      setIsSidebarOpen(false);
    }
  };

  const handleSelectSubject = (subject: Subject | null) => {
    if (subject === null) {
      setViewMode("dashboard");
      setSelectedSubject(null);
      setCurrentAssignment(null);
    } else {
      setViewMode("subject");
      setSelectedSubject(subject);
      setCurrentAssignment(null);
    }
  };

  const handleStartAssignment = (assignment: Assignment, subject?: Subject) => {
    setReturnViewMode(viewMode);
    setCurrentAssignment(assignment);
    if (subject) {
      setSelectedSubject(subject);
    }
    setViewMode("chat");
  };

  const handleBack = () => {
    if (currentAssignment) {
      setCurrentAssignment(null);
      setViewMode(returnViewMode === "chat" ? "dashboard" : returnViewMode);
    } else {
      setViewMode("dashboard");
      setSelectedSubject(null);
    }
  };

  const handleOpenAssignments = () => {
    setViewMode("assignments");
    setSelectedSubject(null);
    setCurrentAssignment(null);
    setIsSidebarOpen(false);
  };

  const handleOpenProfile = () => {
    setViewMode("profile");
    setSelectedSubject(null);
    setIsSidebarOpen(false);
  };

  const handleSelectSubjectWrapper = (subject: Subject | null) => {
    handleSelectSubject(subject);
    setIsSidebarOpen(false);
  };

  // --- TEACHER ACTIONS ---
  
  const handleAddAssignment = (newAsg: Omit<Assignment, "id" | "status"> & { aiRubric?: string }) => {
    const newId = (assignments.length + 1).toString();
    const assignment: Assignment = {
      ...newAsg,
      id: newId,
      status: "pending"
    };
    setAssignments((prev) => [assignment, ...prev]);

    // Update pending counts for all students since there is a new assignment!
    setStudents((prev) => 
      prev.map((s) => ({
        ...s,
        pendingCount: s.pendingCount + 1
      }))
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleGradeSubmission = (submissionId: string, percentage: number, grade: string, feedback: string) => {
    // 1. Find the target submission to update
    let updatedSub: Submission | undefined;
    
    setSubmissions((prev) => 
      prev.map((sub) => {
        if (sub.id === submissionId) {
          updatedSub = {
            ...sub,
            status: "graded",
            percentage,
            grade,
            teacherFeedback: feedback
          };
          return updatedSub;
        }
        return sub;
      })
    );

    // 2. We use setTimeout to allow state to settle, or use the local scoped updatedSub
    const targetSub = updatedSub || submissions.find(s => s.id === submissionId);
    if (targetSub) {
      const assignmentId = targetSub.assignmentId;
      const studentId = targetSub.studentId;

      // 3. If graded submission is for Nobita, let's reflect it in Nobita's dashboard assignments
      if (studentId === "nobita") {
        setAssignments((prev) => 
          prev.map((a) => {
            if (a.id === assignmentId) {
              return {
                ...a,
                status: "graded",
                percentage,
                grade,
                rank: targetSub.rank
              };
            }
            return a;
          })
        );
      }

      // 4. Update the student portfolio analytics
      setStudents((prev) => 
        prev.map((student) => {
          if (student.id === studentId) {
            // Student completed count stays the same but pending count decreases if this was just graded
            const isCompletedBefore = targetSub.status === "completed";
            
            const nextSubjectAverages = { ...student.subjectAverages };
            nextSubjectAverages[targetSub.subjectId] = percentage;

            const subjectValues = Object.values(nextSubjectAverages);
            const nextAverageScore = subjectValues.length
              ? Math.round(subjectValues.reduce((a, b) => a + b, 0) / subjectValues.length)
              : student.averageScore;

            return {
              ...student,
              subjectAverages: nextSubjectAverages,
              averageScore: nextAverageScore
            };
          }
          return student;
        })
      );
    }
  };

  const handleSaveTeacherNote = (studentId: string, note: string, subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    const entry: TeacherGuidanceNote = {
      subjectId,
      subjectName: subject.name,
      teacherName: `Teacher — ${subject.name}`,
      note,
    };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const existing = s.teacherNotes ?? [];
        const index = existing.findIndex((n) => n.subjectId === subjectId);
        const nextNotes =
          index >= 0
            ? existing.map((n, i) => (i === index ? { ...entry, avatar: n.avatar } : n))
            : [...existing, entry];
        return { ...s, teacherNotes: nextNotes };
      })
    );
  };

  // --- STUDENT ACTIONS ---
  
  const handleCompleteStudentAssignment = (percentage: number, grade: string, rank: number, chatHistory: Message[]) => {
    if (!currentAssignment) return;

    // 1. Update the student's local assignment state to completed (Awaiting Grade)
    setAssignments((prev) => 
      prev.map((a) => {
        if (a.id === currentAssignment.id) {
          return {
            ...a,
            status: "completed",
            percentage,
            grade,
            rank
          };
        }
        return a;
      })
    );

    // 2. Record this as a submission awaiting audit in the teacher portal!
    const newSubmission: Submission = {
      id: `sub_${Date.now()}`,
      assignmentId: currentAssignment.id,
      studentId: session?.studentId || "nobita",
      studentName: session?.name || "Nobita Nobi",
      subjectId: currentAssignment.subjectId,
      title: currentAssignment.title,
      submittedAt: new Date(),
      status: "completed", // Awaiting Review/Audit
      percentage,
      grade,
      rank,
      chatHistory,
      aiFeedback: `Student conducted a healthy, high-quality discussion on ${currentAssignment.title}. They successfully covered core subject principles. NLP-calculated grade suggested is ${grade}.`
    };

    setSubmissions((prev) => [newSubmission, ...prev]);

    // 3. Adjust student portal rosters
    setStudents((prev) => 
      prev.map((s) => {
        if (s.id === (session?.studentId || "nobita")) {
          return {
            ...s,
            completedCount: s.completedCount + 1,
            pendingCount: Math.max(0, s.pendingCount - 1)
          };
        }
        return s;
      })
    );
  };

  // 1. If not authenticated, force the LoginPage session setup
  if (session === null) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. If authenticated as single-subject instructor, render TeacherPortal
  if (session.role === "teacher") {
    return (
      <TeacherPortal
        assignments={assignments}
        submissions={submissions}
        students={students}
        onAddAssignment={handleAddAssignment}
        onDeleteAssignment={handleDeleteAssignment}
        onGradeSubmission={handleGradeSubmission}
        onSaveTeacherNote={handleSaveTeacherNote}
        teacherSubjectId={session.teacherSubjectId}
        teacherName={session.name}
        teacherEmail={session.email}
        onLogout={() => setSession(null)}
      />
    );
  }

  // 3. Else, render Student Portal for logged-in Student session
  return (
    <div className="flex h-screen overflow-hidden animate-fade-in">
      {/* Desktop Sidebar */}
      <div className="hidden md:block col-span-1 shrink-0">
        <SidebarNav
          selectedSubject={selectedSubject}
          onSelectSubject={handleSelectSubject}
          onOpenAssignments={handleOpenAssignments}
          onOpenProfile={handleOpenProfile}
          isAssignmentsView={viewMode === "assignments"}
          isProfileView={viewMode === "profile"}
          classRank={studentClassRank}
          studentName={session.name}
          studentAvatar={activeStudent?.avatar}
          averageScore={activeStudent?.averageScore}
          completedCount={activeStudent?.completedCount}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden">
            <SidebarNav
              selectedSubject={selectedSubject}
              onSelectSubject={handleSelectSubjectWrapper}
              onOpenAssignments={handleOpenAssignments}
              onOpenProfile={handleOpenProfile}
              onClose={() => setIsSidebarOpen(false)}
              isAssignmentsView={viewMode === "assignments"}
              isProfileView={viewMode === "profile"}
              classRank={studentClassRank}
              studentName={session.name}
              studentAvatar={activeStudent?.avatar}
              averageScore={activeStudent?.averageScore}
              completedCount={activeStudent?.completedCount}
            />
          </div>
        </>
      )}

      <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-indigo-50 pt-14 md:pt-0">
        {viewMode === "dashboard" && (
          <Dashboard
            assignments={assignments}
            classRank={studentClassRank}
            studentName={session.name}
            teacherNotes={teacherNotes}
            onStartAssignment={handleStartAssignment}
            onSelectSubject={handleSelectSubject}
          />
        )}

        {viewMode === "assignments" && (
          <AssignmentsPage
            assignments={assignments}
            onStartAssignment={handleStartAssignment}
          />
        )}

        {viewMode === "subject" && selectedSubject && (
          <SubjectView
            subject={selectedSubject}
            assignments={assignments}
            onStartAssignment={handleStartAssignment}
          />
        )}

        {viewMode === "chat" && selectedSubject && (
          <ChatInterface
            subject={selectedSubject}
            onBack={handleBack}
            assignment={currentAssignment || undefined}
            onComplete={handleCompleteStudentAssignment}
          />
        )}

        {viewMode === "profile" && (
          <StudentProfile
            studentName={session.name}
            studentEmail={session.email}
            classRank={studentClassRank}
            averageScore={activeStudent?.averageScore}
            completedCount={activeStudent?.completedCount}
            subjectAverages={activeStudent?.subjectAverages}
            onLogout={() => {
              setSession(null);
              setViewMode("dashboard");
            }}
          />
        )}
      </div>

      {/* Floating Action Button - Mobile Menu Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
        className="md:hidden fixed left-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-50 hover:text-gray-900"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}

