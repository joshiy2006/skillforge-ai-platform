import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Editor from '@monaco-editor/react';
import { Clock, Play, CheckCircle, AlertCircle, Zap, Code2 } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'medium';
  exampleInput: string;
  exampleOutput: string;
  testCases: { input: any; expected: any }[];
  starterCode: string;
}

const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'medium',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. You may assume each input has exactly one solution.',
    exampleInput: 'nums = [2,7,11,15], target = 9',
    exampleOutput: '[0,1]',
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
    ],
    starterCode: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'medium',
    description: 'Write a function that reverses a string. The input string is given as an array of characters.',
    exampleInput: 's = ["h","e","l","l","o"]',
    exampleOutput: '["o","l","l","e","h"]',
    testCases: [
      { input: { s: ['h', 'e', 'l', 'l', 'o'] }, expected: ['o', 'l', 'l', 'e', 'h'] },
      { input: { s: ['H', 'a', 'n', 'n', 'a', 'h'] }, expected: ['h', 'a', 'n', 'n', 'a', 'H'] },
    ],
    starterCode: `function reverseString(s) {
  // Write your solution here
  
}`,
  },
];

export const InterviewSimulation: React.FC = () => {
  const { user, updateSkillGraph } = useApp();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [code, setCode] = useState('');
  const [problem, setProblem] = useState<Problem>(problems[0]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (started && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, submitted]);

  useEffect(() => {
    setCode(problem.starterCode);
  }, [problem]);

  const startInterview = () => {
    setStarted(true);
    setTimeElapsed(0);
    setSubmitted(false);
    setResults(null);
    setCode(problem.starterCode);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const evaluateCode = () => {
    try {
      // Extract function name and execute tests
      const funcMatch = code.match(/function\s+(\w+)/);
      if (!funcMatch) {
        throw new Error('No function found in code');
      }

      // Create function from code
      // eslint-disable-next-line no-new-func
      const userFunc = new Function(`return ${code}`)();

      const testResults = problem.testCases.map((testCase, index) => {
        try {
          const result = userFunc(...Object.values(testCase.input));
          const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
          return {
            index: index + 1,
            passed,
            input: testCase.input,
            expected: testCase.expected,
            output: result,
          };
        } catch (error: any) {
          return {
            index: index + 1,
            passed: false,
            input: testCase.input,
            expected: testCase.expected,
            output: null,
            error: error.message,
          };
        }
      });

      const allPassed = testResults.every(t => t.passed);
      const passedCount = testResults.filter(t => t.passed).length;

      // Analyze code quality
      const codeLines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//')).length;
      const hasComments = code.includes('//') || code.includes('/*');
      const complexity = analyzeComplexity(code);

      const feedback = generateFeedback({
        allPassed,
        passedCount,
        totalTests: testResults.length,
        timeElapsed,
        codeLines,
        hasComments,
        complexity,
      });

      setResults({
        testResults,
        allPassed,
        passedCount,
        feedback,
      });

      setSubmitted(true);

      // Update skill graph
      if (allPassed) {
        updateSkillGraph('Problem Solving', 10);
      } else {
        updateSkillGraph('Problem Solving', -5);
      }
    } catch (error: any) {
      setResults({
        testResults: [],
        allPassed: false,
        passedCount: 0,
        feedback: {
          correctness: 'Code has syntax errors',
          timeAnalysis: 'Could not evaluate',
          codeStructure: 'Please check your code for errors',
          optimization: error.message,
          pattern: 'error',
        },
      });
      setSubmitted(true);
    }
  };

  const analyzeComplexity = (code: string): 'O(1)' | 'O(n)' | 'O(n²)' | 'O(log n)' => {
    const nestedLoops = (code.match(/for\s*\(/g) || []).length >= 2;
    const hasLoop = code.includes('for') || code.includes('while');
    const hasBinarySearch = code.includes('/ 2') || code.includes('>> 1');

    if (nestedLoops) return 'O(n²)';
    if (hasBinarySearch) return 'O(log n)';
    if (hasLoop) return 'O(n)';
    return 'O(1)';
  };

  const generateFeedback = (analysis: any) => {
    const feedback: any = {};

    // Correctness
    if (analysis.allPassed) {
      feedback.correctness = `✓ All test cases passed (${analysis.passedCount}/${analysis.totalTests})`;
    } else {
      feedback.correctness = `${analysis.passedCount}/${analysis.totalTests} test cases passed. Review edge cases.`;
    }

    // Time Analysis
    if (analysis.timeElapsed < 300) {
      feedback.timeAnalysis = `Excellent time management (${formatTime(analysis.timeElapsed)})`;
    } else if (analysis.timeElapsed < 600) {
      feedback.timeAnalysis = `Good timing (${formatTime(analysis.timeElapsed)}). Could be faster with practice.`;
    } else {
      feedback.timeAnalysis = `Took ${formatTime(analysis.timeElapsed)}. Consider time complexity optimization.`;
    }

    // Code Structure
    if (analysis.hasComments) {
      feedback.codeStructure = 'Good: Code includes explanatory comments';
    } else {
      feedback.codeStructure = 'Consider adding comments to explain logic';
    }

    // Optimization
    feedback.optimization = `Detected complexity: ${analysis.complexity}. ${
      analysis.complexity === 'O(n²)' ? 'Consider optimizing to O(n) if possible' :
      analysis.complexity === 'O(n)' ? 'Linear time is generally good' :
      'Excellent time complexity'
    }`;

    // Pattern Classification
    if (analysis.allPassed && analysis.timeElapsed < 300) {
      feedback.pattern = 'Strong problem solver with good time management';
    } else if (analysis.allPassed) {
      feedback.pattern = 'Methodical thinker - takes time but gets correct solutions';
    } else if (analysis.timeElapsed < 300) {
      feedback.pattern = 'Fast but needs to focus on edge cases and correctness';
    } else {
      feedback.pattern = 'Need more practice with similar problems';
    }

    return feedback;
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-8">
            <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
              <Code2 className="size-8 text-blue-400" />
              Interview Simulation
            </h1>
            <p className="text-gray-400 mb-8">
              Real-time coding interview with instant feedback and pattern analysis
            </p>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <h2 className="text-xl font-semibold text-white mb-4">How It Works:</h2>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Timer starts when you begin</li>
                  <li>✓ Solve medium-level coding problem</li>
                  <li>✓ Write code in built-in editor</li>
                  <li>✓ Submit for instant evaluation</li>
                  <li>✓ Get detailed feedback on:</li>
                  <ul className="ml-8 space-y-1 text-sm text-gray-400 mt-2">
                    <li>- Correctness (test cases)</li>
                    <li>- Time complexity</li>
                    <li>- Code structure</li>
                    <li>- Thinking pattern</li>
                    <li>- Optimization opportunities</li>
                  </ul>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Problem
                </label>
                <select
                  value={problem.id}
                  onChange={(e) => setProblem(problems.find(p => p.id === e.target.value) || problems[0])}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-500/30 text-white focus:outline-none focus:border-blue-500"
                >
                  {problems.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={startInterview}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all text-white font-medium flex items-center justify-center gap-2"
              >
                <Play className="size-5" />
                Start Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2">
              <Clock className="size-5 text-yellow-400" />
              <span className="text-yellow-400 font-mono">{formatTime(timeElapsed)}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
              {problem.difficulty.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Problem</h2>
              <p className="text-gray-300 mb-4">{problem.description}</p>
              
              <h3 className="text-md font-semibold text-white mb-2">Example:</h3>
              <div className="bg-black/30 rounded-lg p-3 mb-2">
                <p className="text-sm text-gray-400">Input: {problem.exampleInput}</p>
                <p className="text-sm text-gray-400">Output: {problem.exampleOutput}</p>
              </div>
            </div>

            {submitted && results && (
              <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  {results.allPassed ? (
                    <CheckCircle className="size-6 text-green-400" />
                  ) : (
                    <AlertCircle className="size-6 text-red-400" />
                  )}
                  Results
                </h2>

                {/* Test Cases */}
                <div className="space-y-2 mb-4">
                  {results.testResults.map((test: any) => (
                    <div
                      key={test.index}
                      className={`p-3 rounded-lg border ${
                        test.passed
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
                          Test Case {test.index}
                        </span>
                        <span className="text-sm">{test.passed ? '✓ Passed' : '✗ Failed'}</span>
                      </div>
                      {!test.passed && (
                        <div className="text-xs text-gray-400 mt-2">
                          <p>Expected: {JSON.stringify(test.expected)}</p>
                          <p>Got: {test.output ? JSON.stringify(test.output) : 'Error'}</p>
                          {test.error && <p className="text-red-400 mt-1">Error: {test.error}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                <div className="space-y-3">
                  <h3 className="text-md font-semibold text-white">Feedback:</h3>
                  
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-sm font-medium text-blue-400 mb-1">Correctness</p>
                    <p className="text-sm text-gray-300">{results.feedback.correctness}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-sm font-medium text-blue-400 mb-1">Time Management</p>
                    <p className="text-sm text-gray-300">{results.feedback.timeAnalysis}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-sm font-medium text-blue-400 mb-1">Code Quality</p>
                    <p className="text-sm text-gray-300">{results.feedback.codeStructure}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-sm font-medium text-blue-400 mb-1">Optimization</p>
                    <p className="text-sm text-gray-300">{results.feedback.optimization}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-sm font-medium text-purple-400 mb-1 flex items-center gap-2">
                      <Zap className="size-4" />
                      Thinking Pattern
                    </p>
                    <p className="text-sm text-gray-300">{results.feedback.pattern}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStarted(false);
                    setSubmitted(false);
                    setResults(null);
                    setTimeElapsed(0);
                  }}
                  className="w-full mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all text-white font-medium"
                >
                  Try Another Problem
                </button>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Code Editor</h2>
            <div className="border border-blue-500/30 rounded-lg overflow-hidden mb-4">
              <Editor
                height="500px"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
            <button
              onClick={evaluateCode}
              disabled={submitted}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-medium"
            >
              Submit Solution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
