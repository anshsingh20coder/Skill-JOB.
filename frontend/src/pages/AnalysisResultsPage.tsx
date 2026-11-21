import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { api } from '../services/api';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Download,
  Calendar,
  Sparkles,
  HelpCircle,
  Layers,
  Clock,
  BookOpen,
  ChevronRight,
  TrendingUp,
  FileText,
  Briefcase,
  Check,
  Zap,
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

interface AnalysisResultsPageProps {
  analysis: AnalysisResult | null;
  onNavigateToPlan: () => void;
  onNavigateToMissingDetails: () => void;
}

export const AnalysisResultsPage: React.FC<AnalysisResultsPageProps> = ({
  analysis,
  onNavigateToPlan,
  onNavigateToMissingDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'matched' | 'missing' | 'related' | 'recommendations'>('matched');

  if (!analysis) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
          <Layers className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Active Gap Analysis Loaded</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please upload a resume and select a target job description to run precision gap analysis.
        </p>
      </div>
    );
  }

  const { scores, matchedSkills, missingSkills, partiallyMatchedSkills, relatedSkills, experienceGaps, aiRecommendations } = analysis;

  // Chart data: breakdown of categories
  const categoriesMap: Record<string, { matched: number; missing: number }> = {};
  for (const s of matchedSkills) {
    const cat = s.category || 'General';
    if (!categoriesMap[cat]) categoriesMap[cat] = { matched: 0, missing: 0 };
    categoriesMap[cat].matched++;
  }
  for (const s of missingSkills) {
    const cat = s.category || 'General';
    if (!categoriesMap[cat]) categoriesMap[cat] = { matched: 0, missing: 0 };
    categoriesMap[cat].missing++;
  }

  const chartData = Object.entries(categoriesMap).map(([category, count]) => ({
    category: category.length > 14 ? category.slice(0, 14) + '..' : category,
    matched: count.matched,
    missing: count.missing,
  }));

  const handleDownload = () => {
    window.open(api.getExportUrl(analysis.id), '_blank');
  };

  const getScoreStatusBadge = (score: number) => {
    if (score >= 75) {
      return { label: 'High Alignment', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
    if (score >= 50) {
      return { label: 'Moderate Fit', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
    return { label: 'Substantial Skill Gaps', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  const status = getScoreStatusBadge(scores.overallMatchPercentage);

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-premium space-y-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md tracking-wider uppercase">
                Verified Gap Analysis
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${status.bg}`}>
                {status.label}
              </span>
              <span className="text-xs text-slate-400">
                • {new Date(analysis.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {analysis.jdInfo?.title || 'Target Position'} @ {analysis.jdInfo?.company || 'Target Employer'}
            </h1>
            <p className="text-xs text-slate-500">
              Evaluated against: <strong className="text-slate-800 font-semibold">{analysis.resumeInfo?.name || 'Uploaded Resume'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export Report (.md)</span>
            </button>
            <button
              onClick={onNavigateToPlan}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-600/20 hover:shadow-sky-600/35 hover:-translate-y-0.5 flex items-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Launch 14-Day Roadmap</span>
            </button>
          </div>
        </div>

        {/* 3 Core Metric Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Overall Match */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-navy-950 to-slate-900 text-white shadow-md relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
                Overall Competency Fit
              </span>
              <Zap className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight">{scores.overallMatchPercentage}%</span>
              <span className="text-xs text-slate-300 font-medium">Weighted Score</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              75% Core Required Skills + 25% Preferred Bonus qualifications.
            </p>
          </div>

          {/* Card 2: Required Match */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Required Skills Match
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-5xl font-black tracking-tight ${
                  scores.requiredMatchPercentage >= 70
                    ? 'text-emerald-600'
                    : scores.requiredMatchPercentage >= 50
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                {scores.requiredMatchPercentage}%
              </span>
              <span className="text-xs text-slate-500 font-medium">Prerequisites Met</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Primary screening filter utilized by technical recruitment leads.
            </p>
          </div>

          {/* Card 3: Preferred Match */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Preferred Qualifications
              </span>
              <Sparkles className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-sky-700">
                {scores.preferredMatchPercentage}%
              </span>
              <span className="text-xs text-slate-500 font-medium">Bonus Alignment</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Competitive advantages that set top applicants apart.
            </p>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs text-slate-600 flex items-center gap-3">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="leading-relaxed">
            <strong>Scoring Transparency Notice:</strong> Skill match percentage evaluates competency and keyword alignment with the job description. It is not an algorithmic hire probability prediction.
          </span>
        </div>
      </div>

      {/* Breakdown Stats Bar & Recharts Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualizer Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Competency Alignment by Category</h3>
              <p className="text-xs text-slate-500">Matched (Sky Blue) vs Missing Gaps (Slate)</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Category Matrix
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
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
                <Bar dataKey="matched" fill="#0284C7" name="Matched Skills" radius={[6, 6, 0, 0]} />
                <Bar dataKey="missing" fill="#94A3B8" name="Missing Skills" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Numbers */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Quantified Overview</h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Skills
              </span>
              <span className="text-base font-black text-emerald-900">{matchedSkills.length}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-rose-50/70 rounded-xl border border-rose-100">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" /> Missing Requirements
              </span>
              <span className="text-base font-black text-rose-900">{missingSkills.length}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-sky-50/70 rounded-xl border border-sky-100">
              <span className="text-xs font-bold text-sky-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" /> Partial / Related
              </span>
              <span className="text-base font-black text-sky-900">{partiallyMatchedSkills.length}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500" /> Extraction Confidence
              </span>
              <span className="text-base font-black text-slate-900">
                {scores.resumeExtractionConfidence}%
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateToMissingDetails}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Deep Dive: Missing Skills Evidence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Experience Gap Warning if any */}
      {experienceGaps && experienceGaps.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-3.5">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 tracking-tight">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Experience Requirements Check</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {experienceGaps.map((gap, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                  gap.status === 'met'
                    ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                    : 'bg-amber-50/60 border-amber-200/80 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>Required: {gap.requiredExperience}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200/80">
                    {gap.status === 'met' ? 'Requirement Met ✓' : 'Gap Noted'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">{gap.gapDescription}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Tabs: Matched vs Missing vs Related vs Recommendations */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200/80 overflow-x-auto text-xs font-semibold bg-slate-50/80 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('matched')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'matched'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Matched Skills ({matchedSkills.length})
          </button>

          <button
            onClick={() => setActiveTab('missing')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'missing'
                ? 'bg-white text-rose-700 shadow-sm border border-rose-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Missing Skills ({missingSkills.length})
          </button>

          <button
            onClick={() => setActiveTab('related')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'related'
                ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Partially Matched & Related ({partiallyMatchedSkills.length + relatedSkills.length})
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'recommendations'
                ? 'bg-white text-sky-700 shadow-sm border border-sky-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Actionable AI Recommendations
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-7">
          {/* TAB 1: MATCHED SKILLS */}
          {activeTab === 'matched' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {matchedSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:border-slate-300 transition-all text-xs space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm">{skill.canonicalName}</span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">Category: {skill.category}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide ${
                            skill.matchStatus === 'synonym'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {skill.matchStatus === 'synonym' ? 'Synonym Match' : 'Exact Match'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {skill.confidenceScore}% conf
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 font-mono text-[11px] text-slate-700 space-y-1">
                      <div>
                        <span className="text-slate-400">In Resume: </span>
                        <strong>"{skill.originalResumeName}"</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">In JD: </span>
                        <strong>"{skill.originalJdName}"</strong>
                      </div>
                    </div>

                    {skill.resumeEvidenceSentence && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-2">
                        "{skill.resumeEvidenceSentence}"
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {matchedSkills.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No skills matched with this job description.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MISSING SKILLS WITH JD EVIDENCE */}
          {activeTab === 'missing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <p className="text-xs text-slate-500">
                  Every missing skill includes the exact sentence from the job description where it was required.
                </p>
                <button
                  onClick={onNavigateToMissingDetails}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                >
                  <span>Full Evidence View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {missingSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 text-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-950 text-sm">{skill.canonicalName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            skill.importance === 'required'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {skill.importance}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {skill.confidenceScore}% detection
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-rose-200 text-slate-700 font-mono text-[11px] leading-relaxed">
                      <strong className="text-rose-900">JD Evidence: </strong>
                      "{skill.jdEvidenceSentence}"
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">
                      <strong>Analysis: </strong>
                      {skill.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PARTIALLY MATCHED & RELATED SKILLS */}
          {activeTab === 'related' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Adjacent technologies where your existing skillset provides a fast ramp-up path:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {partiallyMatchedSkills.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/30 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{item.canonicalName}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                        Bridge Opportunity
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{item.reason}</p>
                    <div className="p-2.5 bg-white rounded-xl border border-indigo-100 text-[11px] font-mono text-slate-700">
                      <strong>JD Requirement: </strong>"{item.jdEvidence}"
                    </div>
                  </div>
                ))}
              </div>

              {partiallyMatchedSkills.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No partial technology bridges identified.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {/* Top Skills to Learn */}
              <div>
                <h4 className="font-extrabold text-slate-950 text-sm mb-3">Prioritized Skills to Learn</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aiRecommendations.skillsToLearnFirst.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{item.skill}</span>
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                          {item.urgency}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume Improvements */}
              <div>
                <h4 className="font-extrabold text-slate-950 text-sm mb-3">Resume Content Enhancements</h4>
                <div className="space-y-2.5">
                  {aiRecommendations.resumeImprovements.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{item.section}</span>
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {item.currentDefect}
                        </span>
                      </div>
                      <p className="text-slate-700 font-mono text-[11px] bg-white p-2.5 rounded-xl border border-slate-200 mt-1 leading-relaxed">
                        💡 {item.suggestedBulletPoint}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Recommendations */}
              <div>
                <h4 className="font-extrabold text-slate-950 text-sm mb-3">Portfolio Projects to Close Gaps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiRecommendations.projectRecommendations.map((item, idx) => (
                    <div key={idx} className="p-5 bg-sky-50/50 rounded-2xl border border-sky-200/80 text-xs space-y-2">
                      <h5 className="font-bold text-slate-950 text-sm">{item.title}</h5>
                      <div className="flex flex-wrap gap-1">
                        {item.skillsTargeted.map((s, sIdx) => (
                          <span key={sIdx} className="bg-sky-200 text-sky-900 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{item.description}</p>
                      <p className="text-sky-800 font-semibold text-[11px] pt-1 border-t border-sky-100">
                        ⭐ {item.portfolioImpact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
