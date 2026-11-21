import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  ShieldCheck,
  Mail,
  Briefcase,
  Award,
  Calendar,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'entry');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await api.updateProfile({
        name,
        targetRole,
        experienceLevel: experienceLevel as any,
      });
      if (res.success) {
        setMessage('Profile updated successfully!');
        await refreshUser();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurgeAllData = async () => {
    const confirmation = prompt(
      'Warning: This will permanently delete all your uploaded resumes, parsed job descriptions, and gap analysis records. Type "DELETE" to confirm:'
    );
    if (confirmation !== 'DELETE') return;

    try {
      const [resumes, jds, analyses] = await Promise.all([
        api.getResumes().catch(() => ({ resumes: [] })),
        api.getJobDescriptions().catch(() => ({ jobDescriptions: [] })),
        api.getAnalysisHistory().catch(() => ({ history: [] })),
      ]);

      for (const r of resumes.resumes || []) {
        await api.deleteResume(r.id).catch(() => {});
      }
      for (const j of jds.jobDescriptions || []) {
        await api.deleteJobDescription(j.id).catch(() => {});
      }
      for (const a of analyses.history || []) {
        await api.deleteAnalysis(a.id).catch(() => {});
      }

      alert('All uploaded resumes and analysis data have been securely wiped.');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error purging data.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Candidate Profile & Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your career target parameters and account security controls.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-950">{user?.name}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
              >
                <option value="Full Stack Software Engineer">Full Stack Developer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                <option value="AI / ML Engineer">AI / Machine Learning Engineer</option>
                <option value="Data Engineer">Data Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
              >
                <option value="entry">Entry Level (0 - 2 Years)</option>
                <option value="mid">Mid Level (2 - 5 Years)</option>
                <option value="senior">Senior Engineer (5 - 8 Years)</option>
                <option value="lead">Lead / Principal (8+ Years)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Privacy Compliance Box */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-rose-700">
          <Trash2 className="w-5 h-5" />
          <h3 className="font-bold text-sm uppercase tracking-wide">
            Privacy & Data Deletion Controls
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          As part of our commitment to candidate data protection, you have full authority to purge your uploaded resumes, extracted skill histories, and 14-day learning schedules at any time.
        </p>
        <button
          onClick={handlePurgeAllData}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Purge All Resumes & Analysis Archive</span>
        </button>
      </div>
    </div>
  );
};
