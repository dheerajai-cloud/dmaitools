/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  ChevronDown, 
  Globe, 
  CheckCircle2, 
  RefreshCw, 
  Plus,
  User,
  LogOut,
  Sun,
  Moon,
  Award,
  Zap
} from 'lucide-react';
import { GoogleAccount, PlatformModule, UserProfile, ThemeMode } from '../types';
import { PLATFORM_CREATOR } from '../data/mockData';

interface HeaderProps {
  currentModule: PlatformModule;
  availableModules: PlatformModule[];
  onSelectModule: (module: PlatformModule) => void;
  currentUser: UserProfile;
  googleAccount: GoogleAccount;
  activeDomain: string;
  availableDomains: string[];
  onSelectDomain: (domain: string) => void;
  onOpenConnectModal: () => void;
  onOpenAuthModal: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  availableModules,
  onSelectModule,
  currentUser,
  googleAccount,
  activeDomain,
  availableDomains,
  onSelectDomain,
  onOpenConnectModal,
  onOpenAuthModal,
  onRefreshData,
  isRefreshing,
  theme,
  onToggleTheme,
}) => {
  const [showModuleMenu, setShowModuleMenu] = useState(false);
  const [showDomainMenu, setShowDomainMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
      isDark 
        ? 'bg-slate-900/95 border-slate-800 text-white shadow-lg' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Modular Platform Selector */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className={`font-bold text-base sm:text-lg tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    RankAgent
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                    OS
                  </span>
                  {/* Platform Creator Attribution Badge */}
                  <button
                    onClick={onOpenAuthModal}
                    className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full hover:bg-emerald-500/25 transition-colors"
                    title="Platform Architecture & Creator Profile"
                  >
                    <span>⚡ Built by Dheeraj Mohan</span>
                  </button>
                </div>
                <div className={`text-[11px] font-medium hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Autonomous Multi-User SEO & Analytics Automation OS
                </div>
              </div>
            </div>

            {/* Platform Module Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowModuleMenu(!showModuleMenu)}
                className={`hidden md:flex items-center space-x-2 border px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-150 border-slate-200 text-slate-700'
                }`}
                aria-label="Switch Platform Module"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>{currentModule.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showModuleMenu && (
                <div 
                  className={`absolute left-0 mt-2 w-80 rounded-xl shadow-2xl p-2 z-50 border animate-in fade-in duration-150 ${
                    isDark ? 'bg-slate-850 border-slate-750' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  onMouseLeave={() => setShowModuleMenu(false)}
                >
                  <div className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wider border-b ${
                    isDark ? 'text-slate-400 border-slate-750' : 'text-slate-500 border-slate-100'
                  }`}>
                    Platform Modular Suite
                  </div>
                  <div className="mt-1 space-y-1">
                    {availableModules.map((m) => (
                      <button
                        key={m.id}
                        disabled={!m.isActive}
                        onClick={() => {
                          onSelectModule(m);
                          setShowModuleMenu(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start space-x-2.5 ${
                          m.id === currentModule.id
                            ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                            : m.isActive
                              ? isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                              : 'opacity-40 cursor-not-allowed text-slate-400'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span>{m.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              m.isActive 
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {m.badge}
                            </span>
                          </div>
                          <p className={`text-[11px] mt-0.5 font-normal leading-snug ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {m.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Domain Selector, Sync, Theme Toggle & User Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Active Website / Domain Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDomainMenu(!showDomainMenu)}
                className={`flex items-center space-x-1.5 sm:space-x-2 border px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-800'
                }`}
                title="Select Connected Domain"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span className="max-w-[120px] sm:max-w-[170px] truncate font-semibold">
                  {activeDomain.replace(/^https?:\/\//, '')}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showDomainMenu && (
                <div 
                  className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl p-2 z-50 border animate-in fade-in duration-150 ${
                    isDark ? 'bg-slate-850 border-slate-750' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  onMouseLeave={() => setShowDomainMenu(false)}
                >
                  <div className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border-b flex items-center justify-between ${
                    isDark ? 'text-slate-400 border-slate-750' : 'text-slate-500 border-slate-100'
                  }`}>
                    <span>Connected Domains</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400">{availableDomains.length} Active</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {availableDomains.map((domain) => (
                      <button
                        key={domain}
                        onClick={() => {
                          onSelectDomain(domain);
                          setShowDomainMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          activeDomain === domain
                            ? 'bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                            : isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{domain.replace(/^https?:\/\//, '')}</span>
                        {activeDomain === domain && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {/* Add New Website Option */}
                  <div className={`mt-2 pt-2 border-t ${isDark ? 'border-slate-750' : 'border-slate-100'}`}>
                    <button
                      onClick={() => {
                        setShowDomainMenu(false);
                        onOpenConnectModal();
                      }}
                      className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Connect New Website</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh / Sync Button */}
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className={`p-2 rounded-xl border transition-colors ${
                isDark 
                  ? 'border-slate-750 text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Sync latest GSC, GA4, and crawl data"
              aria-label="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                isDark 
                  ? 'border-slate-750 text-amber-400 hover:bg-slate-800' 
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title={isDark ? 'Switch to Crisp Light Theme' : 'Switch to Pro Midnight Theme'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Logged-In User Profile / Google Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-2 border px-2.5 py-1.5 rounded-xl text-xs transition-all shadow-sm ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                }`}
                aria-label="User Account Menu"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left truncate max-w-[110px]">
                  <div className="font-semibold text-xs leading-none truncate">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className={`text-[10px] leading-tight truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {currentUser.email.split('@')[0]}
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserMenu && (
                <div 
                  className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl p-3 z-50 border text-xs animate-in fade-in duration-150 ${
                    isDark ? 'bg-slate-850 border-slate-750 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className={`p-2.5 rounded-xl border flex items-center space-x-3 mb-2.5 ${
                    isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold truncate text-slate-900 dark:text-white">
                        {currentUser.name}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                        {currentUser.email}
                      </div>
                      <span className="inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ● Signed In User
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-medium">Switch Google Account</span>
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenConnectModal();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-medium">Connect Website Property</span>
                      <Plus className="w-3.5 h-3.5 text-emerald-500" />
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-medium">Creator & Architect Info</span>
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                  </div>

                  <div className={`pt-2 mt-1 border-t flex items-center justify-between text-[11px] ${
                    isDark ? 'border-slate-750 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span>Auto-sync API Live</span>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal();
                      }}
                      className="text-red-500 hover:underline font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
