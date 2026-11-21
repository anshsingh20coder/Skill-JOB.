import React from 'react';
import { Compass, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-sky-400 border border-navy-700">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                SkillGap<span className="text-sky-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Production-quality Resume vs Job Description Gap Analyser powered by deterministic NLP,
              centralized synonym normalization, verifiable JD evidence extraction, and tailored 14-day mastery roadmaps.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Evidence Traceability
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Normalized Synonyms
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Transparent Scoring
              </span>
            </div>
          </div>

          {/* Core Engine Pillars */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Engine Highlights
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors">Layout-Aware PDF Extraction</li>
              <li className="hover:text-white transition-colors">Two-Column & Table Flattening</li>
              <li className="hover:text-white transition-colors">Scanned PDF OCR Auto-Detection</li>
              <li className="hover:text-white transition-colors">Strict JD Sentence Citations</li>
              <li className="hover:text-white transition-colors">Required vs Preferred Weights</li>
            </ul>
          </div>

          {/* Privacy & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Privacy & Controls
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors">Isolated User Storage Sandbox</li>
              <li className="hover:text-white transition-colors">One-Click Resume Purge</li>
              <li className="hover:text-white transition-colors">Zero Document LLM Leakage</li>
              <li className="hover:text-white transition-colors">Verified Answer Key Benchmark</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillGap AI. Built for precision candidate-role alignment.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All Extraction & Matching Services Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
