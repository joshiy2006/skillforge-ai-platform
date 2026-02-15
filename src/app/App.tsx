import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AdaptiveQuiz } from './pages/AdaptiveQuiz';
import { CognitiveAnalysis } from './pages/CognitiveAnalysis';
import { InteractiveConcept } from './pages/InteractiveConcept';
import { ConceptVisualizer } from './pages/ConceptVisualizer';
import { MicroRemediation } from './pages/MicroRemediation';
import { BuildMode } from './pages/BuildMode';
import { InterviewSimulation } from './pages/InterviewSimulation';
import { CareerRoadmap } from './pages/CareerRoadmap';
import { MultilingualBot } from './pages/MultilingualBot';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interactive-concept"
            element={
              <ProtectedRoute>
                <InteractiveConcept />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <AdaptiveQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cognitive-analysis"
            element={
              <ProtectedRoute>
                <CognitiveAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/micro-remediation"
            element={
              <ProtectedRoute>
                <MicroRemediation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visualizer"
            element={
              <ProtectedRoute>
                <ConceptVisualizer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/build-mode"
            element={
              <ProtectedRoute>
                <BuildMode />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewSimulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <CareerRoadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot"
            element={
              <ProtectedRoute>
                <MultilingualBot />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
