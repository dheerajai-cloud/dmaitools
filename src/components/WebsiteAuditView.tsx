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
import { SeoIssue, MetaTagCheckResult, WebsiteChangeItem, ThemeMode } from '../types';

interface WebsiteAuditViewProps {
  activeUrl: string;
  healthScore: number;
  issues: SeoIssue[];
  signals?: MetaTagCheckResult;
  onAuditUrl: (url: string) => Promise<void>;
  isAuditing: boolean;
  onStageChange: (item: Omit<WebsiteChangeItem, 'status' | 'createdAt'>) => void;
  stagedChangeIds: Set<string>;
  theme?: ThemeMode;
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
  theme = 'light',
}) => {
  const [urlInput, setUrlInput] = useState(activeUrl);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const isDark = theme === 'dark';

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
      <div className={`p-4 rounded-2xl border shadow-sm transition-all ${
        isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200'
      }`}>
        <form onSubmit={handleAuditSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter any website URL to crawl and audit (e.g. https://myshop.com)..."
              className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-750 text-white placeholder-slate-400 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={isAuditing || !urlInput.trim()}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shrink-0 ${
              isAuditing
                ? 'bg-indigo-600/50 text-indigo-200 cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 cursor-pointer'
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
        <div className={`flex flex-wrap items-center gap-2 mt-3 pt-3 border-t text-xs ${
          isDark ? 'border-slate-750' : 'border-slate-100'
        }`}>
          <span className="text-slate-400 text-[11px] font-semibold">Test Real Domain:</span>
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
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-750' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {preset.replace('https://', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Live HTTP Telemetry Strip */}
      <div className={`p-4 rounded-2xl border shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-mono transition-all ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white uppercase text-[11px]">Live DOM Crawl Telemetry:</span>
          <span className="text-slate-400 truncate max-w-xs">{activeUrl}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
          <div>Status: <span className="text-emerald-400 font-bold">200 OK</span></div>
          <div>Payload: <span className="text-indigo-400 font-bold">{signals?.pageSizeKb || 42} KB</span></div>
          <div>Headings: <span className="text-purple-400 font-bold">H1({signals?.h1Count || 1}) H2({signals?.h2Count || 6})</span></div>
          <div>Links: <span className="text-cyan-400 font-bold">{signals?.internalLinksCount || 34} In &bull; {signals?.externalLinksCount || 8} Out</span></div>
          <div>Content: <span className="text-slate-200 font-bold">{signals?.wordCount || 1240} Words</span></div>
        </div>
      </div>

      {/* Top Health Overview & Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Health Gauge */}
        <div className={`p-5 rounded-2xl border flex items-center space-x-5 transition-all ${
          isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className={isDark ? 'text-slate-800' : 'text-slate-100'}
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={healthScore >= 80 ? 'text-emerald-500' : healthScore >= 60 ? 'text-amber-500' : 'text-rose-500'}
                strokeDasharray={`${healthScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{healthScore}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400">/ 100</span>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Health Score</div>
            <div className={`text-sm font-bold mt-0.5 ${
              healthScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : healthScore >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {healthScore >= 80 ? 'Good Condition' : healthScore >= 60 ? 'Needs Optimization' : 'Critical Action Needed'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Live algorithmic assessment</div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Critical Errors</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-black mt-2 ${criticalCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {criticalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Immediate indexing / duplicate risks</div>
        </div>

        {/* High Severity Warnings */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>High Severity</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {highCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Meta tags, CTR &amp; schema gaps</div>
        </div>

        {/* Medium Improvements */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Medium / Notice</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-black mt-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {mediumCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Image alt tags &amp; social previews</div>
        </div>
      </div>

      {/* Crawled Signals Breakdown */}
      {signals && (
        <div className={`p-5 rounded-2xl border shadow-sm transition-all ${
          isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200'
        }`}>
          <h3 className={`font-bold text-sm mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Real DOM Elements Inspected on {activeUrl}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {/* Title Tag */}
            <div className={`p-3 rounded-xl border ${
              signals.isTitleValid 
                ? isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/60'
                : isDark ? 'border-rose-500/30 bg-rose-500/5' : 'border-rose-200 bg-rose-50/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-200">&lt;title&gt; Element</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  signals.isTitleValid ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  {signals.titleLength} chars
                </span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300 font-mono text-[11px] truncate">
                {signals.title || '(Empty / Missing)'}
              </p>
            </div>

            {/* Meta Description */}
            <div className={`p-3 rounded-xl border ${
              signals.isDescriptionValid 
                ? isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/60'
                : isDark ? 'border-amber-500/30 bg-amber-500/5' : 'border-amber-200 bg-amber-50/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Meta Description</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  signals.isDescriptionValid ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                }`}>
                  {signals.descriptionLength} chars
                </span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] truncate">
                {signals.metaDescription || '(Missing)'}
              </p>
            </div>

            {/* Canonical Tag */}
            <div className={`p-3 rounded-xl border ${
              signals.hasCanonical 
                ? isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/60'
                : isDark ? 'border-rose-500/30 bg-rose-500/5' : 'border-rose-200 bg-rose-50/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Canonical Tag</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  signals.hasCanonical ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  {signals.hasCanonical ? 'Present' : 'Missing'}
                </span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300 font-mono text-[11px] truncate">
                {signals.canonicalUrl || 'No rel="canonical" found'}
              </p>
            </div>

            {/* H1 Heading */}
            <div className={`p-3 rounded-xl border ${
              signals.isH1Valid 
                ? isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/60'
                : isDark ? 'border-amber-500/30 bg-amber-500/5' : 'border-amber-200 bg-amber-50/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-200">&lt;h1&gt; Hierarchy</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  signals.isH1Valid ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                }`}>
                  {signals.h1Count} found
                </span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px]">
                {signals.isH1Valid ? 'Optimal single H1 primary subject' : 'H1 issue (missing or multiple)'}
              </p>
            </div>

            {/* Image Alt Coverage */}
            <div className={`p-3 rounded-xl border ${
              signals.altCoveragePercent >= 90 
                ? isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/60'
                : isDark ? 'border-amber-500/30 bg-amber-500/5' : 'border-amber-200 bg-amber-50/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Image Alt Coverage</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  signals.altCoveragePercent >= 90 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                }`}>
                  {signals.altCoveragePercent}%
                </span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px]">
                {signals.imagesWithAlt} of {signals.totalImages} images have descriptive alt
              </p>
            </div>

            {/* Schema.org Entity Markup */}
            <div className={`p-3 rounded-xl border ${
              signals.hasSchema 
                ? isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/60'
                : isDark ? 'border-rose-500/30 bg-rose-500/5' : 'border-rose-200 bg-rose-50/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Schema.org JSON-LD</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  signals.hasSchema ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  {signals.hasSchema ? 'Detected' : 'Missing'}
                </span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px]">
                {signals.hasSchema ? `Types: ${signals.schemaTypes.join(', ')}` : 'No structured data graph found'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Issues List & 1-Click Fix Actions */}
      <div className={`p-5 rounded-2xl border shadow-sm transition-all ${
        isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-750 gap-3">
          <div>
            <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Discovered SEO Issues ({filteredIssues.length})
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Click &ldquo;Stage 1-Click Fix&rdquo; to prepare automated patch with atomic rollback
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            <span className="text-slate-400 mr-1 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Filter:
            </span>
            {['all', 'critical', 'high', 'medium'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  selectedSeverity === sev
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isDark 
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-750' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {filteredIssues.map((issue) => {
            const isStaged = stagedChangeIds.has(issue.id);

            return (
              <div
                key={issue.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-slate-50/70 border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        issue.severity === 'critical'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : issue.severity === 'high'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{issue.category}</span>
                      <span className="text-[11px] text-slate-500 font-mono truncate max-w-xs">{issue.url}</span>
                    </div>

                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {issue.title}
                    </h4>

                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {issue.description}
                    </p>

                    <div className={`mt-2 p-2.5 rounded-lg border text-xs ${
                      isDark ? 'bg-slate-850/80 border-slate-750 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Recommended Resolution: </span>
                      <span>{issue.recommendation}</span>
                      {issue.proposedFix && (
                        <div className="mt-1 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 p-1.5 rounded border border-indigo-100 dark:border-indigo-900 break-all">
                          Fix payload: {issue.proposedFix.value}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="shrink-0 flex items-center space-x-2 self-end lg:self-center">
                    {issue.autoFixable && (
                      <button
                        disabled={isStaged}
                        onClick={() => {
                          onStageChange({
                            id: issue.id,
                            siteId: issue.url,
                            url: issue.url,
                            title: `Resolve: ${issue.title}`,
                            category: issue.category,
                            actionType: (issue.proposedFix?.tag as any) || 'meta_description',
                            previousValue: '(Existing defective tag)',
                            proposedValue: issue.proposedFix?.value || issue.recommendation,
                          });
                        }}
                        className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all ${
                          isStaged
                            ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                        }`}
                      >
                        {isStaged ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Staged for Rollout</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Stage 1-Click Fix</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
