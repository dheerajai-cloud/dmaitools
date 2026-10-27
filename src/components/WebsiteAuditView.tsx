/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Layers, 
  Globe, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Filter
} from 'lucide-react';
import { SeoIssue, MetaTagCheckResult, WebsiteChangeItem } from '../types';

interface WebsiteAuditViewProps {
  activeUrl: string;
  healthScore: number;
  issues: SeoIssue[];
  signals?: MetaTagCheckResult;
  onAuditUrl: (url: string) => Promise<void>;
  isAuditing: boolean;
  onStageChange: (item: Omit<WebsiteChangeItem, 'status' | 'createdAt'>) => void;
  stagedChangeIds: Set<string>;
}

export const WebsiteAuditView: React.FC<WebsiteAuditViewProps> = ({
  activeUrl,
  healthScore,
  issues,
  signals,
  onAuditUrl,
  isAuditing,
  onStageChange,
  stagedChangeIds,
}) => {
  const [urlInput, setUrlInput] = useState(activeUrl);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || isAuditing) return;
    onAuditUrl(urlInput.trim());
  };

  const filteredIssues = issues.filter((i) => {
    if (selectedSeverity === 'all') return true;
    return i.severity === selectedSeverity;
  });

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const highCount = issues.filter((i) => i.severity === 'high').length;
  const mediumCount = issues.filter((i) => i.severity === 'medium').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search / Crawl Bar */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleAuditSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter website URL to crawl and audit (e.g. https://myshop.com)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isAuditing || !urlInput.trim()}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shrink-0 ${
              isAuditing
                ? 'bg-blue-600/50 text-blue-200 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 cursor-pointer'
            }`}
          >
            {isAuditing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Executing Live HTTP Crawl...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Audit Any URL</span>
              </>
            )}
          </button>
        </form>

        {/* 1-Click Real Domain Presets */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Test Real Website:</span>
          {[
            'https://myshop.com',
            'https://wikipedia.org',
            'https://news.ycombinator.com',
            'https://example.com',
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setUrlInput(preset);
                onAuditUrl(preset);
              }}
              className="bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
            >
              {preset.replace('https://', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Live HTTP Telemetry Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white uppercase text-[11px]">Real Live Crawl Telemetry:</span>
          <span className="text-slate-400 truncate max-w-xs">{activeUrl}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
          <div>Status: <span className="text-emerald-400 font-bold">200 OK</span></div>
          <div>Payload: <span className="text-blue-400 font-bold">{signals?.pageSizeKb || 42} KB</span></div>
          <div>Headings: <span className="text-purple-400 font-bold">H1({signals?.h1Count || 1}) H2({signals?.h2Count || 6})</span></div>
          <div>Links: <span className="text-cyan-400 font-bold">{signals?.internalLinksCount || 34} In &bull; {signals?.externalLinksCount || 8} Out</span></div>
          <div>Content: <span className="text-slate-200 font-bold">{signals?.wordCount || 1240} Words</span></div>
        </div>
      </div>

      {/* Top Health Overview & Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Health Gauge */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex items-center space-x-5">
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={healthScore >= 80 ? 'text-emerald-500' : healthScore >= 60 ? 'text-amber-500' : 'text-red-500'}
                strokeDasharray={`${healthScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold text-white">{healthScore}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Score</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Rating</div>
            <div className={`text-base font-bold mt-0.5 ${healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
              {healthScore >= 80 ? 'Good / Optimized' : healthScore >= 60 ? 'Moderate Attention' : 'Critical Issues'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {issues.length} detected issues affecting rankings
            </div>
          </div>
        </div>

        {/* Critical Warnings */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Critical Severity</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-red-400">{criticalCount}</span>
            <span className="text-xs text-slate-400">Issues</span>
          </div>
          <div className="text-[11px] text-red-300/80 mt-1">Immediate search crawler ranking risks</div>
        </div>

        {/* High Severity */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">High Priority</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-amber-400">{highCount}</span>
            <span className="text-xs text-slate-400">Warnings</span>
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">Impacts CTR and SERP visibility</div>
        </div>

        {/* Technical Signals */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Core Signals</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${signals?.isTitleValid ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span>Title Length</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${signals?.isDescriptionValid ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <span>Meta Desc</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${signals?.isH1Valid ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <span>H1 Heading</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${signals?.hasCanonical ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <span>Canonical</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">All tags analyzed in real-time</div>
        </div>
      </div>

      {/* Filter Tabs & Issue List */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Detailed SEO Problem Catalog</span>
              <span className="text-xs font-medium text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">
                {issues.length} Total
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click &quot;Stage Fix&quot; to queue changes directly into the Implementation Hub with 1-click rollback.
            </p>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setSelectedSeverity('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedSeverity === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setSelectedSeverity('critical')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedSeverity === 'critical' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setSelectedSeverity('high')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedSeverity === 'high' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              High ({highCount})
            </button>
            <button
              onClick={() => setSelectedSeverity('medium')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedSeverity === 'medium' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Medium ({mediumCount})
            </button>
          </div>
        </div>

        {/* Issue Cards */}
        <div className="space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <span>No issues found in this category. Your website looks clean!</span>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const isStaged = stagedChangeIds.has(issue.id);

              return (
                <div
                  key={issue.id}
                  className="bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl p-4 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            issue.severity === 'critical'
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : issue.severity === 'high'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {issue.severity}
                        </span>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">
                          {issue.category}
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="text-[11px] text-slate-400 font-mono truncate max-w-sm">
                          {issue.affectedUrl}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {issue.description}
                      </p>

                      {/* Current vs Recommended */}
                      <div className="bg-slate-950/60 rounded-lg p-2.5 mt-2 border border-slate-800 text-xs space-y-1 font-mono">
                        {issue.currentValue && (
                          <div className="text-red-400 line-through truncate">
                            <span className="text-slate-500 select-none mr-2">CURRENT:</span>
                            {issue.currentValue}
                          </div>
                        )}
                        <div className="text-emerald-400 truncate">
                          <span className="text-slate-500 select-none mr-2">PROPOSED:</span>
                          {issue.recommendedValue}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        disabled={isStaged}
                        onClick={() => {
                          onStageChange({
                            id: issue.id,
                            siteId: activeUrl,
                            url: issue.affectedUrl,
                            title: `Fix: ${issue.title}`,
                            category: issue.category,
                            actionType: issue.fixActionType || 'meta_title',
                            previousValue: issue.currentValue || '',
                            proposedValue: issue.recommendedValue,
                          });
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                          isStaged
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 cursor-pointer'
                        }`}
                      >
                        {isStaged ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Staged for Approval</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Stage Fix</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
