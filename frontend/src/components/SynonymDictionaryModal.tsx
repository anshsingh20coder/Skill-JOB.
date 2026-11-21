import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, Search, CheckCircle, AlertCircle, BookOpen, ArrowRight, Sparkles, Command } from 'lucide-react';

interface SynonymDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SynonymDictionaryModal: React.FC<SynonymDictionaryModalProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<Record<string, any[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [testSkillA, setTestSkillA] = useState('ReactJS');
  const [testSkillB, setTestSkillB] = useState('React.js');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getSkillsDictionary().then((res) => {
        if (res.success) {
          setCategories(res.categories);
        }
      });
      // Initial test
      runSynonymCheck('ReactJS', 'React.js');
    }
  }, [isOpen]);

  const runSynonymCheck = async (a: string, b: string) => {
    if (!a.trim() || !b.trim()) return;
    setIsTesting(true);
    try {
      const res = await api.checkSynonym(a, b);
      if (res.success) {
        setTestResult(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  const categoryNames = ['All', ...Object.keys(categories)];

  // Filter skills
  const allSkills: any[] = [];
  for (const [cat, skills] of Object.entries(categories)) {
    for (const skill of skills) {
      allSkills.push({ ...skill, category: cat });
    }
  }

  const filteredSkills = allSkills.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.canonical.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.synonyms.some((syn: string) => syn.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden">
        {/* Header */}
        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950 text-base tracking-tight">
                Centralized Skill Synonym Knowledge Base
              </h3>
              <p className="text-xs text-slate-500">
                Deterministic alias resolution ensuring zero false negatives on synonymous tech terms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-200/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Synonym Tester Bar */}
        <div className="px-7 py-4 bg-gradient-to-r from-sky-50/70 via-indigo-50/40 to-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wide">
                Live Equivalence Checker
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Click any tag below to auto-test</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <input
              type="text"
              value={testSkillA}
              onChange={(e) => setTestSkillA(e.target.value)}
              placeholder="e.g. ReactJS"
              className="w-full sm:w-1/3 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium"
            />
            <span className="text-xs font-bold text-slate-400">vs</span>
            <input
              type="text"
              value={testSkillB}
              onChange={(e) => setTestSkillB(e.target.value)}
              placeholder="e.g. React.js"
              className="w-full sm:w-1/3 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium"
            />
            <button
              onClick={() => runSynonymCheck(testSkillA, testSkillB)}
              disabled={isTesting}
              className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs whitespace-nowrap"
            >
              Verify Match
            </button>
          </div>

          {testResult && (
            <div
              className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                testResult.isEquivalent
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              {testResult.isEquivalent ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span className="font-semibold">{testResult.explanation}</span>
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="px-7 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-3 bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skill or alias..."
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Cards Grid */}
        <div className="flex-1 overflow-y-auto p-7 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-sky-300 hover:shadow-xs transition-all space-y-2"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm">{skill.canonical}</h4>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {skill.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {skill.description}
                </p>

                {/* Synonyms */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Normalized Aliases:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {skill.synonyms.map((syn: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        onClick={() => {
                          setTestSkillA(syn);
                          setTestSkillB(skill.canonical);
                          runSynonymCheck(syn, skill.canonical);
                        }}
                        title="Click to test alias"
                        className="text-[11px] font-mono bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200/80 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-xs">
              No matching skills found in dictionary.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
