import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  FileText,
  Briefcase,
  BarChart3,
  Calendar,
  History,
  User as UserIcon,
  LogOut,
  Sparkles,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Layers,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasActiveAnalysis: boolean;
  onOpenDictionary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasActiveAnalysis,
  onOpenDictionary,
}) => {
  const { user, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'upload-resume', label: 'Upload Resume', icon: FileText },
    { id: 'job-description', label: 'Target JD', icon: Briefcase },
    {
      id: 'analysis-results',
      label: 'Gap Analysis',
      icon: Sparkles,
      badge: hasActiveAnalysis ? 'Ready' : undefined,
    },
    { id: 'learning-plan', label: '14-Day Plan', icon: Calendar },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-900 via-navy-900 to-indigo-950 flex items-center justify-center text-sky-400 shadow-xs group-hover:scale-105 transition-transform duration-200 ring-1 ring-slate-800/20">
              <Compass className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                SkillGap<span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-sky-200/80 tracking-wide uppercase shadow-2xs">
                PRO
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Clean, Single-Line, Segmented Control */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-xs shrink-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive ? 'text-sky-600 stroke-[2.2]' : 'text-slate-400'
                      }`}
                    />
                    <span className="whitespace-nowrap leading-none">{item.label}</span>
                    {item.badge && (
                      <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Skill Dictionary Modal Button */}
            <button
              onClick={onOpenDictionary}
              title="Explore Skill Synonym Knowledge Base"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-xs transition-all hover:border-slate-300"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Dictionary</span>
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-xl border transition-all text-xs font-semibold shadow-xs ${
                    userDropdownOpen
                      ? 'border-slate-400 bg-slate-100/80 text-slate-900'
                      : 'border-slate-200/90 hover:border-slate-300 bg-white text-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center text-xs font-extrabold shadow-2xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="truncate max-w-[100px] hidden md:inline">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 py-1.5 text-xs z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-slate-400 text-[11px] truncate mt-0.5">{user.email}</p>
                      <span className="inline-block mt-1.5 text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                        {user.targetRole || 'Software Engineer'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenDictionary();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-sky-600" />
                        <span>Synonym Dictionary</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => demoLogin()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-xl transition-all shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>Try Demo</span>
                </button>
                <button
                  onClick={() => handleNavClick('auth')}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-xl">
          {user ? (
            <>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>My Profile ({user.email})</span>
                </button>
                <button
                  onClick={() => {
                    onOpenDictionary();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>Synonym Knowledge Base</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  demoLogin();
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl"
              >
                Launch Live Demo Account
              </button>
              <button
                onClick={() => handleNavClick('auth')}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
