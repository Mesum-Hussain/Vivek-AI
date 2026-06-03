import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Sparkles, CheckCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Subject } from "../data/subjects";
import { Card } from "./ui/card";
import { Assignment } from "./dashboard";
import { Badge } from "./ui/badge";

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

// Mock AI responses based on subject
const getAIResponse = (subject: Subject, userMessage: string): string => {
  const responses: Record<string, string[]> = {
    math: [
      "Great question! Let's break this down step by step. What specific concept are you working on?",
      "Math can be challenging, but you're asking the right questions! Let me help you understand this better.",
      "I see you're exploring this topic. Let's work through it together with some examples.",
    ],
    science: [
      "Fascinating question! Science is all about curiosity. Let's explore this concept together.",
      "That's a great observation! In science, understanding the 'why' is just as important as the 'what'.",
      "Let me explain this concept in a way that's easy to understand. Science is amazing!",
    ],
    history: [
      "Excellent question about history! Understanding the past helps us understand the present.",
      "That's an important historical topic. Let's discuss the context and significance.",
      "History is full of interesting stories and lessons. Let me share some insights about this.",
    ],
    geography: [
      "Great question about our world! Geography helps us understand how everything is connected.",
      "That's an interesting geographical topic. Let's explore the physical and human aspects.",
      "Understanding geography helps us see the bigger picture. Let me explain this concept.",
    ],
    art: [
      "What a creative question! Art is about expression and interpretation. Let's discuss this.",
      "That's a wonderful topic in art! Let's explore the techniques and meanings behind it.",
      "Art has so many forms and styles. I'm excited to discuss this with you!",
    ],
    computer: [
      "Great question about computer science! This is such an exciting field to study.",
      "That's a fundamental concept in programming. Let me break it down for you.",
      "Computer science combines logic and creativity. Let's explore this together!",
    ],
    music: [
      "Wonderful question about music! Music theory and practice go hand in hand.",
      "That's an interesting musical concept. Let's discuss rhythm, melody, and harmony.",
      "Music is a universal language. I'm happy to help you understand this better!",
    ],
    health: [
      "That's an important question about health! Taking care of yourself is crucial.",
      "Great topic! Understanding health helps us make better choices every day.",
      "Health encompasses physical, mental, and emotional well-being. Let's discuss this.",
    ],
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
        ? `Hi! I'm your AI Study Buddy for ${subject.name}. Let's work on your assignment: "${assignment.title}". ${assignment.description}\n\nYou have ${assignment.duration} minutes to discuss this topic. I'll guide the discussion and evaluate your responses using BERT-based analysis. Let's begin!`
        : `Hi! I'm your AI Study Buddy for ${subject.name}. Ask me anything about ${subject.name.toLowerCase()}, and I'll help you learn!`,
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

  // Timer effect
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

    // Start timer on first message for assignments
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

    // Simulate AI thinking time
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(subject, input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const calculateBERTGrade = (): number => {
    const userMessages = messages.filter((m) => m.role === "user");

    if (userMessages.length === 0) return 0;

    // Simulate BERT-based evaluation factors
    let score = 0;

    // Factor 1: Content length and detail (0-30 points)
    const avgLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;
    const lengthScore = Math.min((avgLength / 100) * 30, 30);
    score += lengthScore;

    // Factor 2: Engagement and participation (0-25 points)
    const participationScore = Math.min(userMessages.length * 4, 25);
    score += participationScore;

    // Factor 3: Vocabulary complexity (0-20 points)
    const uniqueWords = new Set(
      userMessages.flatMap((m) => m.content.toLowerCase().split(/\s+/))
    ).size;
    const vocabularyScore = Math.min((uniqueWords / 50) * 20, 20);
    score += vocabularyScore;

    // Factor 4: Discussion depth - multi-sentence responses (0-15 points)
    const multiSentence = userMessages.filter((m) => m.content.split(/[.!?]+/).length > 2).length;
    const depthScore = Math.min((multiSentence / userMessages.length) * 15, 15);
    score += depthScore;

    // Factor 5: Time utilization (0-10 points)
    const timeUsed = assignment ? assignment.duration * 60 - timeRemaining : 0;
    const timeScore = Math.min((timeUsed / (assignment?.duration ? assignment.duration * 60 : 1)) * 10, 10);
    score += timeScore;

    return Math.min(Math.round(score), 100);
  };

  const getRankFromGrade = (grade: number): string => {
    if (grade >= 95) return "A+";
    if (grade >= 90) return "A";
    if (grade >= 85) return "B+";
    if (grade >= 80) return "B";
    if (grade >= 75) return "C+";
    if (grade >= 70) return "C";
    if (grade >= 65) return "D+";
    if (grade >= 60) return "D";
    return "F";
  };

  const handleTimeUp = () => {
    if (isCompleted) return;

    setIsTyping(true);

    setTimeout(() => {
      const percentage = calculateBERTGrade();
      const grade = getRankFromGrade(percentage);
      const rank = Math.floor(Math.random() * 10) + 1; // Mock class rank 1-10

      setFinalPercentage(percentage);
      setFinalGrade(grade);
      setFinalRank(rank);

      const gradingMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Time's up! I've completed the BERT-based analysis of your discussion.\n\n**Percentage: ${percentage}%**\n**Grade: ${grade}**\n**Class Rank: #${rank}**\n\n**BERT Evaluation Summary:**\n- Content Quality: Analyzed semantic understanding and topic relevance\n- Engagement Level: Measured participation and discussion depth\n- Language Complexity: Evaluated vocabulary and sentence structure\n- Critical Thinking: Assessed reasoning and argumentation\n\nThis grade has been sent to your teacher and reflected in your dashboard. Great work!`,
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
    }, 2000);
  };

  const handleCompleteAssignment = () => {
    setIsTimerActive(false);
    setIsTyping(true);

    setTimeout(() => {
      const percentage = calculateBERTGrade();
      const grade = getRankFromGrade(percentage);
      const rank = Math.floor(Math.random() * 10) + 1; // Mock class rank 1-10

      setFinalPercentage(percentage);
      setFinalGrade(grade);
      setFinalRank(rank);

      const gradingMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Great work on completing this assignment! I've analyzed your discussion using BERT-based natural language processing.\n\n**Percentage: ${percentage}%**\n**Grade: ${grade}**\n**Class Rank: #${rank}**\n\n**BERT Evaluation Summary:**\n- Content Quality: Analyzed semantic understanding and topic relevance\n- Engagement Level: Measured participation and discussion depth\n- Language Complexity: Evaluated vocabulary and sentence structure\n- Critical Thinking: Assessed reasoning and argumentation\n- Time Management: Efficient use of allocated time\n\nThis grade has been sent to your teacher and reflected in your dashboard. Excellent work!`,
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
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-16 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b shadow-sm p-3 md:p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <div className={`${subject.color} p-2 rounded-full text-white shrink-0`}>
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-sm md:text-base truncate">{assignment ? assignment.title : subject.name}</h2>
              <p className="text-xs md:text-sm text-gray-500 hidden md:block">
                {assignment ? `Due: ${assignment.dueDate.toLocaleDateString()}` : "AI Study Buddy"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {assignment && !isCompleted && (
              <div className="flex items-center gap-1 md:gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <span
                  className={`text-sm md:text-lg font-semibold ${
                    timeRemaining < 60 ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            {assignment && !isCompleted && messages.filter((m) => m.role === "user").length >= 3 && (
              <Button onClick={handleCompleteAssignment} className="bg-green-600 hover:bg-green-700 hidden md:flex">
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Early
              </Button>
            )}
            {isCompleted && finalPercentage !== null && finalGrade && finalRank !== null && (
              <div className="flex items-center gap-1 md:gap-2">
                <Badge className="bg-green-600 text-white text-xs md:text-lg px-2 md:px-4 py-1 md:py-2">
                  {finalPercentage}%
                </Badge>
                <Badge className="bg-purple-600 text-white text-xs md:text-lg px-2 md:px-4 py-1 md:py-2 hidden md:inline-flex">
                  Grade: {finalGrade}
                </Badge>
                <Badge className="bg-blue-600 text-white text-xs md:text-lg px-2 md:px-4 py-1 md:py-2 hidden sm:inline-flex">
                  Rank: #{finalRank}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-4">
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className={message.role === "assistant" ? subject.color + " text-white" : "bg-gray-300"}>
                  {message.role === "assistant" ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    "You"
                  )}
                </AvatarFallback>
              </Avatar>
              <Card
                className={`p-4 max-w-[70%] ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className={subject.color + " text-white"}>
                  <Sparkles className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-white">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t p-3 md:p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          {assignment && !isCompleted && messages.filter((m) => m.role === "user").length >= 3 && (
            <Button onClick={handleCompleteAssignment} className="bg-green-600 hover:bg-green-700 md:hidden shrink-0">
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isCompleted && handleSend()}
            placeholder={
              isCompleted
                ? "Assignment completed!"
                : assignment
                ? "Share your thoughts on this topic..."
                : `Ask me anything about ${subject.name}...`
            }
            className="flex-1"
            disabled={isCompleted}
          />
          <Button onClick={handleSend} className={subject.color} disabled={isCompleted}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
