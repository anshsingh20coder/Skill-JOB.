import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AnalysisHistoryItem } from '../types';
import {
  History,
  FileText,
  Briefcase,
  Trash2,
  Download,
  ArrowRight,
  Search,
  Calendar,
  Layers,
} from 'lucide-react';

interface HistoryPageProps {
  onSelectAnalysis: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectAnalysis }) => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalysisHistory();
      if (res.success) {
        setHistory(res.history);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis report?')) return;
    try {
      await api.deleteAnalysis(id);
      await loadHistory();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleExport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(api.getExportUrl(id), '_blank');
  };

  const filtered = history.filter(
    (item) =>
      item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.resumeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Gap Analysis History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review all previous role benchmarks, download exported markdown summaries, and track your progression over time.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by role, company, or resume name..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {history.length} report(s) archived
        </span>
      </div>

      {/* History Cards / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Target Position & Employer</th>
                  <th className="px-6 py-4">Resume File</th>
                  <th className="px-6 py-4">Overall Match</th>
                  <th className="px-6 py-4">Required Match</th>
                  <th className="px-6 py-4">Gaps Identified</th>
                  <th className="px-6 py-4">Analysis Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectAnalysis(item.id)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-navy-900">
                      {item.jobTitle}
                      <span className="block text-[11px] text-slate-500 font-normal mt-0.5">
                        {item.company}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {item.resumeName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block font-extrabold px-2.5 py-1 rounded text-xs ${
                          item.overallMatchPercentage >= 70
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.overallMatchPercentage >= 40
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.overallMatchPercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {item.requiredMatchPercentage}%
                    </td>
                    <td className="px-6 py-4 text-rose-700 font-bold">
                      {item.missingCount} skills
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleExport(item.id, e)}
                          title="Export Markdown Report"
                          className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          title="Delete Report"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectAnalysis(item.id)}
                          className="px-3 py-1 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold ml-1"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 text-xs">
            {loading ? 'Loading analysis archive...' : 'No historical analyses found.'}
          </div>
        )}
      </div>
    </div>
  );
};
