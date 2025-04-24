
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import QuizContent from "@/components/quiz/QuizContent";
import QuizResult from "@/components/quiz/QuizResult";
import { ElectricianProfile, QuizData } from "@/lib/quizTypes";
import { quizQuestions } from "@/lib/quizData";
import { toast } from "sonner";

const ElectricianQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [profile, setProfile] = useState<ElectricianProfile | null>(null);
  
  const handleAnswer = (answerType: number) => {
    const newAnswers = [...answers, answerType];
    setAnswers(newAnswers);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate profile
      const profileCounts = newAnswers.reduce(
        (counts, type) => {
          counts[type - 1]++;
          return counts;
        },
        [0, 0, 0, 0]
      );
      
      // Find dominant profile
      const maxCount = Math.max(...profileCounts);
      const dominantIndex = profileCounts.indexOf(maxCount);
      
      // Map to profile type
      const profileTypes: ElectricianProfile[] = [
        "mesterm", // Meșterul Metodic
        "regev", // Regele Vitezei
        "smart", // Electricianul Smart
        "stilv" // Stil Vechi
      ];
      
      setProfile(profileTypes[dominantIndex]);
      setShowResult(true);
      toast.success("Quiz completat! Descoperă-ți profilul de electrician.");
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setShowResult(false);
    setAnswers([]);
    setProfile(null);
  };
  
  const navigateToBecomePartner = () => {
    navigate("/parteneriat", { state: { fromQuiz: true, profileType: profile } });
  };

  return (
    <div className="min-h-screen bg-dark-matter flex flex-col">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-tech text-3xl md:text-4xl text-electric-blue mb-6 text-center">
            Ce tip de electrician ești?
          </h1>
          <p className="text-white/80 mb-8 text-center max-w-2xl mx-auto">
            Răspunde la cele 10 întrebări pentru a descoperi stilul tău profesional și află cum îți poți
            transforma acest stil într-un avantaj competitiv.
          </p>
          
          <div className="tech-panel p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-electric-blue/5 blur-3xl"></div>
            <div className="relative z-10">
              {!showResult ? (
                <QuizContent 
                  question={quizQuestions[currentQuestion]}
                  currentIndex={currentQuestion}
                  totalQuestions={quizQuestions.length}
                  onAnswer={handleAnswer}
                />
              ) : (
                <QuizResult 
                  profile={profile!}
                  onRestart={restartQuiz}
                  onBecomePartner={navigateToBecomePartner}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ElectricianQuiz;
