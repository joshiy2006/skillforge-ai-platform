import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';
import { Question, getNextQuestion, questionBank } from '../data/questions';
import { Brain, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

export const AdaptiveQuiz: React.FC = () => {
  const { user, addQuizResult, updateSkillGraph, lowBandwidthMode } = useApp();
  const navigate = useNavigate();

  const [selectedConcept, setSelectedConcept] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [performance, setPerformance] = useState<{ correct: boolean; timeTaken: number }[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [confidence, setConfidence] = useState<number>(3);

  const concepts = ['Arrays', 'Loops', 'Recursion', 'Dynamic Programming'];

  const startQuiz = () => {
    if (!selectedConcept) return;
    const firstQuestion = questionBank.find(q => q.concept === selectedConcept && q.difficulty === 'easy');
    setCurrentQuestion(firstQuestion || null);
    setStartTime(Date.now());
    setQuestionCount(0);
    setPerformance([]);
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    setShowResult(true);

    // Record performance
    const newPerformance = [...performance, { correct: isCorrect, timeTaken }];
    setPerformance(newPerformance);

    // Add to quiz history
    addQuizResult({
      questionId: currentQuestion.id,
      concept: currentQuestion.concept,
      difficulty: currentQuestion.difficulty,
      correct: isCorrect,
      timeSpent: timeTaken,
      confidence,
      timestamp: new Date().toISOString(),
    });

    // Update skill graph
    const performanceScore = isCorrect ? 5 : -3;
    updateSkillGraph(currentQuestion.concept, performanceScore);
  };

  const nextQuestion = () => {
    if (!currentQuestion) return;

    setQuestionCount(questionCount + 1);
    setShowResult(false);
    setSelectedAnswer(null);
    setConfidence(3);

    // Get adaptive next question
    const next = getNextQuestion(selectedConcept, currentDifficulty, performance);
    
    if (next) {
      setCurrentQuestion(next);
      setCurrentDifficulty(next.difficulty);
      setStartTime(Date.now());
    } else {
      // Quiz complete
      navigate('/cognitive-analysis');
    }

    if (questionCount >= 9) {
      // After 10 questions, go to analysis
      navigate('/cognitive-analysis');
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/10 border-green-500/30';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'hard': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-8">
            <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
              <Brain className="size-8 text-blue-400" />
              Adaptive Quiz
            </h1>
            <p className="text-gray-400 mb-8">
              Questions adapt to your understanding level in real-time
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Concept
                </label>
                <select
                  value={selectedConcept}
                  onChange={(e) => setSelectedConcept(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-500/30 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose a concept...</option>
                  {concepts.map(concept => (
                    <option key={concept} value={concept}>{concept}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={startQuiz}
                disabled={!selectedConcept}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-medium"
              >
                Start Quiz
              </button>
            </div>

            <div className="mt-8 p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">How it works:</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Answer 2 easy questions correctly and fast → move to medium</li>
                <li>✓ Struggle with medium → drop to easy</li>
                <li>✓ System tracks speed, accuracy, and hesitation</li>
                <li>✓ Complete 10 questions for full cognitive analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full border ${getDifficultyBg(currentQuestion.difficulty)}`}>
              <span className={`text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="size-5" />
              <span>Question {questionCount + 1}/10</span>
            </div>
          </div>
          {performance.length >= 2 && (
            <div className="flex items-center gap-2">
              {currentDifficulty === currentQuestion.difficulty ? (
                <span className="text-gray-400 text-sm">Same level</span>
              ) : currentDifficulty < currentQuestion.difficulty ? (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <TrendingUp className="size-4" />
                  <span>Level up!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-400 text-sm">
                  <TrendingDown className="size-4" />
                  <span>Adjusted</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Question Card */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-8 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrectness = showResult;

              let bgClass = 'bg-white/5 border-blue-500/30 hover:bg-white/10';
              if (showCorrectness) {
                if (isCorrect) {
                  bgClass = 'bg-green-500/20 border-green-500/50';
                } else if (isSelected && !isCorrect) {
                  bgClass = 'bg-red-500/20 border-red-500/50';
                }
              } else if (isSelected) {
                bgClass = 'bg-blue-500/20 border-blue-500/50';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${bgClass} ${
                    showResult ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-full flex items-center justify-center border ${
                      showCorrectness && isCorrect ? 'bg-green-500/30 border-green-500' :
                      showCorrectness && isSelected && !isCorrect ? 'bg-red-500/30 border-red-500' :
                      isSelected ? 'bg-blue-500/30 border-blue-500' : 'border-gray-500'
                    }`}>
                      {showCorrectness && isCorrect && <CheckCircle className="size-5 text-green-400" />}
                      {showCorrectness && isSelected && !isCorrect && <XCircle className="size-5 text-red-400" />}
                      {!showCorrectness && <span className="text-gray-400">{String.fromCharCode(65 + index)}</span>}
                    </div>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <p className={`font-medium mb-2 ${
                selectedAnswer === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-gray-300 text-sm">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* Confidence & Actions */}
        {!showResult && selectedAnswer !== null && (
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6 mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              How confident are you? (Optional)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setConfidence(level)}
                  className={`flex-1 py-2 rounded-lg border transition-all ${
                    confidence === level
                      ? 'bg-blue-500/30 border-blue-500 text-blue-400'
                      : 'bg-white/5 border-blue-500/30 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">1 = Guessed, 5 = Very sure</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          {!showResult ? (
            <button
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-medium"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all text-white font-medium"
            >
              {questionCount >= 9 ? 'View Cognitive Analysis' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
