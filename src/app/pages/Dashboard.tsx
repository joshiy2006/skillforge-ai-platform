import React from 'react';
import { Link } from 'react-router';
import { useApp } from '../context/AppContext';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Brain, Target, Code, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { user, lowBandwidthMode } = useApp();

  if (!user) return null;

  const skillGraphData = user.skillGraph.map(skill => ({
    subject: skill.concept,
    level: skill.level,
    fullMark: 100,
  }));

  const weakestConcept = user.skillGraph.reduce((min, skill) => 
    skill.level < min.level ? skill : min
  );

  const recentQuizzes = user.quizHistory.slice(-5).reverse();

  const stats = [
    {
      icon: Target,
      label: 'Average Accuracy',
      value: `${Math.round(user.cognitiveProfile.averageAccuracy * 100)}%`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      icon: Zap,
      label: 'Average Speed',
      value: `${Math.round(user.cognitiveProfile.averageSpeed)}s`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      icon: Brain,
      label: 'Hesitation Score',
      value: `${Math.round(user.cognitiveProfile.hesitationScore * 100)}%`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      icon: TrendingUp,
      label: 'Quizzes Completed',
      value: user.quizHistory.length,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {lowBandwidthMode ? (
          <h1 className="text-4xl font-bold mb-8 text-white">
            Welcome back, {user.name}
          </h1>
        ) : (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8 text-white"
          >
            Welcome back, {user.name}
          </motion.h1>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} index={index} lowBandwidth={lowBandwidthMode} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Skill Graph */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              <Brain className="size-6 text-blue-400" />
              Skill Graph
            </h2>
            {skillGraphData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillGraphData}>
                  <PolarGrid stroke="#3b82f6" strokeOpacity={0.2} />
                  <PolarAngleAxis dataKey="subject" stroke="#9ca3af" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
                  <Radar
                    name="Skill Level"
                    dataKey="level"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-12">
                Complete quizzes to build your skill graph
              </p>
            )}
          </div>

          {/* Weakest Concept */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-orange-500/20 p-6">
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              <AlertCircle className="size-6 text-orange-400" />
              Focus Area
            </h2>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mb-4">
              <h3 className="text-xl font-semibold text-orange-400 mb-2">
                {weakestConcept.concept}
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                    style={{ width: `${weakestConcept.level}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400">{weakestConcept.level}%</span>
              </div>
              {weakestConcept.weaknessType && (
                <p className="text-sm text-gray-400">
                  Weakness Type: <span className="text-orange-400">{weakestConcept.weaknessType}</span>
                </p>
              )}
            </div>
            <Link
              to="/micro-remediation"
              className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all text-white text-center font-medium"
            >
              Start Micro-Remediation
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Recent Quiz Activity</h2>
          {recentQuizzes.length > 0 ? (
            <div className="space-y-3">
              {recentQuizzes.map((quiz, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-white/5 border border-blue-500/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-full flex items-center justify-center ${
                      quiz.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {quiz.correct ? '✓' : '✗'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{quiz.concept}</p>
                      <p className="text-sm text-gray-400">
                        {quiz.difficulty} • {quiz.timeSpent}s
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {new Date(quiz.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No quiz history yet. Start learning!
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <QuickAction
            to="/quiz"
            icon={Target}
            title="Continue Quiz"
            description="Adaptive questions for you"
            color="blue"
          />
          <QuickAction
            to="/interview"
            icon={Code}
            title="Start Interview"
            description="Practice coding interviews"
            color="green"
          />
          <QuickAction
            to="/roadmap"
            icon={TrendingUp}
            title="Open Roadmap"
            description="View your learning path"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  borderColor: string;
  index: number;
  lowBandwidth: boolean;
}> = ({ icon: Icon, label, value, color, bgColor, borderColor, index, lowBandwidth }) => {
  const content = (
    <div className={`rounded-xl ${bgColor} border ${borderColor} p-6 backdrop-blur-sm`}>
      <Icon className={`size-8 ${color} mb-3`} />
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  if (lowBandwidth) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {content}
    </motion.div>
  );
};

const QuickAction: React.FC<{
  to: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}> = ({ to, icon: Icon, title, description, color }) => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  };

  const colors = colorMap[color];

  return (
    <Link
      to={to}
      className={`p-6 rounded-xl ${colors.bg} hover:bg-white/10 border ${colors.border} transition-all group`}
    >
      <Icon className={`size-10 ${colors.text} mb-3 group-hover:scale-110 transition-transform`} />
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  );
};
