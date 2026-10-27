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
  ExternalLink,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { GoogleAccount, PlatformModule } from '../types';

interface HeaderProps {
  currentModule: PlatformModule;
  availableModules: PlatformModule[];
  onSelectModule: (module: PlatformModule) => void;
  googleAccount: GoogleAccount;
  activeDomain: string;
  availableDomains: string[];
  onSelectDomain: (domain: string) => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  availableModules,
  onSelectModule,
  googleAccount,
  activeDomain,
  availableDomains,
  onSelectDomain,
  onRefreshData,
  isRefreshing,
}) => {
  const [showModuleMenu, setShowModuleMenu] = useState(false);
  const [showDomainMenu, setShowDomainMenu] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Modular Platform Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    RankAgent
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded">
                    OS
                  </span>
                  <span className="hidden sm:inline-flex text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full items-center space-x-1">
                    <span>⚡ Built by Dheeraj</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Autonomous SEO & Implementation OS &bull; by Dheeraj</div>
              </div>
            </div>

            {/* Platform Module Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowModuleMenu(!showModuleMenu)}
                className="hidden md:flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 transition-colors"
                aria-label="Switch Platform Module"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentModule.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showModuleMenu && (
                <div 
                  className="absolute left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowModuleMenu(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
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
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start space-x-3 ${
                          m.isActive
                            ? 'hover:bg-slate-700/80 text-white cursor-pointer'
                            : 'opacity-50 cursor-not-allowed text-slate-400'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md mt-0.5 ${m.isActive ? 'bg-blue-600/30 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{m.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${m.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                              {m.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{m.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Domain Selector & Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Domain Picker */}
            <div className="relative">
              <button
                onClick={() => setShowDomainMenu(!showDomainMenu)}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 transition-colors"
                aria-label="Select Active Website"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[140px] truncate">{activeDomain.replace(/^https?:\/\//, '')}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showDomainMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-1.5 z-50"
                  onMouseLeave={() => setShowDomainMenu(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Connected Websites
                  </div>
                  {availableDomains.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => {
                        onSelectDomain(domain);
                        setShowDomainMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        activeDomain === domain
                          ? 'bg-blue-600/30 text-blue-200 font-semibold'
                          : 'hover:bg-slate-700/70 text-slate-300'
                      }`}
                    >
                      <span className="truncate">{domain}</span>
                      {activeDomain === domain && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh / Sync Button */}
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Sync latest GSC, GA4, and crawl data"
              aria-label="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            {/* Google Account Profile / Status */}
            <div className="relative">
              <button
                onClick={() => setShowAccountInfo(!showAccountInfo)}
                className="flex items-center space-x-2 bg-gradient-to-r from-slate-800 to-slate-850 hover:from-slate-750 hover:to-slate-800 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                aria-label="Google Account Integrations"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-[10px]">
                  G
                </div>
                <span className="hidden sm:inline text-slate-300 text-xs font-medium max-w-[130px] truncate">
                  {googleAccount.email.split('@')[0]}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>

              {showAccountInfo && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 text-xs"
                  onMouseLeave={() => setShowAccountInfo(false)}
                >
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      D
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-semibold text-white truncate">{googleAccount.name}</div>
                      <div className="text-slate-400 text-[11px] truncate">{googleAccount.email}</div>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-2">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center space-x-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Google Search Console</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">Connected</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center space-x-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Google Analytics 4</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">Connected</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center space-x-1.5 text-[11px]">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Gemini 3.8 Intelligence</span>
                      </span>
                      <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-1.5 py-0.5 rounded">Active</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Auto-sync enabled</span>
                    <span className="text-emerald-400 font-medium">All APIs Live</span>
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
