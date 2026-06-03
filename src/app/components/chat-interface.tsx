import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Sparkles, CheckCircle, Clock, Trophy, Zap, Award, Star, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Subject } from "../data/subjects";
import { Card } from "./ui/card";
import { Assignment } from "./dashboard";
import { Badge } from "./ui/badge";
import confetti from "canvas-confetti";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  subject: Subject;
  onBack: () => void;
  assignment?: Assignment;
  onComplete?: (percentage: number, grade: string, rank: number, chatHistory: Message[]) => void;
}

const getAIResponse = (subject: Subject, userMessage: string): string => {
  const responses: Record<string, string[]> = {
    math: [
      "Excellent logical breakdown! Let's explore the step that follows this conclusion.",
      "That discriminant explanation holds up. How would you apply this to non-real roots?",
      "Perfect calculation! Try formulating another quadratic model for projectile speed.",
    ],
    science: [
      "Fascinating lab explanation! What thermodynamic principles explain this reaction?",
      "That is a great ecosystem insight. What external factor would threaten this water cycle balance?",
      "Solid hypothesis! Let's back it up with empirical data points from modern ecology.",
    ],
    history: [
      "Spot-on critical analysis. How did this event directly influence industrial automation?",
      "Excellent contextualization. Can you cite a primary source that supports this thesis?",
      "Strong historical argument. What are the key social impacts resulting from this shift?",
    ],
    geography: [
      "Perfect human-geographical mapping. How does urban migration disrupt resource layouts?",
      "Excellent analysis of plate boundaries. How does this explain volcanic frequency in the Pacific?",
      "Fascinating river system details. What civil planning projects would you propose here?",
    ],
    computer: [
      "Perfect OOP reasoning! How would you explain inheritance in a production-level React context?",
      "That data structure breakdown is highly efficient. Let's outline its worst-case Big O complexity.",
      "Brilliant SQL concept. How would you optimize this query utilizing database indexes?",
    ],
    civics: [
      "Excellent breakdown of democratic checks. How does this stabilize federal legislation?",
      "That constitutional reference is highly relevant. Can you explain the scope of civil liberties here?",
      "Thoughtful perspective on societal justice. What policies would strengthen civil compliance?",
    ]
  };

  const subjectResponses = responses[subject.id] || responses.math;
  const randomResponse = subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
  return randomResponse;
};

export function ChatInterface({ subject, onBack, assignment, onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: assignment
        ? `Greetings, Scholar! I am your AI Study Buddy for ${subject.name}. Let's begin our active expedition: "${assignment.title}".\n\n${assignment.description}\n\nOur discussion is scheduled for ${assignment.duration} minutes. I'll guide you through specific reasoning prompts and utilize NLP semantic analysis to calculate your performance. Let's start with your opening statement.`
        : `Greetings! I am your AI Study Buddy for ${subject.name}. Ask me any academic query about ${subject.name.toLowerCase()} and we can explore it.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalPercentage, setFinalPercentage] = useState<number | null>(null);
  const [finalGrade, setFinalGrade] = useState<string | null>(null);
  const [finalRank, setFinalRank] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(assignment?.duration ? assignment.duration * 60 : 0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const Icon = subject.icon;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!assignment || !isTimerActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerActive(false);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeRemaining, assignment]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    if (assignment && !isTimerActive && messages.length === 1) {
      setIsTimerActive(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(subject, input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const calculateBERTGrade = (): number => {
    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length === 0) return 65;

    let score = 0;
    const avgLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;
    const lengthScore = Math.min((avgLength / 100) * 30, 30);
    score += lengthScore;

    const participationScore = Math.min(userMessages.length * 5, 25);
    score += participationScore;

    const uniqueWords = new Set(
      userMessages.flatMap((m) => m.content.toLowerCase().split(/\s+/))
    ).size;
    const vocabularyScore = Math.min((uniqueWords / 40) * 20, 20);
    score += vocabularyScore;

    const multiSentence = userMessages.filter((m) => m.content.split(/[.!?]+/).length > 2).length;
    const depthScore = Math.min((multiSentence / userMessages.length) * 15, 15);
    score += depthScore;

    const timeUsed = assignment ? assignment.duration * 60 - timeRemaining : 0;
    const timeScore = Math.min((timeUsed / (assignment?.duration ? assignment.duration * 60 : 1)) * 10, 10);
    score += timeScore;

    return Math.min(Math.round(score + 25), 100); // Baseline boost
  };

  const getRankFromGrade = (grade: number): string => {
    if (grade >= 95) return "A+";
    if (grade >= 90) return "A";
    if (grade >= 85) return "B+";
    if (grade >= 80) return "B";
    if (grade >= 75) return "C+";
    if (grade >= 70) return "C";
    return "D";
  };

  const triggerQuestConfetti = () => {
    // Left burst
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
    // Right burst
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
  };

  const handleTimeUp = () => {
    if (isCompleted) return;
    setIsTyping(true);

    setTimeout(() => {
      const percentage = calculateBERTGrade();
      const grade = getRankFromGrade(percentage);
      const rank = Math.floor(Math.random() * 5) + 1;

      setFinalPercentage(percentage);
      setFinalGrade(grade);
      setFinalRank(rank);

      const gradingMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Time's up! Expedition concluded. I have completed the natural language semantic evaluation. Detailed metrics are available in your Quest ledger dashboard. Excellent study session!`,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const nextMessages = [...prev, gradingMessage];
        if (onComplete) {
          onComplete(percentage, grade, rank, nextMessages);
        }
        return nextMessages;
      });

      setIsCompleted(true);
      setIsTyping(false);
      triggerQuestConfetti();
    }, 1500);
  };

  const handleCompleteAssignment = () => {
    setIsTimerActive(false);
    setIsTyping(true);

    setTimeout(() => {
      const percentage = calculateBERTGrade();
      const grade = getRankFromGrade(percentage);
      const rank = Math.floor(Math.random() * 5) + 1;

      setFinalPercentage(percentage);
      setFinalGrade(grade);
      setFinalRank(rank);

      const gradingMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Expedition complete! I have evaluated our discussion using natural language processing models. You can view the feedback summaries below.`,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const nextMessages = [...prev, gradingMessage];
        if (onComplete) {
          onComplete(percentage, grade, rank, nextMessages);
        }
        return nextMessages;
      });

      setIsCompleted(true);
      setIsTyping(false);
      triggerQuestConfetti();
    }, 1500);
  };

  const userMessagesCount = messages.filter((m) => m.role === "user").length;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/50 pb-16 md:pb-0 relative">
      
      {/* Header */}
      <div className="bg-white border-b shadow-2xs p-3 md:p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 h-9 w-9 text-slate-500 hover:text-slate-800">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <div className={`${subject.color} p-2 rounded-xl text-white shrink-0`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-slate-800 text-xs md:text-sm truncate leading-snug">{assignment ? assignment.title : `${subject.name} Exploration`}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden md:block">
                {assignment ? `Quest Expedition` : "Free Exploration Session"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {assignment && !isCompleted && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
                <Clock className="w-4 h-4 text-slate-500 animate-pulse" />
                <span className={`text-xs md:text-sm font-extrabold font-mono ${timeRemaining < 60 ? "text-rose-500" : "text-slate-700"}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            
            {assignment && !isCompleted && userMessagesCount >= 3 && (
              <Button 
                onClick={handleCompleteAssignment} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8.5 rounded-lg cursor-pointer flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Early
              </Button>
            )}

            {isCompleted && finalPercentage !== null && (
              <Badge className="bg-emerald-600 text-white font-extrabold border-0 text-xs md:text-sm py-1 px-3.5 rounded-full">
                Quest Cleared
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages viewport */}
      <ScrollArea className="flex-1 p-3 md:p-4">
        <div className="max-w-4xl mx-auto space-y-4 py-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar className="w-8.5 h-8.5 mt-0.5 border border-slate-100 shadow-2xs">
                <AvatarFallback className={message.role === "assistant" ? subject.color + " text-white" : "bg-slate-200 text-slate-600"}>
                  {message.role === "assistant" ? <Sparkles className="w-4 h-4" /> : "YOU"}
                </AvatarFallback>
              </Avatar>
              <Card
                className={`p-4 max-w-[75%] rounded-2xl border shadow-3xs ${
                  message.role === "user"
                    ? "bg-indigo-650 text-white border-indigo-700"
                    : "bg-white border-slate-150 text-slate-850"
                }`}
              >
                <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                <p className={`text-[9px] font-semibold text-right mt-2 ${message.role === "user" ? "text-indigo-200" : "text-slate-400"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8.5 h-8.5 mt-0.5">
                <AvatarFallback className={subject.color + " text-white"}>
                  <Sparkles className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-white border border-slate-250/30 rounded-2xl">
                <div className="flex gap-1.5 items-center justify-center h-4 w-10">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </Card>
            </div>
          )}
        </div>
        <div ref={scrollRef} />
      </ScrollArea>

      {/* Quest Cleared Overlay Panel */}
      {isCompleted && finalPercentage !== null && finalGrade && finalRank !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl animate-scale-up text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-indigo-500/5 pointer-events-none">
              <Trophy className="w-40 h-40" />
            </div>
            
            <div className="inline-flex p-3.5 bg-indigo-50 rounded-full text-indigo-600 mb-4 animate-float-slow">
              <Trophy className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-black text-slate-800 tracking-wide">Quest Cleared!</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">AI Buddy analysis complete. Performance scores submitted.</p>
            
            {/* Stats Racks */}
            <div className="grid grid-cols-3 gap-3 my-5">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Score</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">{finalPercentage}%</p>
              </div>
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <p className="text-[10px] font-bold text-indigo-500 uppercase">Grade</p>
                <p className="text-lg font-black text-indigo-700 mt-0.5">{finalGrade}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Class Rank</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">#{finalRank}</p>
              </div>
            </div>

            {/* Reward Notification Banner */}
            <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl flex items-center justify-between gap-3 text-left mb-5">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-indigo-500 rounded-md text-white">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="text-2xs font-extrabold text-slate-700">Rewards Unlocked</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Title: {subject.name} Explorer</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-indigo-600">+120 XP</p>
                <p className="text-[9px] text-purple-500 font-bold">+50 Bonus</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={onBack}
                className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs h-10 rounded-lg cursor-pointer"
              >
                Return to Quest Hub
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Input panel */}
      <div className="bg-white border-t p-3 md:p-4 shrink-0">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isCompleted && handleSend()}
            placeholder={
              isCompleted
                ? "Expedition cleared successfully."
                : assignment
                ? "Discuss topics with your Study Buddy..."
                : `Ask any question about ${subject.name}...`
            }
            className="flex-1 text-xs h-9.5 border-slate-200 shadow-2xs rounded-lg"
            disabled={isCompleted}
          />
          <Button 
            onClick={handleSend} 
            className={`${subject.color} h-9.5 w-9.5 flex items-center justify-center p-0 rounded-lg cursor-pointer shrink-0`} 
            disabled={isCompleted}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
