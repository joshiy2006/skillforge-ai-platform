import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  skillGraph: SkillData[];
  cognitiveProfile: CognitiveProfile;
  quizHistory: QuizResult[];
}

interface SkillData {
  concept: string;
  level: number; // 0-100
  weaknessType?: 'speed' | 'accuracy' | 'conceptual' | 'application';
  lastPracticed: string;
}

interface CognitiveProfile {
  averageSpeed: number;
  averageAccuracy: number;
  guessPattern: number; // 0-1
  hesitationScore: number; // 0-1
  impulsivityIndex: number; // 0-1
}

interface QuizResult {
  questionId: string;
  concept: string;
  difficulty: 'easy' | 'medium' | 'hard';
  correct: boolean;
  timeSpent: number; // seconds
  confidence?: number; // 1-5
  timestamp: string;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  lowBandwidthMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  toggleLowBandwidth: () => void;
  updateSkillGraph: (concept: string, performance: number) => void;
  addQuizResult: (result: QuizResult) => void;
  updateCognitiveProfile: (updates: Partial<CognitiveProfile>) => void;
}

interface SignupData {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('skillforge_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedBandwidth = localStorage.getItem('skillforge_low_bandwidth');
    if (savedBandwidth === 'true') {
      setLowBandwidthMode(true);
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('skillforge_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('skillforge_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - check localStorage for existing users
    const usersKey = 'skillforge_users';
    const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    const usersKey = 'skillforge_users';
    const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
    
    // Check if email already exists
    if (users.find((u: any) => u.email === data.email)) {
      return false;
    }

    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      skillGraph: [
        { concept: 'Arrays', level: 0, lastPracticed: new Date().toISOString() },
        { concept: 'Loops', level: 0, lastPracticed: new Date().toISOString() },
        { concept: 'Recursion', level: 0, lastPracticed: new Date().toISOString() },
        { concept: 'Dynamic Programming', level: 0, lastPracticed: new Date().toISOString() },
      ],
      cognitiveProfile: {
        averageSpeed: 0,
        averageAccuracy: 0,
        guessPattern: 0,
        hesitationScore: 0,
        impulsivityIndex: 0,
      },
      quizHistory: [],
    };

    users.push(newUser);
    localStorage.setItem(usersKey, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleLowBandwidth = () => {
    setLowBandwidthMode(!lowBandwidthMode);
    localStorage.setItem('skillforge_low_bandwidth', (!lowBandwidthMode).toString());
  };

  const updateSkillGraph = (concept: string, performance: number) => {
    if (!user) return;

    const updatedSkillGraph = user.skillGraph.map(skill => {
      if (skill.concept === concept) {
        return {
          ...skill,
          level: Math.min(100, Math.max(0, skill.level + performance)),
          lastPracticed: new Date().toISOString(),
        };
      }
      return skill;
    });

    setUser({ ...user, skillGraph: updatedSkillGraph });
  };

  const addQuizResult = (result: QuizResult) => {
    if (!user) return;

    const updatedHistory = [...user.quizHistory, result];
    setUser({ ...user, quizHistory: updatedHistory });

    // Update cognitive profile based on quiz result
    const avgSpeed = updatedHistory.reduce((acc, r) => acc + r.timeSpent, 0) / updatedHistory.length;
    const avgAccuracy = updatedHistory.filter(r => r.correct).length / updatedHistory.length;
    
    updateCognitiveProfile({
      averageSpeed: avgSpeed,
      averageAccuracy: avgAccuracy,
    });
  };

  const updateCognitiveProfile = (updates: Partial<CognitiveProfile>) => {
    if (!user) return;
    setUser({
      ...user,
      cognitiveProfile: { ...user.cognitiveProfile, ...updates },
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        lowBandwidthMode,
        login,
        signup,
        logout,
        toggleLowBandwidth,
        updateSkillGraph,
        addQuizResult,
        updateCognitiveProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export type { User, SkillData, CognitiveProfile, QuizResult, SignupData };
