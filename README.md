# SkillForge AI - Adaptive Cognitive Learning Platform

A fully functional, multi-page adaptive learning platform that diagnoses how users think, adapts learning paths, simulates real interviews, and structures skill growth systematically.

## 🎯 Core Features

### 1. **Authentication System** (Fully Functional)
- Sign Up with validation and password strength indicator
- Login with remember me functionality
- JWT-like session management using localStorage
- Protected routes for authenticated users

### 2. **Dashboard** (Real Analytics)
- Live skill graph visualization (Radar Chart)
- Weakest concept identification
- Recent quiz activity tracking
- Cognitive profile metrics display
- Quick action buttons

### 3. **Adaptive Quiz System** (Dynamic Difficulty)
- Questions adapt based on:
  - Answer accuracy
  - Response time
  - Consecutive mistakes
- **Algorithm Logic:**
  - 2 correct + fast → move to medium
  - Wrong answer → drop difficulty
  - Slow but correct → flag hesitation
- Tracks: concept, time, correctness, confidence
- Real-time difficulty adjustment

### 4. **Cognitive Analysis** (AI-Powered Insights)
- **Pattern Detection:**
  - Fast + incorrect → Impulsive
  - Slow + correct → Conceptual hesitation
  - Low confidence + correct → Guessing pattern
- **Visualizations:**
  - Speed vs Accuracy scatter plot
  - Performance trend line chart
  - Pattern classification scores
- **Feedback System:**
  - Correctness analysis
  - Time management insights
  - Code quality assessment
  - Optimization recommendations

### 5. **Micro-Remediation** (Targeted Learning)
- Identifies weakest concepts from skill graph
- Provides mini-lessons for specific gaps
- 2-3 targeted practice problems
- Quick re-evaluation quiz
- Updates skill graph based on performance

### 6. **Interactive Concept Page** (Parameter Manipulation)
- **Topics:**
  - Array Indexing (visual array demonstration)
  - Loop Iteration (animated execution)
  - Binary Search (step-by-step visualization)
  - Time Complexity (O(1), O(n), O(log n), O(n²))
- Real-time parameter adjustment
- Visual updates on change
- Concept explanations

### 7. **Concept Visualizer** (3D Interactive)
- **Technologies:** Three.js + React Three Fiber
- **Visualizations:**
  - Quadratic functions (3D parabolas)
  - Array structures (3D bar charts)
- Parameter sliders for real-time changes
- Orbit controls for 360° viewing
- Automatically disabled in low bandwidth mode

### 8. **Build Mode** (Code → Flowchart Generator)
- **Features:**
  - Paste code → Generate flowchart
  - Detects: loops, conditions, functions, recursion
  - Interactive SVG flowchart (click nodes for explanations)
  - Code → Mindmap option
- **Technologies:** Mermaid.js
- **Detected Elements:**
  - If/Else conditions
  - For/While loops
  - Function declarations
  - Variable assignments
  - Return statements

### 9. **Interview Simulation** (Real Coding Environment)
- **Features:**
  - Monaco Editor (VS Code engine)
  - Timer with real-time tracking
  - Multiple test cases
  - Code execution and evaluation
- **Feedback Provided:**
  - Correctness (test case results)
  - Time management analysis
  - Code structure assessment
  - Complexity detection (O notation)
  - Thinking pattern classification
  - Edge case coverage

### 10. **Career Roadmap Generator** (Personalized Paths)
- Input career goal (Frontend, Backend, Full-stack, Data Science)
- **Generated Roadmap Includes:**
  - Phase-based learning structure
  - Skills breakdown per phase
  - Resource recommendations
  - Estimated timeline
- Adjusts based on user's skill graph

### 11. **Multilingual Bot** (Context-Aware)
- **Supported Languages:**
  - English
  - Hindi (Devanagari script)
  - Tamil (Tamil script)
  - Hinglish (Latin script)
- Auto-detects language from input
- Context-aware responses about:
  - Arrays, Loops, Recursion
  - Time Complexity
  - Programming concepts
- Stores doubt history with topic mapping

### 12. **Low Bandwidth Mode** (Performance Toggle)
- Disables heavy animations (Motion/Framer Motion)
- Disables 3D rendering (Three.js)
- Uses static lightweight SVG
- Reduces API polling
- Lazy loads images
- **Actually reduces resource usage**

## 🛠 Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Multi-page navigation
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Motion** (Framer Motion) - Animations
- **Recharts** - Data visualization
- **Three.js + React Three Fiber** - 3D graphics
- **Monaco Editor** - Code editor
- **Mermaid.js** - Flowchart generation

### State Management
- React Context API
- localStorage for persistence

### Data Storage
- localStorage (frontend-only implementation)
- User profiles, quiz history, cognitive data

## 📊 Data Structures

### User Profile
```typescript
{
  id: string;
  name: string;
  email: string;
  mobile: string;
  skillGraph: SkillData[];
  cognitiveProfile: CognitiveProfile;
  quizHistory: QuizResult[];
}
```

### Cognitive Profile
```typescript
{
  averageSpeed: number;
  averageAccuracy: number;
  guessPattern: number; // 0-1
  hesitationScore: number; // 0-1
  impulsivityIndex: number; // 0-1
}
```

### Quiz Result
```typescript
{
  questionId: string;
  concept: string;
  difficulty: 'easy' | 'medium' | 'hard';
  correct: boolean;
  timeSpent: number;
  confidence?: number; // 1-5
  timestamp: string;
}
```

## 🎨 Design Features

### Theme
- Dark AI futuristic theme
- Electric blue (#3b82f6) accents
- Glassmorphism cards
- Soft glow effects
- Smooth transitions
- Scroll animations

### Responsive Design
- Desktop optimized
- Tablet support
- Mobile responsive
- Fluid typography
- Adaptive layouts

## 🚀 Key Algorithms

### Adaptive Quiz Algorithm
```typescript
if (lastTwo.allCorrect && lastTwo.allFast) {
  difficulty = increaseLevel(currentDifficulty);
} else if (lastTwo.anyWrong) {
  difficulty = decreaseLevel(currentDifficulty);
}
```

### Cognitive Pattern Detection
```typescript
// Impulsivity
if (fastIncorrect >= 3) → impulsive pattern

// Hesitation
if (slowCorrect >= 3) → conceptual uncertainty

// Guessing
if (lowConfidenceCorrect >= 2) → lucky guesses
```

### Interview Code Evaluation
```typescript
// Complexity Detection
nestedLoops → O(n²)
singleLoop → O(n)
binarySearch → O(log n)
noLoop → O(1)
```

## 📱 Pages Overview

1. **Home** - Landing page with features
2. **Sign Up** - User registration
3. **Login** - Authentication
4. **Dashboard** - User analytics hub
5. **Interactive Concept** - Parameter-driven learning
6. **Adaptive Quiz** - Dynamic difficulty questions
7. **Cognitive Analysis** - Performance insights
8. **Micro-Remediation** - Targeted practice
9. **Concept Visualizer** - 3D interactive visuals
10. **Build Mode** - Code to flowchart
11. **Interview Simulation** - Coding practice with feedback
12. **Career Roadmap** - Learning path generator
13. **Multilingual Bot** - Multi-language support

## 🔥 Core Philosophy

**SkillForge AI is NOT an answer engine.**

It is a **Cognitive Intelligence System** that:
- ✅ Diagnoses how users think
- ✅ Adapts learning paths in real-time
- ✅ Simulates real interviews
- ✅ Structures skill growth systematically
- ✅ Visualizes logic interactively

## 💾 Local Storage Schema

### Keys Used
- `skillforge_user` - Current logged-in user
- `skillforge_users` - All registered users (array)
- `skillforge_low_bandwidth` - Bandwidth mode preference

## 🎯 Production Features

All core features are **fully functional MVP implementations**:
- ✅ Real authentication with validation
- ✅ Real adaptive quiz logic with difficulty adjustment
- ✅ Real code-to-flowchart generation
- ✅ Real interview simulation with Monaco editor
- ✅ Real roadmap generation system
- ✅ Real 3D concept visualizations
- ✅ Real cognitive analysis with pattern detection
- ✅ Real multilingual language detection

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📄 License

Built for educational purposes as part of the SkillForge AI platform.

---

**Note:** This is a frontend-only implementation using localStorage for data persistence. For production use, integrate with a real backend (Node.js, Firebase, Supabase, etc.) for secure authentication and data storage.
