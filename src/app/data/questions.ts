export interface Question {
  id: string;
  concept: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const questionBank: Question[] = [
  // Arrays - Easy
  {
    id: 'arr_easy_1',
    concept: 'Arrays',
    difficulty: 'easy',
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correctAnswer: 0,
    explanation: 'Array access by index is O(1) because arrays store elements in contiguous memory locations.',
  },
  {
    id: 'arr_easy_2',
    concept: 'Arrays',
    difficulty: 'easy',
    question: 'Which operation on an array has O(n) time complexity?',
    options: ['Accessing by index', 'Searching for an element', 'Getting array length', 'None of the above'],
    correctAnswer: 1,
    explanation: 'Searching for an element requires checking each element in the worst case, resulting in O(n) complexity.',
  },

  // Arrays - Medium
  {
    id: 'arr_med_1',
    concept: 'Arrays',
    difficulty: 'medium',
    question: 'What is the optimal time complexity for finding two numbers that sum to a target?',
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
    correctAnswer: 2,
    explanation: 'Using a hash map, we can solve the two-sum problem in O(n) time with one pass.',
  },
  {
    id: 'arr_med_2',
    concept: 'Arrays',
    difficulty: 'medium',
    question: 'In a rotated sorted array, what is the time complexity to find the minimum element?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1,
    explanation: 'Binary search can be used to find the rotation point in O(log n) time.',
  },

  // Arrays - Hard
  {
    id: 'arr_hard_1',
    concept: 'Arrays',
    difficulty: 'hard',
    question: 'What is the space complexity of the optimal solution for the "Trapping Rain Water" problem?',
    options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
    correctAnswer: 0,
    explanation: 'Using the two-pointer technique, we can solve it in O(1) extra space.',
  },

  // Loops - Easy
  {
    id: 'loop_easy_1',
    concept: 'Loops',
    difficulty: 'easy',
    question: 'What will a for loop do if the condition is false from the start?',
    options: ['Run once', 'Not run at all', 'Throw an error', 'Run infinitely'],
    correctAnswer: 1,
    explanation: 'If the loop condition is false initially, the loop body never executes.',
  },
  {
    id: 'loop_easy_2',
    concept: 'Loops',
    difficulty: 'easy',
    question: 'Which keyword is used to exit a loop early?',
    options: ['continue', 'break', 'return', 'exit'],
    correctAnswer: 1,
    explanation: 'The break keyword immediately terminates the loop.',
  },

  // Loops - Medium
  {
    id: 'loop_med_1',
    concept: 'Loops',
    difficulty: 'medium',
    question: 'What is the time complexity of nested loops iterating n times each?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2n)'],
    correctAnswer: 2,
    explanation: 'Nested loops result in n × n iterations, giving O(n²) complexity.',
  },

  // Recursion - Easy
  {
    id: 'rec_easy_1',
    concept: 'Recursion',
    difficulty: 'easy',
    question: 'What is the base case in recursion?',
    options: ['The recursive call', 'The condition to stop recursion', 'The first function call', 'The return statement'],
    correctAnswer: 1,
    explanation: 'The base case is the condition that stops the recursion to prevent infinite calls.',
  },

  // Recursion - Medium
  {
    id: 'rec_med_1',
    concept: 'Recursion',
    difficulty: 'medium',
    question: 'What is the space complexity of a recursive function with depth n?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 2,
    explanation: 'Each recursive call adds a frame to the call stack, resulting in O(n) space complexity.',
  },
  {
    id: 'rec_med_2',
    concept: 'Recursion',
    difficulty: 'medium',
    question: 'What technique can optimize recursive Fibonacci calculation?',
    options: ['Iteration', 'Memoization', 'Binary search', 'Sorting'],
    correctAnswer: 1,
    explanation: 'Memoization caches results to avoid redundant calculations in recursive Fibonacci.',
  },

  // Recursion - Hard
  {
    id: 'rec_hard_1',
    concept: 'Recursion',
    difficulty: 'hard',
    question: 'What is tail recursion?',
    options: [
      'Recursion at the end of a function',
      'Recursion where the recursive call is the last operation',
      'Recursion with multiple base cases',
      'Recursion without a base case'
    ],
    correctAnswer: 1,
    explanation: 'Tail recursion occurs when the recursive call is the last operation, allowing optimization.',
  },

  // Dynamic Programming - Easy
  {
    id: 'dp_easy_1',
    concept: 'Dynamic Programming',
    difficulty: 'easy',
    question: 'What is the main principle of dynamic programming?',
    options: ['Divide and conquer', 'Storing results of subproblems', 'Greedy choice', 'Backtracking'],
    correctAnswer: 1,
    explanation: 'DP stores results of subproblems to avoid redundant computation.',
  },

  // Dynamic Programming - Medium
  {
    id: 'dp_med_1',
    concept: 'Dynamic Programming',
    difficulty: 'medium',
    question: 'What is the time complexity of the classic DP solution for 0/1 Knapsack?',
    options: ['O(n)', 'O(n log n)', 'O(n × W)', 'O(2ⁿ)'],
    correctAnswer: 2,
    explanation: 'The DP solution for 0/1 Knapsack has O(n × W) time where n is items and W is capacity.',
  },

  // Dynamic Programming - Hard
  {
    id: 'dp_hard_1',
    concept: 'Dynamic Programming',
    difficulty: 'hard',
    question: 'What is the optimal time complexity for the Longest Increasing Subsequence problem?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
    correctAnswer: 1,
    explanation: 'Using binary search with DP, LIS can be solved in O(n log n) time.',
  },
];

export function getNextQuestion(
  concept: string,
  currentDifficulty: 'easy' | 'medium' | 'hard',
  recentPerformance: { correct: boolean; timeTaken: number }[]
): Question | null {
  // Adaptive algorithm
  let targetDifficulty = currentDifficulty;

  if (recentPerformance.length >= 2) {
    const lastTwo = recentPerformance.slice(-2);
    const allCorrect = lastTwo.every(p => p.correct);
    const allFast = lastTwo.every(p => p.timeTaken < 15); // Under 15 seconds
    const anyWrong = lastTwo.some(p => !p.correct);

    if (allCorrect && allFast) {
      // Move up difficulty
      if (currentDifficulty === 'easy') targetDifficulty = 'medium';
      else if (currentDifficulty === 'medium') targetDifficulty = 'hard';
    } else if (anyWrong) {
      // Move down difficulty
      if (currentDifficulty === 'hard') targetDifficulty = 'medium';
      else if (currentDifficulty === 'medium') targetDifficulty = 'easy';
    }
  }

  // Get available questions
  const availableQuestions = questionBank.filter(
    q => q.concept === concept && q.difficulty === targetDifficulty
  );

  if (availableQuestions.length === 0) {
    // Fallback to any difficulty for the concept
    const fallbackQuestions = questionBank.filter(q => q.concept === concept);
    return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)] || null;
  }

  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
}
