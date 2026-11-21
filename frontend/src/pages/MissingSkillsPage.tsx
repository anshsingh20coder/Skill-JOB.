import React, { useState } from 'react';
import { AnalysisResult, MissingSkill } from '../types';
import {
  Award,
  AlertCircle,
  Quote,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

interface MissingSkillsPageProps {
  analysis: AnalysisResult | null;
  onNavigateToPlan: (skillName?: string) => void;
  onBackToResults: () => void;
}

export const MissingSkillsPage: React.FC<MissingSkillsPageProps> = ({
  analysis,
  onNavigateToPlan,
  onBackToResults,
}) => {
  const [filterImportance, setFilterImportance] = useState<'all' | 'required' | 'preferred'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!analysis) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-950">No Active Analysis Loaded</h2>
        <p className="text-xs text-slate-500">Run a gap analysis first to inspect missing skill citations.</p>
        <button
          onClick={onBackToResults}
          className="px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold"
        >
          Return to Analysis
        </button>
      </div>
    );
  }

  const { missingSkills, jdInfo, resumeInfo } = analysis;

  const filtered = missingSkills.filter((skill) => {
    const matchesImp = filterImportance === 'all' || skill.importance === filterImportance;
    const matchesSearch =
      skill.canonicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.jdEvidenceSentence.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesImp && matchesSearch;
  });

  const requiredCount = missingSkills.filter((s) => s.importance === 'required').length;
  const preferredCount = missingSkills.filter((s) => s.importance === 'preferred').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Critical Requirement Verification
              </span>
              <span className="text-xs text-slate-400">100% Traceable Citations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Verified Missing Skills & Exact Evidence
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Target Position: <strong>{jdInfo?.title || 'Target Role'}</strong> • Resume:{' '}
              <strong>{resumeInfo?.name || 'Candidate Resume'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onBackToResults}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              ← Back to Overview
            </button>
            <button
              onClick={() => onNavigateToPlan()}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>14-Day Plan</span>
            </button>
          </div>
        </div>

        {/* Traceability Guarantee Box */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1">
            <h4 className="font-bold">Zero-Hallucination Evidence Guarantee</h4>
            <p className="text-slate-600 leading-relaxed">
              Every missing competency below contains the <strong>unmodified sentence</strong> extracted directly from the original job description text. No skills are flagged as missing without verified textual evidence.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search missing skills or evidence..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterImportance('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterImportance === 'all'
                ? 'bg-navy-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Gaps ({missingSkills.length})
          </button>
          <button
            onClick={() => setFilterImportance('required')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterImportance === 'required'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-rose-700 hover:bg-rose-50'
            }`}
          >
            Required Only ({requiredCount})
          </button>
          <button
            onClick={() => setFilterImportance('preferred')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterImportance === 'preferred'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-amber-700 hover:bg-amber-50'
            }`}
          >
            Preferred Only ({preferredCount})
          </button>
        </div>
      </div>

      {/* Missing Skills Cards Grid */}
      <div className="space-y-4">
        {filtered.map((skill, idx) => (
          <div
            key={idx}
            className="p-6 bg-white rounded-2xl border border-rose-200 shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            {/* Skill Headline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-navy-950">{skill.canonicalName}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        skill.importance === 'required'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {skill.importance}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Category: {skill.category}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateToPlan(skill.canonicalName)}
                className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-lg border border-sky-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <span>Add to 14-Day Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Exact JD Evidence Quote */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Quote className="w-3.5 h-3.5 text-sky-600" />
                Exact Job Description Sentence:
              </span>
              <p className="font-mono text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed font-semibold">
                "{skill.jdEvidenceSentence}"
              </p>
            </div>

            {/* Explanation & Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="space-y-1">
                <strong className="text-navy-950 block">SkillGap Engine Diagnosis:</strong>
                <p className="text-slate-600 leading-relaxed">{skill.explanation}</p>
              </div>

              <div className="space-y-1">
                <strong className="text-navy-950 block">Recommended Next Action:</strong>
                <p className="text-slate-600 leading-relaxed">{skill.suggestedAction}</p>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No missing skills matching your search filter.
          </div>
        )}
      </div>
    </div>
  );
};
