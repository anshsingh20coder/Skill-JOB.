import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { AnalysisResult } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SynonymDictionaryModal } from './components/SynonymDictionaryModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { JobDescriptionPage } from './pages/JobDescriptionPage';
import { AnalysisResultsPage } from './pages/AnalysisResultsPage';
import { MissingSkillsPage } from './pages/MissingSkillsPage';
import { LearningPlannerPage } from './pages/LearningPlannerPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedResumeId, setSelectedResumeId] = useState<string | undefined>();
  const [selectedJdId, setSelectedJdId] = useState<string | undefined>();
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isDictionaryModalOpen, setIsDictionaryModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // If user logs in and is on landing or auth, default to dashboard
  useEffect(() => {
    if (user && (activeTab === 'landing' || activeTab === 'auth')) {
      setActiveTab('dashboard');
    }
  }, [user]);

  // Load a specific analysis by ID into current state
  const handleSelectAnalysis = async (analysisId: string) => {
    try {
      const res = await api.getAnalysisById(analysisId);
      if (res.success && res.analysis) {
        setCurrentAnalysis(res.analysis);
        setActiveTab('analysis-results');
      }
    } catch (err) {
      console.error('Failed to load analysis:', err);
    }
  };

  // Run Gap Analysis
  const handleRunAnalysis = async () => {
    if (!selectedResumeId || !selectedJdId) {
      alert('Please select both a resume and a target job description.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await api.runAnalysis({
        resumeId: selectedResumeId,
        jobDescriptionId: selectedJdId,
      });

      if (res.success && res.analysis) {
        setCurrentAnalysis(res.analysis);
        setActiveTab('analysis-results');
      }
    } catch (err: any) {
      alert(err.message || 'Analysis failed. Please ensure both documents are valid.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefreshAnalysis = async () => {
    if (currentAnalysis?.id) {
      await handleSelectAnalysis(currentAnalysis.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-sky-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Initializing SkillGap AI Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] relative overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Ambient background glow elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-sky-100/60 via-indigo-50/30 to-transparent blur-3xl pointer-events-none -z-10"></div>

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveAnalysis={Boolean(currentAnalysis)}
        onOpenDictionary={() => setIsDictionaryModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Loading Overlay when running full analysis */}
        {isAnalyzing && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl border border-slate-200/80">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
                <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Executing Precision Skill Matching
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Normalizing technology synonyms, parsing exact sentence citations from the JD, and constructing your 14-day roadmap...
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-sky-700 bg-sky-50 py-1.5 px-3 rounded-full border border-sky-100">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                <span>Deterministic Zero-Hallucination Verification</span>
              </div>
            </div>
          </div>
        )}

        {/* View Routing */}
        {activeTab === 'landing' && (
          <LandingPage
            onNavigate={setActiveTab}
            onOpenDictionary={() => setIsDictionaryModalOpen(true)}
          />
        )}

        {activeTab === 'auth' && (
          <AuthPage onSuccess={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigate={setActiveTab}
            onSelectAnalysis={handleSelectAnalysis}
          />
        )}

        {activeTab === 'upload-resume' && (
          <ResumeUploadPage
            onSelectResumeForAnalysis={(id) => setSelectedResumeId(id)}
            selectedResumeId={selectedResumeId}
          />
        )}

        {activeTab === 'job-description' && (
          <JobDescriptionPage
            onSelectJdForAnalysis={(id) => setSelectedJdId(id)}
            selectedJdId={selectedJdId}
            onProceedToAnalysis={handleRunAnalysis}
            hasSelectedResume={Boolean(selectedResumeId)}
          />
        )}

        {activeTab === 'analysis-results' && (
          <AnalysisResultsPage
            analysis={currentAnalysis}
            onNavigateToPlan={() => setActiveTab('learning-plan')}
            onNavigateToMissingDetails={() => setActiveTab('missing-details')}
          />
        )}

        {activeTab === 'missing-details' && (
          <MissingSkillsPage
            analysis={currentAnalysis}
            onNavigateToPlan={() => setActiveTab('learning-plan')}
            onBackToResults={() => setActiveTab('analysis-results')}
          />
        )}

        {activeTab === 'learning-plan' && (
          <LearningPlannerPage
            analysis={currentAnalysis}
            onRefreshAnalysis={handleRefreshAnalysis}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage onSelectAnalysis={handleSelectAnalysis} />
        )}

        {activeTab === 'profile' && <ProfilePage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Skill Synonym Knowledge Base Modal */}
      <SynonymDictionaryModal
        isOpen={isDictionaryModalOpen}
        onClose={() => setIsDictionaryModalOpen(false)}
      />
    </div>
  );
};
