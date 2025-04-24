
import React from "react";
import { QuizQuestion } from "@/lib/quizTypes";
import { Button } from "@/components/ui/button";

interface QuizContentProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (answerType: number) => void;
}

const QuizContent = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
}: QuizContentProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-electric-blue font-tech">
          Întrebarea {currentIndex + 1}/{totalQuestions}
        </span>
        <div className="w-1/2 bg-gray-700 rounded-full h-2">
          <div
            className="bg-electric-blue h-2 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
        {question.question}
      </h2>

      <div className="grid gap-4">
        {question.answers.map((answer, index) => (
          <Button
            key={index}
            variant="outline"
            className="text-left p-4 hover:bg-electric-blue/20 border-electric-blue/30 justify-start h-auto"
            onClick={() => onAnswer(answer.type)}
          >
            <span className="mr-3 bg-electric-blue/20 rounded-full w-8 h-8 flex items-center justify-center text-electric-blue">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-white/90">{answer.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuizContent;
