import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { JobDescription } from '../types';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Clock,
  Layers,
  Award,
  AlertCircle,
} from 'lucide-react';

interface JobDescriptionPageProps {
  onSelectJdForAnalysis: (jdId: string) => void;
  selectedJdId?: string;
  onProceedToAnalysis: () => void;
  hasSelectedResume: boolean;
}

export const JobDescriptionPage: React.FC<JobDescriptionPageProps> = ({
  onSelectJdForAnalysis,
  selectedJdId,
  onProceedToAnalysis,
  hasSelectedResume,
}) => {
  const [jds, setJds] = useState<JobDescription[]>([]);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<JobDescription | null>(null);

  useEffect(() => {
    loadJobDescriptions();
  }, []);

  const loadJobDescriptions = async () => {
    try {
      const res = await api.getJobDescriptions();
      if (res.success) {
        setJds(res.jobDescriptions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const samplePresets = [
    {
      label: 'Senior Full Stack (React, Node, Docker, AWS)',
      title: 'Senior Full-Stack Software Engineer',
      company: 'CloudNexus Technologies',
      text: `About The Role:
We are seeking an experienced Senior Full-Stack Engineer to lead the design and implementation of modern web platforms.

Requirements:
- 4+ years of professional full-stack development experience.
- Strong proficiency with React (ReactJS), modern JavaScript, and TypeScript is required.
- Proven experience building RESTful backend APIs with Node.js is required.
- Experience with Docker and containerized deployments is required.
- Strong proficiency in relational database architecture using PostgreSQL is required.
- Hands-on experience deploying scalable cloud services on AWS is required.
- Excellent verbal and written Communication skills are required for cross-team alignment.

Preferred Qualifications:
- Familiarity with automated CI/CD deployment pipelines using GitHub Actions is preferred.
- Prior exposure to Redis in-memory caching is a plus.`
    },
    {
      label: 'Cloud DevOps Engineer (Kubernetes, Terraform, AWS, Linux)',
      title: 'Cloud DevOps & Site Reliability Engineer',
      company: 'SkyScale Systems',
      text: `We are looking for a Cloud DevOps Engineer to scale our distributed cloud footprint.

Core Requirements:
- 3+ years of dedicated DevOps or Site Reliability Engineering experience.
- Demonstrated expertise orchestrating production workloads on Kubernetes (K8s) is mandatory.
- Proven track record managing Infrastructure as Code via Terraform is required.
- Deep operational knowledge of AWS networking, VPC, and IAM policies is required.
- Strong scripting skills in Python and Bash for infrastructure automation are required.
- Hands-on experience creating Docker images and container runtimes is required.
- Proficiency configuring automated CI/CD pipelines is required.
- Deep familiarity with Linux operating systems is required.`
    },
    {
      label: 'Python / AI Backend (FastAPI, Redis, ML, Unit Testing)',
      title: 'Senior Backend Python & AI Engineer',
      company: 'CognitiveFlow AI Labs',
      text: `CognitiveFlow is seeking an experienced Backend Engineer to scale our AI-driven decision engines.

Requirements:
- Minimum 3+ years experience engineering backend web systems.
- Advanced expertise in Python programming is required.
- High proficiency building asynchronous microservices with FastAPI is required.
- Solid understanding of relational database schema design in PostgreSQL is required.
- Experience leveraging Redis for distributed caching is required.
- Foundational knowledge of Machine Learning pipelines is required.
- Must have experience packaging services inside Docker containers.
- Rigorous commitment to Unit Testing and TDD using PyTest or Jest is required.`
    }
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setTitle(preset.title);
    setCompany(preset.company);
    setText(preset.text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || text.trim().length < 25) {
      setError('Please enter a valid job description with at least 25 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await api.createJobDescription({
        title: title.trim() || 'Software Engineer',
        company: company.trim() || 'Target Employer',
        text: text.trim(),
      });

      if (res.success && res.jobDescription) {
        setLastCreated(res.jobDescription);
        onSelectJdForAnalysis(res.jobDescription.id);
        await loadJobDescriptions();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process job description.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this job description?')) return;
    try {
      await api.deleteJobDescription(id);
      await loadJobDescriptions();
      if (lastCreated?.id === id) setLastCreated(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Target Job Description Input
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Paste any complete job posting. Our NLP engine classifies technical skills, soft competencies, and isolates required vs preferred qualifications.
        </p>
      </div>

      {/* Preset Quick Fill Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
          Quick Presets:
        </span>
        {samplePresets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleApplyPreset(preset)}
            className="text-xs font-medium px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title / Target Position
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company / Organization
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. CloudNexus Technologies"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Complete Job Description Text
            </label>
            <span className="text-[11px] text-slate-400">
              {text.length} characters • {text.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            rows={8}
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste complete job description text here, including requirements, responsibilities, and preferred qualifications..."
            className="w-full p-3 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
          <p className="text-xs text-slate-500">
            Skills are automatically checked against the centralized synonym dictionary.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-lg shadow-sm text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Parse Requirements</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Extracted Preview Card */}
      {lastCreated && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Parsed Successfully
                </span>
                <span className="text-xs text-slate-500">Experience Requirement: {lastCreated.experienceRequirement}</span>
              </div>
              <h3 className="font-bold text-navy-900 text-base mt-1">
                {lastCreated.title} @ {lastCreated.company}
              </h3>
            </div>

            {hasSelectedResume ? (
              <button
                onClick={onProceedToAnalysis}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 self-start sm:self-auto hover:scale-[1.02] transition-all"
              >
                <span>Run Precision Gap Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                Please upload or select a resume next
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Required Skills */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-navy-900 block">
                Required Qualifications ({lastCreated.requiredSkills?.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lastCreated.requiredSkills?.map((s, idx) => (
                  <span
                    key={idx}
                    title={s.evidenceSentence}
                    className="bg-navy-900 text-white px-2 py-0.5 rounded text-[11px] font-medium"
                  >
                    {s.canonicalName}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-navy-900 block">
                Preferred / Nice-to-have ({lastCreated.preferredSkills?.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lastCreated.preferredSkills?.map((s, idx) => (
                  <span
                    key={idx}
                    title={s.evidenceSentence}
                    className="bg-sky-100 text-sky-900 border border-sky-200 px-2 py-0.5 rounded text-[11px] font-medium"
                  >
                    {s.canonicalName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved JDs Library */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-navy-900 text-base">Your Saved Target Roles</h3>
            <p className="text-xs text-slate-500">
              Select any role below to benchmark your resume against
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">{jds.length} role(s)</span>
        </div>

        {jds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jds.map((j) => {
              const isSelected = selectedJdId === j.id;
              return (
                <div
                  key={j.id}
                  onClick={() => onSelectJdForAnalysis(j.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy-900 text-sm line-clamp-1">{j.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {j.company} • {j.experienceRequirement}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(j.id, e)}
                      title="Delete job description"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-500">
                      Req: <strong className="text-navy-900">{j.requiredCount || 0}</strong> • Pref:{' '}
                      <strong className="text-navy-900">{j.preferredCount || 0}</strong>
                    </span>
                    {isSelected ? (
                      <span className="text-sky-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium hover:text-navy-900">
                        Click to select
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-xs">
            No job descriptions entered yet. Use the form above to add your first target role.
          </div>
        )}
      </div>
    </div>
  );
};
