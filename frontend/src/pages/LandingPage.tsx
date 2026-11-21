import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Layers,
  Calendar,
  Award,
  Terminal,
  Zap,
  ArrowUpRight,
  Target,
  FileCheck,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onOpenDictionary: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenDictionary }) => {
  const { demoLogin, user } = useAuth();

  const handleStart = () => {
    if (user) {
      onNavigate('dashboard');
    } else {
      onNavigate('auth');
    }
  };

  const handleDemo = async () => {
    await demoLogin();
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 md:pt-16 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-100 text-xs font-semibold mb-8 shadow-md border border-slate-700/80 hover:border-slate-600 transition-all">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span>Deterministic NLP & 100% Verifiable Evidence Engine</span>
            <span className="text-slate-400 font-mono text-[10px] ml-1">v2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.08]">
            Bridge your resume to your next role with{' '}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Zero Hallucinations
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Upload your resume PDF and paste any long job description. Uncover exact missing requirements
            backed by <strong>verifiable sentence evidence</strong>, normalized technology synonyms, and an actionable 14-day mastery roadmap.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-xl shadow-slate-900/15 hover:shadow-slate-900/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 text-sm"
            >
              <span>Analyze Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleDemo}
              className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 text-sm"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Launch Live Interactive Demo</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Exact JD Sentence Traceability
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600" /> ReactJS = React.js Synonym Auto-Mapping
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" /> Actionable 14-Day Daily Curriculum
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" /> Multi-Column & Scanned PDF OCR
            </span>
          </div>
        </div>
      </section>

      {/* Live Interactive Comparison Card Showcase */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-premium overflow-hidden">
          {/* Terminal / Mac-style top bar */}
          <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2">
                skillgap-engine --evaluate-traceability
              </span>
            </div>
            <span className="text-[11px] font-bold bg-slate-800 text-sky-300 px-3 py-1 rounded-full border border-slate-700/80">
              100% Verifiable Evidence Guarantee
            </span>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Matched Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Skills (Synonym Aware)
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Verified Match
                </span>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">React (Canonical)</span>
                  <span className="text-[10px] bg-sky-50 text-sky-700 font-mono px-2 py-0.5 rounded-md border border-sky-200">
                    Synonym Match
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Resume listed: <code className="text-slate-900 font-semibold bg-white px-1 py-0.5 rounded border border-slate-200">"ReactJS"</code> vs JD: <code className="text-slate-900 font-semibold bg-white px-1 py-0.5 rounded border border-slate-200">"React.js"</code>
                </p>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">TypeScript (Canonical)</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono px-2 py-0.5 rounded-md border border-emerald-200">
                    Exact Match
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Resume: <code className="text-slate-900 font-semibold bg-white px-1 py-0.5 rounded border border-slate-200">"TypeScript"</code> (Skills Summary, Line 8)
                </p>
              </div>
            </div>

            {/* Missing Column with Verifiable Evidence */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-rose-600" /> Missing Competency (Exact Citation)
                </span>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-100">
                  Required Gap
                </span>
              </div>

              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200/80 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-950 text-sm">Docker</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md uppercase">
                    Mandatory Qualification
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-rose-200 font-mono text-[11px] text-slate-800 leading-relaxed shadow-2xs">
                  <strong className="text-rose-900">JD Evidence: </strong>
                  "Experience with Docker and containerized deployments is required."
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>Explanation: </strong>
                  Docker is explicitly stated as a required qualification in the job description, but no corresponding experience was found in the candidate resume text.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Architecture Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Engineered for Precision & Real Job Market Reliability
          </h2>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Unlike superficial matchers or black-box LLMs that invent qualifications, SkillGap AI combines deterministic parsing with structured evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <FileSearch className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-bold text-slate-950 text-base">Layout-Aware PDF Extraction</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Handles multi-column formats, table structures, and strange font icons without losing context. Automatically detects image-based scanned documents and applies OCR fallback.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Terminal className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-bold text-slate-950 text-base">Centralized Synonym Dictionary</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Over 150+ categorized technologies. ReactJS, React.js, and React always resolve to canonical React. NodeJS and Node.js map reliably.
            </p>
            <button
              onClick={onOpenDictionary}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 pt-1"
            >
              <span>Explore Dictionary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="font-bold text-slate-950 text-base">Personalized 14-Day Roadmap</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automatically pinpoints the top 3 missing skills and generates day-by-day learning objectives, practical tasks, free verified resources, and portfolio-ready mini-projects.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-navy-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-center text-white shadow-premium border border-slate-800">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Ready to benchmark your resume?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Upload your PDF resume now to see exact matched skills, verified missing requirements, and your personalized 2-week mastery schedule.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-sky-500/25 transition-all text-sm"
              >
                Upload Resume & Analyze
              </button>
              <button
                onClick={handleDemo}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-2xl border border-slate-700 transition-all text-sm"
              >
                Explore Demo Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
