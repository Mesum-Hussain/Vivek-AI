import { Button } from "./ui/button";
import { Card } from "./ui/card";
import subjects, { Subject } from "../data/subjects";

interface SubjectSelectorProps {
  onSelectSubject: (subject: Subject) => void;
}

export function SubjectSelector({ onSelectSubject }: SubjectSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2">AI Study Buddy</h1>
          <p className="text-lg text-gray-600">Choose a subject to start learning</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Card
                key={subject.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectSubject(subject)}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`${subject.color} p-4 rounded-full text-white`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-center">{subject.name}</h3>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
