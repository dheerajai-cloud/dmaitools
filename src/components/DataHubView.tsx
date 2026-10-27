/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Sparkles, 
  MousePointer, 
  Eye, 
  Percent, 
  Layers,
  ArrowUpDown,
  Filter,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { GscProperty, Ga4Property, GscQuery, Ga4LandingPage, ThemeMode } from '../types';

interface DataHubViewProps {
  gscData: GscProperty;
  ga4Data: Ga4Property;
  onAskAiAboutQuery: (query: GscQuery) => void;
  onAskAiAboutPage: (page: Ga4LandingPage) => void;
  onOpenConnectModal?: () => void;
  theme?: ThemeMode;
}

export const DataHubView: React.FC<DataHubViewProps> = ({
  gscData,
  ga4Data,
  onAskAiAboutQuery,
  onAskAiAboutPage,
  onOpenConnectModal,
  theme = 'light',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'gsc' | 'ga4'>('gsc');
  const [searchFilter, setSearchFilter] = useState('');

  const isDark = theme === 'dark';

  const filteredQueries = gscData.topQueries.filter((q) =>
    q.query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredPages = ga4Data.topLandingPages.filter((p) =>
    p.pagePath.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.pageTitle.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Tab Switcher & Property Status Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm transition-colors ${
        isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1.5 p-1 rounded-xl border text-xs font-semibold ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => {
                setActiveSubTab('gsc');
                setSearchFilter('');
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-2 ${
                activeSubTab === 'gsc'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Google Search Console (GSC)</span>
            </button>
            <button
              onClick={() => {
                setActiveSubTab('ga4');
                setSearchFilter('');
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-2 ${
                activeSubTab === 'ga4'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Google Analytics 4 (GA4)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Active Property: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{gscData.siteUrl}</strong>
            </span>
          </div>

          {onOpenConnectModal && (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-semibold text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Website</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'gsc' ? (
        <>
          {/* GSC Overview KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Total Clicks (30d)</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <MousePointer className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {gscData.totalClicks.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+14.8% vs previous month</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Total Impressions</span>
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {gscData.totalImpressions.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+22.3% SERP exposure</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Average CTR</span>
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {gscData.avgCtr}%
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center space-x-1 mt-1">
                <span>Optimization opportunity (aim for &gt;5%)</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Average Position</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                #{gscData.avgPosition}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                Across {gscData.topQueries.length} monitored target keywords
              </div>
            </div>
          </div>

          {/* GSC Search Queries Table */}
          <div className={`rounded-2xl border overflow-hidden shadow-sm transition-all ${
            isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isDark ? 'border-slate-750 bg-slate-900/50' : 'border-slate-100 bg-slate-50/70'
            }`}>
              <div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Search Performance & Click Intelligence
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Click &ldquo;Ask AI to Optimize&rdquo; on any query to auto-generate high-CTR title and meta fixes
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter search queries..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className={`text-[11px] font-bold uppercase tracking-wider border-b ${
                  isDark ? 'bg-slate-900/80 text-slate-400 border-slate-750' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <tr>
                    <th className="py-3 px-4">Search Query</th>
                    <th className="py-3 px-4">Clicks</th>
                    <th className="py-3 px-4">Impressions</th>
                    <th className="py-3 px-4">CTR</th>
                    <th className="py-3 px-4">Avg Position</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {filteredQueries.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                          <span>{item.query}</span>
                          {item.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                          {item.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                        </div>
                        {item.opportunityNote && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                            💡 {item.opportunityNote}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {item.clicks.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {item.impressions.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                        {item.ctr}%
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        #{item.position}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onAskAiAboutQuery(item)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 font-semibold text-xs transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ask AI to Fix</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* GA4 Analytics View */
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Active Users (30d)</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {ga4Data.totalUsers.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Verified GA4 Measurement Stream
              </div>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Total Sessions</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {ga4Data.totalSessions.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Organic & Referral Traffic
              </div>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Bounce Rate</span>
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {ga4Data.bounceRate}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Average landing page engagement
              </div>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Total Conversions</span>
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {ga4Data.conversions.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                E-commerce purchases & lead submissions
              </div>
            </div>
          </div>

          {/* Landing Pages Table */}
          <div className={`rounded-2xl border overflow-hidden shadow-sm transition-all ${
            isDark ? 'bg-slate-850/90 border-slate-750' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isDark ? 'border-slate-750 bg-slate-900/50' : 'border-slate-100 bg-slate-50/70'
            }`}>
              <div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Top Landing Pages & User Experience
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Cross-examine bounce rates with on-page SEO issues to boost conversions
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter pages..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                  }`}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className={`text-[11px] font-bold uppercase tracking-wider border-b ${
                  isDark ? 'bg-slate-900/80 text-slate-400 border-slate-750' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <tr>
                    <th className="py-3 px-4">Landing Page Path</th>
                    <th className="py-3 px-4">Sessions</th>
                    <th className="py-3 px-4">Users</th>
                    <th className="py-3 px-4">Bounce Rate</th>
                    <th className="py-3 px-4">Conversions</th>
                    <th className="py-3 px-4">Avg Time</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {filteredPages.map((page, idx) => (
                    <tr 
                      key={idx}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{page.pagePath}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">{page.pageTitle}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {page.sessions.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {page.users.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <span className={`px-2 py-0.5 rounded-md ${
                          page.bounceRate > 45 
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {page.bounceRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {page.conversions}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {page.avgEngagementTimeSec}s
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onAskAiAboutPage(page)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Audit Page</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
