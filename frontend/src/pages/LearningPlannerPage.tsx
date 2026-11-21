import React, { useState } from 'react';
import { AnalysisResult, DailySchedule } from '../types';
import { api } from '../services/api';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  BookOpen,
  FolderGit2,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCheck,
} from 'lucide-react';

interface LearningPlannerPageProps {
  analysis: AnalysisResult | null;
  onRefreshAnalysis: () => void;
}

export const LearningPlannerPage: React.FC<LearningPlannerPageProps> = ({
  analysis,
  onRefreshAnalysis,
}) => {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [updatingDay, setUpdatingDay] = useState<number | null>(null);

  if (!analysis || !analysis.learningPlan) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-navy-950">No Active Learning Roadmap</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Run a gap analysis between your resume and a target job description to generate your personalized 14-day skill plan.
        </p>
      </div>
    );
  }

  const { learningPlan } = analysis;
  const { topMissingSkills, dailySchedules, title } = learningPlan;

  // Toggle completion
  const handleToggleDay = async (dayNumber: number, currentStatus: boolean) => {
    setUpdatingDay(dayNumber);
    try {
      await api.updateLearningPlanDay(analysis.id, dayNumber, {
        isCompleted: !currentStatus,
      });
      onRefreshAnalysis();
    } catch (err: any) {
      console.error('Failed to update day status:', err);
    } finally {
      setUpdatingDay(null);
    }
  };

  const completedDaysCount = dailySchedules.filter((d) => d.isCompleted).length;
  const completionPercentage = Math.round((completedDaysCount / dailySchedules.length) * 100);

  // Filter schedules
  const filteredSchedules = dailySchedules.filter((d) => {
    if (selectedSkillFilter === 'all') return true;
    return d.skill.toLowerCase().includes(selectedSkillFilter.toLowerCase());
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Progress Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                Targeted 14-Day Skill Plan
              </span>
              <span className="text-xs text-slate-400">14 Days of Practical Growth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Prioritized from target role requirements: <strong>{topMissingSkills.join(' • ')}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Mastery Progress</span>
              <span className="text-lg font-black text-navy-900">
                {completedDaysCount} / {dailySchedules.length} Days
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-sky-500 flex items-center justify-center font-black text-xs text-sky-700 bg-sky-50">
              {completionPercentage}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-sky-600 h-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Day 1: Setup & Primitives</span>
            <span>Day 7: Mid-Plan Integration</span>
            <span>Day 14: Portfolio Capstone</span>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Skill:
        </span>
        <button
          onClick={() => setSelectedSkillFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
            selectedSkillFilter === 'all'
              ? 'bg-navy-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All 14 Days
        </button>
        {topMissingSkills.map((skill) => (
          <button
            key={skill}
            onClick={() => setSelectedSkillFilter(skill)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedSkillFilter === skill
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* 14 Days Schedule Grid */}
      <div className="space-y-4">
        {filteredSchedules.map((schedule) => {
          const isDone = schedule.isCompleted;
          const isUpdating = updatingDay === schedule.day;

          return (
            <div
              key={schedule.day}
              className={`p-6 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3.5">
                  {/* Completion Toggle */}
                  <button
                    onClick={() => handleToggleDay(schedule.day, isDone)}
                    disabled={isUpdating}
                    className="mt-1 transition-transform hover:scale-110"
                    title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-sky-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
                        Day {schedule.day}
                      </span>
                      <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {schedule.skill}
                      </span>
                      {isDone && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                          Completed ✓
                        </span>
                      )}
                    </div>
                    <h3 className={`text-base font-bold mt-1.5 ${isDone ? 'text-emerald-950 line-through opacity-80' : 'text-navy-950'}`}>
                      {schedule.topic}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto shrink-0 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{schedule.estimatedTime}</span>
                </div>
              </div>

              {/* Day Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
                {/* Learning Objective & Practical Task */}
                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                      Learning Objective:
                    </span>
                    <p className="text-slate-600 leading-relaxed">{schedule.learningObjective}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                      Practical Task:
                    </span>
                    <p className="text-slate-700 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                      {schedule.practicalTask}
                    </p>
                  </div>
                </div>

                {/* Free Verified Resources & Mini Project */}
                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5">
                      Free Learning Resources:
                    </span>
                    <div className="space-y-1.5">
                      {schedule.freeResources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 bg-white hover:bg-sky-50 rounded-lg border border-slate-200 hover:border-sky-300 transition-colors group"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span className="font-semibold text-slate-800 text-[11px] truncate group-hover:text-sky-800">
                              {res.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                            {res.type}
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-600" />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {schedule.miniProject && (
                    <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                        <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Mini-Project: {schedule.miniProject.title}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {schedule.miniProject.instructions}
                      </p>
                      <p className="text-indigo-800 text-[11px] font-semibold pt-1">
                        📦 Deliverable: {schedule.miniProject.deliverable}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
