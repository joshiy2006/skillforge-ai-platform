import React from 'react';
import { Link } from 'react-router';
import { Brain, Target, Lightbulb, Code, MessageSquare, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const Home: React.FC = () => {
  const { lowBandwidthMode } = useApp();

  const features = [
    {
      icon: Target,
      title: 'Adaptive Quiz System',
      description: 'Questions that adapt to your understanding level in real-time',
    },
    {
      icon: Brain,
      title: 'Cognitive Analysis',
      description: 'AI detects if you guessed or truly understood concepts',
    },
    {
      icon: Lightbulb,
      title: 'Interactive Concepts',
      description: 'Learn through interactive visualizations, not just syntax',
    },
    {
      icon: Code,
      title: 'Build Mode',
      description: 'Convert code to flowcharts and mindmaps instantly',
    },
    {
      icon: MessageSquare,
      title: 'Multilingual Support',
      description: 'Ask doubts in English, Hinglish, Hindi, or Tamil',
    },
    {
      icon: Rocket,
      title: 'Interview Simulation',
      description: 'Real-time coding interviews with feedback',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {lowBandwidthMode ? (
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SkillForge AI
            </h1>
          ) : (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              SkillForge AI
            </motion.h1>
          )}

          {lowBandwidthMode ? (
            <>
              <p className="text-xl sm:text-2xl text-gray-300 mb-4">
                Adaptive Cognitive Learning Platform
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
                Not an answer engine. A Cognitive Intelligence System that diagnoses how you think,
                adapts learning paths, and structures your skill growth.
              </p>
            </>
          ) : (
            <>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl sm:text-2xl text-gray-300 mb-4"
              >
                Adaptive Cognitive Learning Platform
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto"
              >
                Not an answer engine. A Cognitive Intelligence System that diagnoses how you think,
                adapts learning paths, and structures your skill growth.
              </motion.p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all text-white text-lg font-medium shadow-lg shadow-blue-500/30"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white text-lg font-medium border border-white/20 backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Glow Effect */}
        {!lowBandwidthMode && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10" />
        )}
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">
          Core Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              lowBandwidth={lowBandwidthMode}
            />
          ))}
        </div>
      </div>

      {/* Identity Statement */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-8 sm:p-12 backdrop-blur-sm">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
            A Cognitive Intelligence System
          </h3>
          <div className="space-y-3 text-gray-300">
            <p>✓ Diagnoses how users think</p>
            <p>✓ Adapts learning paths in real-time</p>
            <p>✓ Simulates real interviews</p>
            <p>✓ Structures skill growth systematically</p>
            <p>✓ Visualizes logic interactively</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
  lowBandwidth: boolean;
}> = ({ icon: Icon, title, description, index, lowBandwidth }) => {
  const content = (
    <div className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-sm group">
      <Icon className="size-12 text-blue-400 mb-4 group-hover:text-cyan-400 transition-colors" />
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );

  if (lowBandwidth) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {content}
    </motion.div>
  );
};
