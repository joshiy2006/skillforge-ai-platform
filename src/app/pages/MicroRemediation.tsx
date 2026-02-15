import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Target, BookOpen, Code, Play } from 'lucide-react';

const remediationContent: Record<string, any> = {
  Arrays: {
    miniLesson: 'Arrays store elements in contiguous memory. Key concepts: indexing (O(1)), searching (O(n)), insertion/deletion complexity varies by position.',
    problems: [
      { id: 1, question: 'What is the index of the first element in an array?', answer: '0' },
      { id: 2, question: 'If arr = [1,2,3], what is arr[1]?', answer: '2' },
      { id: 3, question: 'How do you find the length of an array arr?', answer: 'arr.length' },
    ],
    visualization: 'Array elements are stored sequentially: [0]→[1]→[2]→[3]',
  },
  Loops: {
    miniLesson: 'Loops repeat code execution. For loops: initialization, condition, increment. While loops: condition-based. Key: understand loop invariants and termination.',
    problems: [
      { id: 1, question: 'What keyword exits a loop early?', answer: 'break' },
      { id: 2, question: 'What keyword skips to next iteration?', answer: 'continue' },
      { id: 3, question: 'What happens if loop condition is always true?', answer: 'infinite loop' },
    ],
    visualization: 'Loop flow: Init → Condition → Body → Update → Repeat',
  },
  Recursion: {
    miniLesson: 'Recursion: function calls itself. Essential parts: base case (stops recursion) and recursive case. Call stack grows with each call.',
    problems: [
      { id: 1, question: 'What stops infinite recursion?', answer: 'base case' },
      { id: 2, question: 'What data structure tracks recursive calls?', answer: 'call stack' },
      { id: 3, question: 'Technique to optimize recursion?', answer: 'memoization' },
    ],
    visualization: 'f(n) → f(n-1) → f(n-2) → ... → base case',
  },
  'Dynamic Programming': {
    miniLesson: 'DP solves problems by storing subproblem results. Two approaches: top-down (memoization) and bottom-up (tabulation). Identifies overlapping subproblems.',
    problems: [
      { id: 1, question: 'DP stores results of what?', answer: 'subproblems' },
      { id: 2, question: 'Bottom-up DP approach is called?', answer: 'tabulation' },
      { id: 3, question: 'Top-down DP approach is called?', answer: 'memoization' },
    ],
    visualization: 'Break problem → Solve subproblems → Store results → Reuse',
  },
};

export const MicroRemediation: React.FC = () => {
  const { user, updateSkillGraph } = useApp();
  const [selectedConcept, setSelectedConcept] = useState('');
  const [currentProblem, setCurrentProblem] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [completed, setCompleted] = useState(false);

  if (!user) return null;

  const weakConcepts = user.skillGraph
    .filter(skill => skill.level < 50)
    .sort((a, b) => a.level - b.level);

  const content = selectedConcept ? remediationContent[selectedConcept] : null;

  const checkAnswer = () => {
    if (!content) return;
    
    const correctAnswer = content.problems[currentProblem].answer.toLowerCase();
    const userAnswer = answer.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      setFeedback('✓ Correct!');
      updateSkillGraph(selectedConcept, 8);
      
      setTimeout(() => {
        if (currentProblem < content.problems.length - 1) {
          setCurrentProblem(currentProblem + 1);
          setAnswer('');
          setFeedback('');
        } else {
          setCompleted(true);
        }
      }, 1500);
    } else {
      setFeedback('✗ Incorrect. Try again or review the lesson.');
      updateSkillGraph(selectedConcept, -2);
    }
  };

  if (!selectedConcept) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
            <Target className="size-10 text-orange-400" />
            Micro-Remediation
          </h1>
          <p className="text-gray-400 mb-8">
            Targeted content to fix specific gaps – No generic repetition
          </p>

          {weakConcepts.length === 0 ? (
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-12 text-center">
              <p className="text-gray-300 text-lg mb-4">Great job! No weak concepts detected.</p>
              <p className="text-gray-400">Complete more quizzes to continue improving.</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Weak Areas</h2>
              <div className="space-y-3">
                {weakConcepts.map(skill => (
                  <button
                    key={skill.concept}
                    onClick={() => {
                      setSelectedConcept(skill.concept);
                      setCurrentProblem(0);
                      setAnswer('');
                      setFeedback('');
                      setCompleted(false);
                    }}
                    className="w-full p-4 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 transition-all text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{skill.concept}</span>
                      <span className="text-orange-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-12 text-center">
            <div className="size-20 mx-auto mb-6 rounded-full bg-green-500/30 flex items-center justify-center">
              <Target className="size-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Remediation Complete!</h2>
            <p className="text-gray-300 mb-8">
              Great work! You've completed targeted practice for {selectedConcept}.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSelectedConcept('')}
                className="px-6 py-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 transition-all"
              >
                Choose Another Topic
              </button>
              <button
                onClick={() => window.location.href = '/quiz'}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all"
              >
                Test Your Knowledge
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Micro-Remediation: {selectedConcept}
        </h1>

        {/* Mini Lesson */}
        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <BookOpen className="size-5 text-blue-400" />
            Quick Review
          </h2>
          <p className="text-gray-300">{content?.miniLesson}</p>
        </div>

        {/* Visualization */}
        <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-6 mb-6">
          <h3 className="text-md font-semibold text-blue-400 mb-2">Concept Structure:</h3>
          <pre className="text-gray-300 font-mono text-sm">{content?.visualization}</pre>
        </div>

        {/* Practice Problem */}
        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Code className="size-5 text-green-400" />
              Practice Problem {currentProblem + 1} of {content?.problems.length}
            </h2>
          </div>
          
          <p className="text-gray-300 mb-4">{content?.problems[currentProblem].question}</p>
          
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            placeholder="Type your answer..."
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-500/30 text-white focus:outline-none focus:border-blue-500 mb-4"
          />
          
          {feedback && (
            <div className={`p-3 rounded-lg mb-4 ${
              feedback.includes('✓') 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {feedback}
            </div>
          )}
          
          <button
            onClick={checkAnswer}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all text-white font-medium"
          >
            Check Answer
          </button>
        </div>

        <button
          onClick={() => setSelectedConcept('')}
          className="text-blue-400 hover:text-blue-300"
        >
          ← Back to weak areas
        </button>
      </div>
    </div>
  );
};
