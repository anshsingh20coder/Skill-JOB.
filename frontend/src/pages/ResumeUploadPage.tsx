import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { Resume } from '../types';
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Layers,
  Eye,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface ResumeUploadPageProps {
  onSelectResumeForAnalysis: (resumeId: string) => void;
  selectedResumeId?: string;
}

export const ResumeUploadPage: React.FC<ResumeUploadPageProps> = ({
  onSelectResumeForAnalysis,
  selectedResumeId,
}) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastUploaded, setLastUploaded] = useState<Resume | null>(null);
  const [previewResume, setPreviewResume] = useState<(Resume & { extractedText: string }) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const res = await api.getResumes();
      if (res.success) {
        setResumes(res.resumes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileProcess = async (file: File) => {
    setError(null);

    // Validate type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid file format. Please upload a PDF document (.pdf).');
      return;
    }

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(25);

    try {
      setUploadProgress(60);
      const res = await api.uploadResume(file);
      setUploadProgress(100);

      if (res.success && res.resume) {
        setLastUploaded(res.resume);
        onSelectResumeForAnalysis(res.resume.id);
        await loadResumes();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.deleteResume(id);
      await loadResumes();
      if (lastUploaded?.id === id) setLastUploaded(null);
      if (previewResume?.id === id) setPreviewResume(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleViewPreview = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.getResumeById(id);
      if (res.success) {
        setPreviewResume(res.resume);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to load preview');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Resume Document Upload & Extraction
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload your resume in PDF format. Supports multi-column layouts, tabular structures, and automated OCR for scanned documents.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-sky-500 bg-sky-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-slate-400 bg-white'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
          accept=".pdf,application/pdf"
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-sm">
            <UploadCloud className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div>
            <h3 className="font-bold text-navy-900 text-base">
              Drag & Drop your resume PDF here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              or <span className="text-sky-600 font-semibold underline">browse from your computer</span> (Max: 10MB)
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 font-medium">
            <span>• Two-Column Layout Detection</span>
            <span>• Scanned OCR Support</span>
            <span>• Full Skill Extraction</span>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mt-6 max-w-sm mx-auto space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-600 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Parsing PDF layout & extracting technical competencies...
            </p>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Resume Processing Alert</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Last Uploaded Preview & Warnings Card */}
      {lastUploaded && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-navy-900 text-sm">{lastUploaded.originalName}</h3>
                <p className="text-xs text-slate-500">
                  {lastUploaded.pageCount} page(s) • {(lastUploaded.fileSize / 1024).toFixed(1)} KB • Extraction Confidence: {lastUploaded.extractionConfidence}%
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectResumeForAnalysis(lastUploaded.id)}
              className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Selected for Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Warnings Banner if any */}
          {lastUploaded.hasWarnings && lastUploaded.warnings && lastUploaded.warnings.length > 0 && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Extraction Advisory Notices:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-amber-800">
                {lastUploaded.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracted Skills Preview */}
          {lastUploaded.extractedSkills && lastUploaded.extractedSkills.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Identified Competencies ({lastUploaded.extractedSkills.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lastUploaded.extractedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-2 py-1 rounded-md font-medium"
                  >
                    {s.canonicalName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Resumes Library */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-navy-900 text-base">Your Resume Library</h3>
            <p className="text-xs text-slate-500">
              Select any resume below to run gap analysis against target job descriptions
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {resumes.length} document(s) stored
          </span>
        </div>

        {resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map((r) => {
              const isSelected = selectedResumeId === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => onSelectResumeForAnalysis(r.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy-900 text-sm line-clamp-1">
                          {r.originalName}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {r.pageCount} page(s) • {(r.fileSize / 1024).toFixed(1)} KB • {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleViewPreview(r.id, e)}
                        title="View Extracted Text"
                        className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(r.id, e)}
                        title="Delete resume"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-500">
                      Extraction Confidence: <strong className="text-navy-900">{r.extractionConfidence}%</strong>
                    </span>
                    {isSelected ? (
                      <span className="text-sky-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Selected
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
            No resumes uploaded yet. Upload a PDF above to begin.
          </div>
        )}
      </div>

      {/* Extracted Text Modal Preview */}
      {previewResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-navy-900 text-sm">
                Extracted Text: {previewResume.originalName}
              </h3>
              <button
                onClick={() => setPreviewResume(null)}
                className="text-xs font-semibold text-slate-500 hover:text-navy-900"
              >
                Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/50">
              {previewResume.extractedText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
