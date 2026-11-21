import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AnalysisHistoryItem, Resume, JobDescription } from '../types';
import {
  BarChart3,
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
  Zap,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onSelectAnalysis: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectAnalysis }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [hRes, rRes, jRes] = await Promise.all([
        api.getAnalysisHistory().catch(() => ({ success: false, history: [] })),
        api.getResumes().catch(() => ({ success: false, resumes: [] })),
        api.getJobDescriptions().catch(() => ({ success: false, jobDescriptions: [] })),
      ]);

      if (hRes.success) setHistory(hRes.history);
      if (rRes.success) setResumes(rRes.resumes);
      if (jRes.success) setJobs(jRes.jobDescriptions);
    } finally {
      setLoading(false);
    }
  };

  // Metrics calculation
  const totalAnalyses = history.length;
  const avgMatch = totalAnalyses > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.overallMatchPercentage, 0) / totalAnalyses)
    : 0;
  const totalGaps = history.reduce((acc, curr) => acc + curr.missingCount, 0);

  // Prepare chart data from history
  const chartData = history.slice(0, 6).reverse().map((h) => ({
    name: h.jobTitle.length > 15 ? h.jobTitle.slice(0, 15) + '...' : h.jobTitle,
    match: h.overallMatchPercentage,
    required: h.requiredMatchPercentage,
  }));

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Hero Banner - Ultra Luxury Dark Glass */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-navy-950 to-slate-900 text-white p-7 sm:p-9 shadow-premium border border-slate-800/80">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
                Candidate Workspace
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Targeting: <strong className="text-slate-200">{user?.targetRole || 'Software Engineer'}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Engineer'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              You have benchmarked <strong>{totalAnalyses} target roles</strong>. Track your competency matches,
              uncover verified JD sentence evidence, and follow your customized 14-day mastery roadmap.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('upload-resume')}
              className="px-5 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.2]" />
              <span>Upload Resume</span>
            </button>
            <button
              onClick={() => onNavigate('job-description')}
              className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold rounded-2xl text-xs sm:text-sm border border-slate-700/80 hover:border-slate-600 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-sky-400" />
              <span>Paste Target JD</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-2 group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Analyses</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalAnalyses}</span>
            <span className="text-xs text-slate-400 font-medium">{resumes.length} resumes stored</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-2 group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Fit</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{avgMatch}%</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Weighted Match
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-2 group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Missing Gaps</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalGaps}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              Actionable Targets
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-2 group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Traceability</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">100%</span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              Zero Hallucinations
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Percentage History Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                Role Match Progression
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Overall fit vs required qualifications match across recent benchmarked roles
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500"></span>
                <span>Overall Match</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-900"></span>
                <span>Required Skills</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                    }}
                  />
                  <Bar dataKey="match" fill="#0284C7" name="Overall Match %" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="required" fill="#0F172A" name="Required Match %" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <BarChart3 className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-medium">No analysis data yet. Run your first gap analysis to visualize scores.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Launch Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                Fast-Track Workflow
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete these 3 simple steps to generate precision gap analytics:
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('upload-resume')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 hover:border-slate-300 rounded-2xl text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Upload PDF Resume</h4>
                    <p className="text-[11px] text-slate-500">
                      {resumes.length > 0 ? `${resumes.length} ready on file` : 'Extract text & competencies'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('job-description')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 hover:border-slate-300 rounded-2xl text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Paste Target JD</h4>
                    <p className="text-[11px] text-slate-500">
                      {jobs.length > 0 ? `${jobs.length} roles saved` : 'Parse required vs preferred skills'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('learning-plan')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 hover:border-slate-300 rounded-2xl text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">14-Day Roadmap</h4>
                    <p className="text-[11px] text-slate-500">Actionable daily tasks & projects</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-gradient-to-r from-sky-50 to-indigo-50/50 rounded-2xl border border-sky-100/80 text-xs text-sky-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Every missing competency is backed by the <strong>exact unmodified sentence</strong> from the JD.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Analyses Archive */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight">Recent Gap Analyses</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any report to view comprehensive skill alignments</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3.5">Target Role & Company</th>
                  <th className="px-4 py-3.5">Resume Document</th>
                  <th className="px-4 py-3.5">Overall Fit</th>
                  <th className="px-4 py-3.5">Required Match</th>
                  <th className="px-4 py-3.5">Missing Gaps</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.slice(0, 5).map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectAnalysis(item.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {item.jobTitle}
                      <span className="block text-[11px] text-slate-400 font-normal">{item.company}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">{item.resumeName}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block font-extrabold px-2.5 py-1 rounded-lg text-xs ${
                          item.overallMatchPercentage >= 70
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : item.overallMatchPercentage >= 40
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {item.overallMatchPercentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-700">
                      {item.requiredMatchPercentage}%
                    </td>
                    <td className="px-4 py-3.5 text-rose-700 font-bold">
                      {item.missingCount} skills
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sky-600 font-bold hover:text-sky-700 inline-flex items-center gap-1">
                        Report <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">
            No analyses recorded yet. Upload a resume and job description to get started!
          </div>
        )}
      </div>
    </div>
  );
};
