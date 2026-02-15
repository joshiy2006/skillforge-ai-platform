import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';
import { Brain, Zap, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

interface CognitiveInsight {
  type: 'speed' | 'accuracy' | 'conceptual' | 'application';
  severity: 'low' | 'medium' | 'high';
  message: string;
  recommendation: string;
}

export const CognitiveAnalysis: React.FC = () => {
  const { user, updateCognitiveProfile, lowBandwidthMode } = useApp();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<CognitiveInsight[]>([]);

  useEffect(() => {
    if (!user || user.quizHistory.length === 0) {
      navigate('/quiz');
      return;
    }

    analyzePerformance();
  }, [user]);

  const analyzePerformance = () => {
    if (!user) return;

    const recentQuizzes = user.quizHistory.slice(-10);
    const detectedInsights: CognitiveInsight[] = [];

    // Calculate metrics
    const avgSpeed = recentQuizzes.reduce((acc, q) => acc + q.timeSpent, 0) / recentQuizzes.length;
    const avgAccuracy = recentQuizzes.filter(q => q.correct).length / recentQuizzes.length;

    // Analyze patterns
    const fastIncorrect = recentQuizzes.filter(q => !q.correct && q.timeSpent < 10).length;
    const slowCorrect = recentQuizzes.filter(q => q.correct && q.timeSpent > 30).length;
    const lowConfidenceCorrect = recentQuizzes.filter(
      q => q.correct && q.confidence && q.confidence <= 2
    ).length;

    // Detect impulsivity
    if (fastIncorrect >= 3) {
      detectedInsights.push({
        type: 'speed',
        severity: 'high',
        message: 'Impulsive Response Pattern Detected',
        recommendation: 'You\'re answering quickly but incorrectly. Take more time to read and analyze questions carefully.',
      });

      updateCognitiveProfile({ impulsivityIndex: 0.8 });
    }

    // Detect hesitation
    if (slowCorrect >= 3) {
      detectedInsights.push({
        type: 'conceptual',
        severity: 'medium',
        message: 'Conceptual Hesitation Detected',
        recommendation: 'You\'re getting answers correct but taking too long. This suggests unclear understanding. Review fundamentals.',
      });

      updateCognitiveProfile({ hesitationScore: 0.7 });
    }

    // Detect guessing
    if (lowConfidenceCorrect >= 2) {
      detectedInsights.push({
        type: 'accuracy',
        severity: 'medium',
        message: 'Potential Guessing Pattern',
        recommendation: 'You marked low confidence but got answers correct. This might indicate lucky guesses rather than understanding.',
      });

      updateCognitiveProfile({ guessPattern: 0.6 });
    }

    // Detect concept confusion
    const conceptErrors: Record<string, number> = {};
    recentQuizzes.forEach(q => {
      if (!q.correct) {
        conceptErrors[q.concept] = (conceptErrors[q.concept] || 0) + 1;
      }
    });

    Object.entries(conceptErrors).forEach(([concept, count]) => {
      if (count >= 2) {
        detectedInsights.push({
          type: 'conceptual',
          severity: 'high',
          message: `Repeated Mistakes in ${concept}`,
          recommendation: `You've made ${count} mistakes in ${concept}. This indicates a conceptual gap. Focus on fundamentals.`,
        });
      }
    });

    // Update overall cognitive profile
    updateCognitiveProfile({
      averageSpeed: avgSpeed,
      averageAccuracy: avgAccuracy,
    });

    setInsights(detectedInsights);
  };

  if (!user) return null;

  const recentQuizzes = user.quizHistory.slice(-10);

  // Prepare chart data
  const speedAccuracyData = recentQuizzes.map((q, index) => ({
    index: index + 1,
    speed: q.timeSpent,
    accuracy: q.correct ? 100 : 0,
    correct: q.correct,
  }));

  const performanceOverTime = recentQuizzes.map((q, index) => ({
    question: index + 1,
    score: q.correct ? 100 : 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {lowBandwidthMode ? (
          <h1 className="text-4xl font-bold mb-8 text-white flex items-center gap-3">
            <Brain className="size-10 text-blue-400" />
            Cognitive Analysis
          </h1>
        ) : (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8 text-white flex items-center gap-3"
          >
            <Brain className="size-10 text-blue-400" />
            Cognitive Analysis
          </motion.h1>
        )}
        <p className="text-gray-400 mb-8">
          AI-powered analysis of your thinking patterns
        </p>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Zap}
            label="Avg Speed"
            value={`${Math.round(user.cognitiveProfile.averageSpeed)}s`}
            color="blue"
            lowBandwidth={lowBandwidthMode}
          />
          <MetricCard
            icon={Target}
            label="Avg Accuracy"
            value={`${Math.round(user.cognitiveProfile.averageAccuracy * 100)}%`}
            color="green"
            lowBandwidth={lowBandwidthMode}
          />
          <MetricCard
            icon={AlertTriangle}
            label="Hesitation Score"
            value={`${Math.round(user.cognitiveProfile.hesitationScore * 100)}%`}
            color="yellow"
            lowBandwidth={lowBandwidthMode}
          />
          <MetricCard
            icon={Brain}
            label="Guess Pattern"
            value={`${Math.round(user.cognitiveProfile.guessPattern * 100)}%`}
            color="purple"
            lowBandwidth={lowBandwidthMode}
          />
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              <AlertTriangle className="size-6 text-orange-400" />
              Detected Patterns
            </h2>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Speed vs Accuracy */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
            <h2 className="text-xl font-bold mb-4 text-white">Speed vs Accuracy</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  dataKey="speed"
                  name="Time (s)"
                  stroke="#9ca3af"
                  label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                />
                <YAxis
                  type="number"
                  dataKey="accuracy"
                  name="Correct"
                  stroke="#9ca3af"
                  domain={[-10, 110]}
                  label={{ value: 'Accuracy', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #3b82f6' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Scatter data={speedAccuracyData}>
                  {speedAccuracyData.map((entry, index) => (
                    <Cell key={index} fill={entry.correct ? '#10b981' : '#ef4444'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-green-500" />
                <span className="text-gray-400">Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500" />
                <span className="text-gray-400">Incorrect</span>
              </div>
            </div>
          </div>

          {/* Performance Over Time */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6">
            <h2 className="text-xl font-bold mb-4 text-white">Performance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="question" stroke="#9ca3af" />
                <YAxis domain={[0, 100]} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #3b82f6' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pattern Classification */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-blue-500/20 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Thinking Pattern Classification</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <PatternCard
              title="Impulsive"
              description="Fast responses without thorough analysis"
              score={user.cognitiveProfile.impulsivityIndex}
            />
            <PatternCard
              title="Analytical"
              description="Careful consideration but slow execution"
              score={user.cognitiveProfile.hesitationScore}
            />
            <PatternCard
              title="Confident Guesser"
              description="Making educated guesses without certainty"
              score={user.cognitiveProfile.guessPattern}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/micro-remediation')}
            className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all text-white font-medium flex items-center justify-center gap-2"
          >
            <TrendingUp className="size-5" />
            Start Targeted Remediation
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all text-white font-medium"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  lowBandwidth: boolean;
}> = ({ icon: Icon, label, value, color, lowBandwidth }) => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  };

  const colors = colorMap[color];

  const content = (
    <div className={`rounded-xl ${colors.bg} border ${colors.border} p-6`}>
      <Icon className={`size-8 ${colors.text} mb-2`} />
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
    </div>
  );

  if (lowBandwidth) return content;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      {content}
    </motion.div>
  );
};

const InsightCard: React.FC<{ insight: CognitiveInsight }> = ({ insight }) => {
  const severityColors = {
    low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  };

  const colors = severityColors[insight.severity];

  return (
    <div className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`size-5 ${colors.text} mt-0.5`} />
        <div className="flex-1">
          <h3 className={`font-semibold ${colors.text} mb-1`}>{insight.message}</h3>
          <p className="text-gray-300 text-sm">{insight.recommendation}</p>
        </div>
      </div>
    </div>
  );
};

const PatternCard: React.FC<{
  title: string;
  description: string;
  score: number;
}> = ({ title, description, score }) => {
  const percentage = Math.round(score * 100);
  const getColor = () => {
    if (percentage < 30) return 'bg-green-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 rounded-lg bg-white/5 border border-blue-500/20">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <div
            className={`${getColor()} h-2 rounded-full transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-300">{percentage}%</span>
      </div>
    </div>
  );
};
