import React, { useState } from 'react';
import { Compass, TrendingUp, BookOpen, Code, Award } from 'lucide-react';

interface RoadmapPhase {
  phase: string;
  skills: string[];
  resources: string[];
  duration: string;
}

export const CareerRoadmap: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);

  const generateRoadmap = () => {
    if (!goal.trim()) return;

    const roadmaps: Record<string, RoadmapPhase[]> = {
      'frontend': [
        {
          phase: 'Foundation (2-3 months)',
          skills: ['HTML5 & CSS3', 'JavaScript ES6+', 'Responsive Design', 'Git & GitHub'],
          resources: ['MDN Web Docs', 'freeCodeCamp', 'JavaScript.info'],
          duration: '2-3 months',
        },
        {
          phase: 'Framework Mastery (3-4 months)',
          skills: ['React.js', 'State Management (Redux)', 'API Integration', 'Component Design'],
          resources: ['React Official Docs', 'React Router', 'Redux Toolkit'],
          duration: '3-4 months',
        },
        {
          phase: 'Advanced & Tools (2-3 months)',
          skills: ['TypeScript', 'Testing (Jest, RTL)', 'Build Tools (Webpack, Vite)', 'Performance Optimization'],
          resources: ['TypeScript Handbook', 'Testing Library', 'Web.dev'],
          duration: '2-3 months',
        },
        {
          phase: 'Production Ready (2 months)',
          skills: ['CI/CD', 'Deployment', 'SEO', 'Accessibility (a11y)', 'Portfolio Projects'],
          resources: ['Vercel', 'Netlify', 'Real-world projects'],
          duration: '2 months',
        },
      ],
      'backend': [
        {
          phase: 'Core Fundamentals (2-3 months)',
          skills: ['Node.js', 'Express.js', 'REST API Design', 'Authentication (JWT)'],
          resources: ['Node.js Docs', 'Express Guide', 'REST API Best Practices'],
          duration: '2-3 months',
        },
        {
          phase: 'Database & Storage (3 months)',
          skills: ['SQL (PostgreSQL)', 'NoSQL (MongoDB)', 'ORM (Prisma)', 'Database Design'],
          resources: ['PostgreSQL Tutorial', 'MongoDB University', 'Database Design Course'],
          duration: '3 months',
        },
        {
          phase: 'Advanced Backend (3-4 months)',
          skills: ['Microservices', 'Message Queues', 'Caching (Redis)', 'GraphQL'],
          resources: ['Microservices.io', 'Redis University', 'GraphQL Docs'],
          duration: '3-4 months',
        },
        {
          phase: 'DevOps & Deployment (2 months)',
          skills: ['Docker', 'Kubernetes', 'AWS/Cloud', 'Monitoring & Logging'],
          resources: ['Docker Docs', 'Kubernetes Basics', 'AWS Free Tier'],
          duration: '2 months',
        },
      ],
      'fullstack': [
        {
          phase: 'Frontend Basics (3 months)',
          skills: ['HTML/CSS/JS', 'React.js', 'State Management', 'Responsive Design'],
          resources: ['React Docs', 'Tailwind CSS', 'MDN'],
          duration: '3 months',
        },
        {
          phase: 'Backend Basics (3 months)',
          skills: ['Node.js', 'Express', 'REST APIs', 'Authentication'],
          resources: ['Node Docs', 'JWT.io', 'Passport.js'],
          duration: '3 months',
        },
        {
          phase: 'Database & Integration (2 months)',
          skills: ['SQL/NoSQL', 'API Integration', 'State Sync', 'Real-time (WebSockets)'],
          resources: ['MongoDB', 'PostgreSQL', 'Socket.io'],
          duration: '2 months',
        },
        {
          phase: 'Production & Deployment (2 months)',
          skills: ['Testing', 'CI/CD', 'Cloud Deployment', 'Full-stack Projects'],
          resources: ['Jest', 'GitHub Actions', 'Vercel/Heroku'],
          duration: '2 months',
        },
      ],
      'data': [
        {
          phase: 'Programming Foundation (2 months)',
          skills: ['Python', 'Data Structures', 'Algorithms', 'Math/Statistics'],
          resources: ['Python.org', 'LeetCode', 'Khan Academy Stats'],
          duration: '2 months',
        },
        {
          phase: 'Data Analysis (3-4 months)',
          skills: ['Pandas', 'NumPy', 'Data Visualization (Matplotlib)', 'SQL'],
          resources: ['Pandas Docs', 'Kaggle', 'Mode Analytics SQL'],
          duration: '3-4 months',
        },
        {
          phase: 'Machine Learning (4-5 months)',
          skills: ['Scikit-learn', 'ML Algorithms', 'Model Training', 'Feature Engineering'],
          resources: ['Coursera ML', 'Scikit-learn', 'Fast.ai'],
          duration: '4-5 months',
        },
        {
          phase: 'Specialization (3-4 months)',
          skills: ['Deep Learning (TensorFlow/PyTorch)', 'NLP or Computer Vision', 'Deployment'],
          resources: ['TensorFlow', 'PyTorch', 'Hugging Face'],
          duration: '3-4 months',
        },
      ],
    };

    const goalLower = goal.toLowerCase();
    let matchedRoadmap: RoadmapPhase[] = [];

    if (goalLower.includes('frontend') || goalLower.includes('front-end') || goalLower.includes('react')) {
      matchedRoadmap = roadmaps.frontend;
    } else if (goalLower.includes('backend') || goalLower.includes('back-end') || goalLower.includes('node')) {
      matchedRoadmap = roadmaps.backend;
    } else if (goalLower.includes('fullstack') || goalLower.includes('full-stack') || goalLower.includes('full stack')) {
      matchedRoadmap = roadmaps.fullstack;
    } else if (goalLower.includes('data') || goalLower.includes('ml') || goalLower.includes('machine learning')) {
      matchedRoadmap = roadmaps.data;
    } else {
      // Default to fullstack
      matchedRoadmap = roadmaps.fullstack;
    }

    setRoadmap(matchedRoadmap);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
          <Compass className="size-10 text-purple-400" />
          Career Roadmap Generator
        </h1>
        <p className="text-gray-400 mb-8">
          Get a personalized learning path based on your career goals
        </p>

        {roadmap.length === 0 ? (
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-8">
            <h2 className="text-xl font-bold text-white mb-6">What do you want to become?</h2>
            
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateRoadmap()}
              placeholder="e.g., Frontend Developer, Backend Engineer, Full-stack Developer, Data Scientist"
              className="w-full px-4 py-4 rounded-lg bg-white/5 border border-blue-500/30 text-white text-lg focus:outline-none focus:border-blue-500 mb-6"
            />

            <button
              onClick={generateRoadmap}
              disabled={!goal.trim()}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-medium text-lg"
            >
              Generate Roadmap
            </button>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <h3 className="text-blue-400 font-semibold mb-2">Popular Paths:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Frontend Developer</li>
                  <li>• Backend Developer</li>
                  <li>• Full-stack Developer</li>
                  <li>• Data Scientist</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <h3 className="text-purple-400 font-semibold mb-2">What You Get:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Phase-based learning path</li>
                  <li>• Skill breakdown</li>
                  <li>• Resource recommendations</li>
                  <li>• Estimated timeline</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Your Roadmap: {goal}</h2>
              <p className="text-gray-300">
                Total Estimated Time: {roadmap.reduce((sum, phase) => {
                  const months = parseInt(phase.duration.split('-')[1] || phase.duration);
                  return sum + months;
                }, 0)} months
              </p>
            </div>

            <div className="space-y-6">
              {roadmap.map((phase, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{phase.phase}</h3>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                          <Code className="size-4" />
                          Skills to Learn:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                          <BookOpen className="size-4" />
                          Resources:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.resources.map((resource, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  setGoal('');
                  setRoadmap([]);
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-blue-500/30 text-white transition-all"
              >
                Generate Another Roadmap
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
